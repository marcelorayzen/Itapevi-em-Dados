import axios, { AxiosRequestConfig } from 'axios';
import * as cheerio from 'cheerio';

export async function fetchHTML(url: string, options?: AxiosRequestConfig): Promise<string> {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ItapeviEmDados/0.1)' },
      ...options,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(`Falha ao acessar ${url}: ${error.message}`);
  }
}

export function parseHTML(html: string): cheerio.CheerioAPI {
  return cheerio.load(html);
}

// Função para esperar um tempo (útil para rate limiting)
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
