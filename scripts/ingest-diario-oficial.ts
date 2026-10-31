import 'dotenv/config';
import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createDatabasePool } from '../src/db/connection.js';
import { ProvenanceRepository } from '../src/db/provenance-repository.js';

function valueFor(name: string): string {
  const index = process.argv.indexOf(name);
  const value = index >= 0 ? process.argv[index + 1] : undefined;
  if (!value || value.startsWith('--')) throw new Error(`Argumento obrigatorio ausente: ${name}`);
  return value;
}

function positiveInteger(name: string): number {
  const value = Number(valueFor(name));
  if (!Number.isInteger(value) || value < 1) throw new Error(`${name} deve ser inteiro positivo.`);
  return value;
}

async function main(): Promise<void> {
  const inputPath = resolve(valueFor('--input'));
  const sourceUrl = valueFor('--source-url');
  const edition = positiveInteger('--edition');
  const publishedOn = valueFor('--published-on');
  const pageCount = positiveInteger('--pages');
  const firstContentPage = positiveInteger('--first-content-page');
  const storageRef = valueFor('--storage-ref');
  const [content, fileStats] = await Promise.all([readFile(inputPath), stat(inputPath)]);
  const sha256 = createHash('sha256').update(content).digest('hex').toUpperCase();
  const pool = createDatabasePool();
  const repository = new ProvenanceRepository(pool);
  let runId: string | undefined;

  try {
    await repository.upsertSource({
      sourceId: 'SRC-PREF-DO-001',
      organization: 'Prefeitura do Municipio de Itapevi',
      baseUrl: 'https://itapevi.sp.gov.br/diario-oficial/',
      redistributionStatus: 'allowed',
      reviewedAt: new Date('2026-10-31T00:00:00-03:00'),
    });
    await repository.upsertDataset({
      datasetId: 'DS-PREF-DO',
      sourceId: 'SRC-PREF-DO-001',
      name: 'Diario Oficial do Municipio de Itapevi',
      scope: 'Metadados de edicoes e atos oficiais citaveis por edicao, data e pagina. PDFs brutos permanecem no armazenamento local.',
      updateFrequency: 'por_edicao',
      schemaVersion: 'daily-official-v1',
      status: 'active',
    });
    const artifactId = await repository.recordArtifact({
      datasetId: 'DS-PREF-DO',
      sourceUrl,
      collectedAt: fileStats.birthtime,
      mediaType: 'application/pdf',
      byteSize: fileStats.size,
      sha256,
      storageRef,
      retentionStatus: 'retained_local',
      publicationStatus: 'approved_for_publication',
    });
    const run = {
      artifactId,
      processorName: 'daily-official-metadata',
      processorVersion: 'v1',
      configuration: { edition, published_on: publishedOn, page_count: pageCount, first_content_page: firstContentPage, extractor: 'pdf_text_verified' },
    };
    const priorRunId = await repository.findSucceededProcessingRun(run);
    if (priorRunId) {
      console.log(JSON.stringify({ artifactId, runId: priorRunId, reused: true, sha256 }, null, 2));
      return;
    }
    const started = await repository.startProcessingRun(run);
    runId = started.runId;
    if (!started.created) {
      console.log(JSON.stringify({ artifactId, runId, reused: true, sha256 }, null, 2));
      return;
    }
    const evidenceIds = await Promise.all([
      repository.recordEvidence({ artifactId, locator: { page: 1, section: 'edition_header', verified_by: ['pdf_text'] } }),
      repository.recordEvidence({ artifactId, locator: { page: firstContentPage, section: 'first_official_content', verified_by: ['pdf_text'] } }),
    ]);
    const eventId = await repository.recordEvent({
      eventType: 'official_gazette_published',
      occurredOn: publishedOn,
      payload: { edition, page_count: pageCount, source_url: sourceUrl },
      status: 'accepted',
      runId,
    });
    await Promise.all(evidenceIds.map((evidenceId) => repository.linkEventEvidence(eventId, evidenceId)));
    await repository.finishProcessingRun(runId, 'succeeded');
    console.log(JSON.stringify({ artifactId, runId, eventId, evidenceCount: evidenceIds.length, sha256, reused: false }, null, 2));
  } catch (error) {
    if (runId) await repository.finishProcessingRun(runId, 'failed', error instanceof Error ? error.message : String(error));
    throw error;
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  console.error('Falha ao ingerir Diario Oficial:', error);
  process.exitCode = 1;
});
