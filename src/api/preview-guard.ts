import { createHash, timingSafeEqual } from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';
import { createCommonResponse } from '../contracts/response.js';

export interface PreviewApiOptions {
  enabled: boolean;
  keyHashes: string[];
  allowedOrigins: string[];
  rateLimitPerMinute: number;
  now?: () => number;
}

type Window = { startedAt: number; count: number };

export function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

export function previewOptionsFromEnvironment(env: NodeJS.ProcessEnv = process.env): PreviewApiOptions {
  const keyHashes = (env.PREVIEW_API_KEY_HASHES ?? '').split(',').map((value) => value.trim().toLowerCase()).filter((value) => /^[a-f0-9]{64}$/.test(value));
  const allowedOrigins = (env.PREVIEW_ALLOWED_ORIGINS ?? '').split(',').map((value) => value.trim()).filter(Boolean);
  const configuredLimit = Number(env.PREVIEW_RATE_LIMIT_PER_MINUTE ?? '30');
  return { enabled: env.PREVIEW_API_ENABLED === 'true', keyHashes, allowedOrigins, rateLimitPerMinute: Number.isInteger(configuredLimit) && configuredLimit > 0 ? configuredLimit : 30 };
}

function response(res: Response, statusCode: number, area: string, limitation: string): void {
  res.status(statusCode).json(createCommonResponse({
    status: 'error', data: { area }, evidence: [], coverage: { scope: 'previa privada de API', status: 'pilot' },
    limitations: [limitation], confidence: 'low', metadata: { municipality: 'Itapevi' },
  }));
}

function authorized(token: string | undefined, keyHashes: string[]): string | undefined {
  if (!token) return undefined;
  const hash = sha256(token);
  const candidate = Buffer.from(hash, 'utf8');
  return keyHashes.find((keyHash) => {
    const expected = Buffer.from(keyHash, 'utf8');
    return expected.length === candidate.length && timingSafeEqual(expected, candidate);
  });
}

export function createPreviewGuard(options: PreviewApiOptions) {
  const windows = new Map<string, Window>();
  const now = options.now ?? Date.now;
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!options.enabled) return response(res, 404, 'previa privada', 'A previsualizacao privada esta desativada.');
    const origin = req.header('origin');
    if (origin) {
      if (!options.allowedOrigins.includes(origin)) return response(res, 403, 'origem', 'A origem solicitante nao esta autorizada para a previsualizacao privada.');
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
    }
    const match = /^Bearer\s+(.+)$/i.exec(req.header('authorization') ?? '');
    const keyHash = authorized(match?.[1], options.keyHashes);
    if (!keyHash) return response(res, 401, 'autenticacao', 'Uma chave de previsualizacao valida e obrigatoria.');
    const timestamp = now();
    const current = windows.get(keyHash);
    const window = !current || timestamp - current.startedAt >= 60_000 ? { startedAt: timestamp, count: 0 } : current;
    window.count += 1;
    windows.set(keyHash, window);
    if (window.count > options.rateLimitPerMinute) {
      res.setHeader('Retry-After', String(Math.max(1, Math.ceil((60_000 - (timestamp - window.startedAt)) / 1000))));
      return response(res, 429, 'limite de requisicoes', 'Limite de requisicoes da previsualizacao privada excedido.');
    }
    next();
  };
}

export function createPreviewPreflight(options: PreviewApiOptions) {
  return (req: Request, res: Response): void => {
    if (!options.enabled) return response(res, 404, 'previa privada', 'A previsualizacao privada esta desativada.');
    const origin = req.header('origin');
    if (!origin || !options.allowedOrigins.includes(origin)) return response(res, 403, 'origem', 'A origem solicitante nao esta autorizada para a previsualizacao privada.');
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization');
    res.setHeader('Vary', 'Origin');
    res.status(204).end();
  };
}
