import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ignoredDirectories = new Set(['.git', '.local', '.venv-docling', 'dist', 'node_modules']);

function markdownFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(directory, entry.name);
    if (entry.isDirectory()) return ignoredDirectories.has(entry.name) ? [] : markdownFiles(entryPath);
    return extname(entry.name).toLowerCase() === '.md' ? [entryPath] : [];
  });
}

const failures = [];
for (const file of markdownFiles(root)) {
  const content = readFileSync(file, 'utf8');
  for (const match of content.matchAll(/!?\[[^\]]*\]\(([^)\s]+)(?:\s+[^)]*)?\)/g)) {
    const target = match[1].replace(/^<|>$/g, '');
    if (/^(https?:|mailto:|#)/i.test(target)) continue;
    const localTarget = target.split('#', 1)[0];
    if (!localTarget) continue;
    const resolved = resolve(dirname(file), localTarget);
    if (!existsSync(resolved)) failures.push(`${file.replace(`${root}\\`, '')} -> ${target}`);
  }
}

if (failures.length) {
  console.error('Links locais ausentes na documentação:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Documentação verificada: ${markdownFiles(root).length} arquivos Markdown, sem links locais quebrados.`);
