import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { normalizeLoaMarkdown } from '../src/normalization/loa.js';

function valueFor(name: string): string {
  const index = process.argv.indexOf(name);
  const value = index >= 0 ? process.argv[index + 1] : undefined;
  if (!value || value.startsWith('--')) throw new Error(`Argumento obrigatório ausente: ${name}`);
  return value;
}

async function main(): Promise<void> {
  const input = resolve(valueFor('--input'));
  const output = resolve(valueFor('--output'));
  const markdown = await readFile(input, 'utf8');
  const candidate = normalizeLoaMarkdown(markdown);
  await writeFile(output, `${JSON.stringify(candidate, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ output, type: candidate.type, status: candidate.status }));
}

main().catch((error: unknown) => {
  console.error('Falha ao normalizar LOA:', error);
  process.exitCode = 1;
});
