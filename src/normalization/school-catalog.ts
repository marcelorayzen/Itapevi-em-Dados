import * as cheerio from 'cheerio';

export interface SchoolCatalogRecord {
  name: string;
  address: string | null;
  phone: string | null;
  sourcePosition: number;
}

function clean(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function candidateName(value: string): boolean {
  return /^(cemeb|associa[cç][aã]o|entidade|apae)\b/i.test(value);
}

function splitDetails(value: string): Pick<SchoolCatalogRecord, 'address' | 'phone'> {
  const phone = clean(value.match(/Contato:\s*([^\n|]+)/i)?.[1] ?? '') || null;
  const withoutPhone = clean(value.replace(/Contato:\s*[^\n|]+/i, ''));
  return { address: withoutPhone || null, phone };
}

export function normalizeSchoolCatalogHtml(html: string): SchoolCatalogRecord[] {
  const $ = cheerio.load(html);
  const records: SchoolCatalogRecord[] = [];
  $('h2, h3, h4, strong').each((position, element) => {
    const name = clean($(element).text());
    if (!candidateName(name)) return;

    const details = clean($(element).nextAll('p').slice(0, 1).text());
    const { address, phone } = splitDetails(details);
    records.push({ name, address, phone, sourcePosition: position + 1 });
  });

  const deduplicated = new Map<string, SchoolCatalogRecord>();
  for (const record of records) {
    const key = record.name.toLocaleLowerCase('pt-BR');
    if (!deduplicated.has(key)) deduplicated.set(key, record);
  }
  if (!deduplicated.size) throw new Error('Nenhuma unidade escolar reconhecida na estrutura da página oficial.');
  return [...deduplicated.values()];
}
