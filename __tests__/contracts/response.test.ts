import {
  createCommonResponse,
  isCommonResponse,
  RESPONSE_CONTRACT_VERSION,
} from '../../src/contracts/response';

describe('contrato comum de resposta', () => {
  const input = {
    status: 'ok' as const,
    data: { entidade: 'Secretaria de Governo' },
    evidence: [{
      sourceId: 'SRC-LOA-2026-001',
      datasetId: 'DS-LOA-2026',
      artifactSha256: 'D091A74CEE004FF2D6B0E330F6A2626A7E08BA4E33CB82F7AF6403B8DB01D032',
      locator: { page: 51, section: 'orgao_orcamentario' },
    }],
    coverage: { scope: 'orgaos e secretarias municipais da LOA 2026', status: 'pilot' as const },
    limitations: ['Cobertura limitada ao piloto LOA 2026.'],
    confidence: 'high' as const,
    metadata: { municipality: 'Itapevi' },
  };

  it('cria envelope versionado com metadados de geracao', () => {
    const response = createCommonResponse(input);

    expect(response.contractVersion).toBe(RESPONSE_CONTRACT_VERSION);
    expect(response.metadata.generatedAt).toEqual(expect.any(String));
    expect(isCommonResponse(response)).toBe(true);
  });

  it('rejeita resposta aceita sem evidencia', () => {
    expect(() => createCommonResponse({ ...input, evidence: [] })).toThrow('exigem pelo menos uma evidencia');
  });

  it('reconhece somente a versao atual do contrato', () => {
    expect(isCommonResponse({ ...createCommonResponse(input), contractVersion: '2.0' })).toBe(false);
  });
});
