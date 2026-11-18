/* eslint-disable no-console */
/*
 * Registers newly migrated conditions: appends their source URLs to
 * tools/importer/urls-condition.txt and regenerates the MIGRATED_CONDITION_URLS list in
 * transformers/mayoclinic-cleanup.js (between the
 * <migrated-conditions> markers), so the importers link those conditions to their medical-condition
 * documents. Usage: node tools/importer/structured/register-conditions.mjs <urls-file>
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const IMPORTER = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LIST = path.join(IMPORTER, 'urls-condition.txt');
const CLEANUP = path.join(IMPORTER, 'transformers/mayoclinic-cleanup.js');
const file = process.argv[2];
if (!file) {
  console.error('Usage: register-conditions.mjs <urls-file>');
  process.exit(1);
}
const read = (f) => fs.readFileSync(f, 'utf8').split('\n').map((u) => u.trim()).filter(Boolean);
const known = read(LIST);
const added = read(file).filter((u) => !known.includes(u));
const all = [...known, ...added];
fs.writeFileSync(LIST, `${all.join('\n')}\n`);

const src = fs.readFileSync(CLEANUP, 'utf8');
const start = src.indexOf('// <migrated-conditions>');
const end = src.indexOf('// </migrated-conditions>');
if (start < 0 || end < 0) throw new Error('migrated-conditions markers not found');
const block = [
  '// <migrated-conditions> (generated from tools/importer/urls-condition.txt; keep self-contained)',
  'const MIGRATED_CONDITION_URLS = new Set([',
  ...all.map((u) => `  '${u.replace(/\/$/, '')}',`),
  ']);',
  '',
].join('\n');
fs.writeFileSync(CLEANUP, src.slice(0, start) + block + src.slice(end));
console.log(`conditions registered: ${added.length} new, ${all.length} in total`);
