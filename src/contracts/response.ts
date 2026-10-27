export const RESPONSE_CONTRACT_VERSION = '1.0' as const;

export type ResponseStatus = 'ok' | 'partial' | 'not_found' | 'error';
export type Confidence = 'high' | 'medium' | 'low' | 'needs_review';

export interface EvidenceReference {
  sourceId: string;
  datasetId: string;
  artifactSha256?: string;
  sourceUrl?: string;
  locator?: Record<string, unknown>;
  collectedAt?: string;
}

export interface Coverage {
  scope: string;
  status: 'complete' | 'partial' | 'pilot' | 'unknown';
  asOf?: string;
  excluded?: string[];
}

export interface ResponseMetadata {
  municipality: string;
  generatedAt: string;
  requestId?: string;
}

export interface CommonResponse<T> {
  contractVersion: typeof RESPONSE_CONTRACT_VERSION;
  status: ResponseStatus;
  data: T;
  evidence: EvidenceReference[];
  coverage: Coverage;
  limitations: string[];
  confidence: Confidence;
  metadata: ResponseMetadata;
}

export type CommonResponseInput<T> = Omit<CommonResponse<T>, 'contractVersion' | 'metadata'> & {
  metadata: Omit<ResponseMetadata, 'generatedAt'> & { generatedAt?: string };
};

export function createCommonResponse<T>(input: CommonResponseInput<T>): CommonResponse<T> {
  if (!input.metadata.municipality.trim()) {
    throw new Error('metadata.municipality e obrigatorio.');
  }
  if (!input.coverage.scope.trim()) {
    throw new Error('coverage.scope e obrigatorio.');
  }
  if (input.status === 'ok' && input.evidence.length === 0) {
    throw new Error('Respostas com status ok exigem pelo menos uma evidencia.');
  }

  return {
    ...input,
    contractVersion: RESPONSE_CONTRACT_VERSION,
    metadata: {
      ...input.metadata,
      generatedAt: input.metadata.generatedAt ?? new Date().toISOString(),
    },
  };
}

export function isCommonResponse(value: unknown): value is CommonResponse<unknown> {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<CommonResponse<unknown>>;
  return candidate.contractVersion === RESPONSE_CONTRACT_VERSION
    && typeof candidate.status === 'string'
    && Array.isArray(candidate.evidence)
    && Array.isArray(candidate.limitations)
    && typeof candidate.coverage?.scope === 'string'
    && typeof candidate.metadata?.municipality === 'string'
    && typeof candidate.metadata?.generatedAt === 'string';
}
