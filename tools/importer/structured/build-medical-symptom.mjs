/* eslint-disable no-console, no-restricted-syntax, no-continue, max-len, no-loop-func,
   newline-per-chained-call, import/no-extraneous-dependencies -- import tooling (Node, dev
   dependencies), not site code */
/*
 * Builds medical-symptom structured-content documents (schema: medical-symptom.schema.json) from
 * saved mayoclinic.org symptom pages, using Adobe's DA structured-content SDK.
 *
 * Inputs
 *   --snapshots <dir>  saved symptom pages: <dir>/www.mayoclinic.org/symptoms/<slug>/basics/causes/<id>.html
 *   --out <dir>        where documents are written as <slug>.plain.html (inner <main>), default
 *                      content/health-library/symptoms
 *   --only a,b         limit to these slugs
 *
 * Links to conditions migrated to this site point to their medical-condition documents, links to
 * symptoms in the same run to their medical-symptom documents; other links stay on mayoclinic.org.
 * Every document is validated against the schema and read back before it is written.
 * Usage: node tools/importer/structured/build-medical-symptom.mjs --snapshots <dir>
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseHTML } from 'linkedom';
import {
  validateData, createEngine, convertJsonToHtml, convertHtmlToJson,
} from '@adobe/da-sc-sdk';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../..');
const SCHEMA = JSON.parse(fs.readFileSync(path.join(HERE, 'medical-symptom.schema.json'), 'utf8'));
const SCHEMA_NAME = 'medical-symptom';
const DOC_FOLDER = '/health-library/symptoms';
const CONDITION_FOLDER = '/health-library/diseases-conditions/medical-condition';
const MAYO = 'https://www.mayoclinic.org';

const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const SNAPSHOTS = arg('--snapshots', path.join(REPO, 'migration-work/symptoms/snapshots'));
const OUT = path.resolve(arg('--out', path.join(REPO, `content${DOC_FOLDER}`)));
const ONLY = (arg('--only', '') || '').split(',').filter(Boolean);

/* ---------------- inputs ---------------- */
/** slug -> { file, url } of every saved symptom page */
function findPages() {
  const root = path.join(SNAPSHOTS, 'www.mayoclinic.org/symptoms');
  const pages = new Map();
  fs.readdirSync(root).forEach((slug) => {
    const dir = path.join(root, slug, 'basics/causes');
    if (!fs.existsSync(dir)) return;
    const f = fs.readdirSync(dir).find((x) => x.endsWith('.html'));
    if (f) pages.set(slug, { file: path.join(dir, f), url: `${MAYO}/symptoms/${slug}/basics/causes/${f.replace(/\.html$/, '')}` });
  });
  return pages;
}
// migrated conditions: source path (without trailing slash) -> slug
const MIGRATED = new Map(fs.readFileSync(path.join(REPO, 'tools/importer/urls-condition.txt'), 'utf8').split('\n').filter(Boolean)
  .map((u) => [new URL(u).pathname.replace(/\/$/, ''), new URL(u).pathname.split('/')[2]]));

/* ---------------- links and images ---------------- */
let SYMPTOMS = new Set();
function siteHref(href) {
  if (!href || href.startsWith('#') || /^(mailto|tel):/.test(href)) return href;
  let url;
  try { url = new URL(href, MAYO); } catch (e) { return href; }
  if (url.hostname === 'www.mayoclinic.org') {
    const p = url.pathname.replace(/\/$/, '');
    if (MIGRATED.has(p)) return `${CONDITION_FOLDER}/${MIGRATED.get(p)}`;
    const sym = p.match(/^\/symptoms\/([^/]+)\/basics\//);
    if (sym && SYMPTOMS.has(sym[1])) return `${DOC_FOLDER}/${sym[1]}`;
  }
  return url.href;
}
// images from www.mayoclinic.org (bot-protected) are hosted in DA under media/mayoclinic (same rule as
// the cleanup transformer's daMediaUrl)
const DA_MEDIA = 'https://content.da.live/charronadobe/mayo-rdda/media/mayoclinic';
function mediaUrl(src) {
  if (!src) return src;
  let url;
  try { url = new URL(src, MAYO); } catch (e) { return src; }
  if (url.hostname !== 'www.mayoclinic.org') return url.href;
  const name = decodeURIComponent(url.pathname.split('/').pop() || '').toLowerCase().replace(/[^a-z0-9._-]/g, '-');
  return name ? `${DA_MEDIA}/${name}` : src;
}

/* ---------------- page -> data ---------------- */
const text = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
const BLOCK = /^(P|UL|OL|H3|H4|H5|BLOCKQUOTE|TABLE)$/;
const INLINE_KEEP = { A: 'a', STRONG: 'strong', B: 'strong', EM: 'em', I: 'em', BR: 'br', SUP: 'sup', SUB: 'sub' };
const SKIP = '.cmp-hil-article-references, .cmp-dynamic-related-content, .cmp-advertisement, .cmp-mobile-advertisement, .cmp-expando, script, style, svg, button';
const MONTHS = { jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06', jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12' };

/** Clean copy of a block element: allowed tags only, links pointed at this site where migrated. */
function cleanBlock(document, el) {
  const copy = (node, into) => {
    node.childNodes.forEach((c) => {
      if (c.nodeType === 3) { into.append(document.createTextNode(c.textContent)); return; }
      if (c.nodeType !== 1 || c.matches(SKIP)) return;
      const tag = c.tagName;
      if (tag === 'UL' || tag === 'OL' || tag === 'LI' || tag === 'P') {
        const n = document.createElement(tag.toLowerCase());
        copy(c, n);
        if (n.textContent.trim()) into.append(n);
        return;
      }
      if (INLINE_KEEP[tag]) {
        const n = document.createElement(INLINE_KEEP[tag]);
        if (tag === 'A') n.setAttribute('href', siteHref(c.getAttribute('href') || ''));
        if (tag !== 'BR') copy(c, n);
        into.append(n);
        return;
      }
      copy(c, into); // unwrap spans, divs and other wrappers
    });
  };
  const out = document.createElement(el.tagName.toLowerCase());
  copy(el, out);
  return out.outerHTML.replace(/\s+/g, ' ').replace(/>\s+</g, '><').replace(/\s+<\//g, '</').trim();
}

/** Block elements (and images) of a section container, in order. */
function blocksOf(container, out = []) {
  [...container.children].forEach((c) => {
    if (c.matches(SKIP) || c.matches('.cmp-title:has(h2)') || c.tagName === 'H2') return;
    if (c.tagName === 'IMG') { out.push(c); return; }
    if (BLOCK.test(c.tagName)) { out.push(c); return; }
    blocksOf(c, out);
  });
  return out;
}

function parseDate(s) {
  const m = (s || '').match(/([A-Za-z]{3})[a-z]*\.?\s+(\d{1,2}),\s*(\d{4})/);
  return m && MONTHS[m[1].toLowerCase()] ? `${m[3]}-${MONTHS[m[1].toLowerCase()]}-${m[2].padStart(2, '0')}` : undefined;
}

function extract(document) {
  const main = document.querySelector('#main-content');
  const r = {
    sections: {}, cause: [], illustration: [], citation: [], associatedProcedure: [], relatedLink: [], extra: [], skipped: [],
  };
  r.h1 = text(main.querySelector('h1'));
  r.date = parseDate(text(document.querySelector('.cmp-health-information-topic__date')));
  const meta = (sel) => (document.querySelector(sel) || { getAttribute: () => undefined }).getAttribute('content');
  r.description = meta('meta[name="description"]');
  r.ogImage = meta('meta[property="og:image"]');
  const SECTIONS = { definition: 'definition', causes: 'causes', 'when to see a doctor': 'whenToSeeADoctor' };
  const LABEL = { definition: 'Definition', causes: 'Causes', whenToSeeADoctor: 'When to see a doctor', selfCare: 'Self-care' };
  const html = {};
  main.querySelectorAll('h2').forEach((h2) => {
    const t = text(h2).toLowerCase();
    let box = h2.parentElement;
    while (box && !box.querySelector('p, ul, ol') && box.id !== 'main-content') box = box.parentElement;
    if (!box || box.id === 'main-content') return;
    if (t === 'associated procedures' || t === 'related content') {
      const key = t === 'related content' ? 'relatedLink' : 'associatedProcedure';
      box.querySelectorAll('li a[href]').forEach((a) => r[key].push({ name: text(a), url: siteHref(a.getAttribute('href')) }));
      return;
    }
    if (!SECTIONS[t]) { if (!/^(on this page|advertisement|mayo clinic press|giving tuesday|from mayo clinic to your inbox|products & services|news from mayo clinic)/i.test(t)) r.skipped.push(`section: ${text(h2)}`); return; }
    let key = SECTIONS[t];
    let group = null;
    blocksOf(box).forEach((b) => {
      if (b.tagName === 'IMG') {
        const src = b.getAttribute('src') || '';
        if (/\/icons\/|\.svg($|\?)/i.test(src)) return; // decorative icons (warning sign)
        r.illustration.push({ url: mediaUrl(src), alt: b.getAttribute('alt') || undefined, section: LABEL[key] || 'Other' });
        return;
      }
      if (/^H[3-5]$/.test(b.tagName)) {
        group = text(b).replace(/[:.]$/, '');
        if (key === 'whenToSeeADoctor' && /^self-care/i.test(group)) key = 'selfCare';
      }
      (html[key] = html[key] || []).push(cleanBlock(document, b));
      if (key === 'causes') {
        b.querySelectorAll(':scope > li').forEach((li) => {
          const a = li.querySelector('a[href]');
          const name = a ? text(a) : text(li);
          if (!name || name.length > 160) return;
          r.cause.push({ name: name.replace(/\.$/, ''), url: a ? siteHref(a.getAttribute('href')) : undefined, category: group || undefined });
        });
      }
    });
  });
  main.querySelectorAll('.cmp-hil-article-references li').forEach((li) => r.citation.push(text(li)));
  if (!r.relatedLink.length) main.querySelectorAll('.cmp-dynamic-related-content li a[href]').forEach((a) => r.relatedLink.push({ name: text(a), url: siteHref(a.getAttribute('href')) }));
  r.sections = Object.fromEntries(Object.entries(html).map(([k, v]) => [k, v.join('')]));
  return r;
}

function toData(slug, r, sourceUrl) {
  // "Loss of smell (anosmia)": the term in parentheses is an alternate name (not "(male)" and the like)
  const paren = (r.h1.match(/\(([^)]+)\)\s*$/) || [])[1];
  const alternateName = paren && !/^(male|female|adult|child|children)$/i.test(paren) ? [paren] : undefined;
  const share = mediaUrl(r.ogImage);
  const doc = {
    name: r.h1,
    alternateName,
    description: r.description,
    url: `${DOC_FOLDER}/${slug}`,
    sameAs: sourceUrl,
    image: share ? { url: share, alt: r.h1 } : undefined,
    lastReviewed: r.date,
    author: 'Mayo Clinic Staff',
    audience: 'Patient',
    definition: r.sections.definition,
    causes: r.sections.causes,
    cause: r.cause,
    whenToSeeADoctor: r.sections.whenToSeeADoctor,
    selfCare: r.sections.selfCare,
    illustration: r.illustration,
    citation: r.citation,
    associatedProcedure: r.associatedProcedure,
    relatedLink: r.relatedLink,
  };
  const ordered = {};
  Object.keys(SCHEMA.properties).forEach((k) => {
    const v = doc[k];
    if (v !== undefined && v !== '' && !(Array.isArray(v) && !v.length)) ordered[k] = v;
  });
  return ordered;
}

/* ---------------- data -> document ---------------- */
const dec = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&nbsp;|&#xa0;/g, ' ');
const seen = (v) => JSON.stringify(v, (k, x) => {
  if (x === null || x === '') return undefined;
  if (typeof x === 'string' && /<\/?(p|ul|ol|li|h\d|strong|a)\b/.test(x)) {
    return { text: dec(x.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim(), links: [...x.matchAll(/href="([^"]*)"/g)].map((m) => dec(m[1])) };
  }
  return typeof x === 'string' ? x.replace(/\s+/g, ' ').trim() : x;
});

function toDocument(data) {
  const v = validateData({ schema: SCHEMA, data });
  if (!v.valid) return { error: `invalid: ${Object.entries(v.errors).slice(0, 3).map(([p, e]) => `${p} ${e.message}`).join('; ')}` };
  // da.live's form editor needs a "title" and an "x-schema-name" row in the da-form block
  const { document, model } = createEngine({ schema: SCHEMA, document: { metadata: { title: data.name, schemaName: SCHEMA_NAME }, data } }).getState();
  const out = convertJsonToHtml({ json: document, model });
  if (out.error) return { error: out.error };
  const back = convertHtmlToJson({ html: out.html });
  if (back.error) return { error: `read-back: ${back.error}` };
  const reread = createEngine({ schema: SCHEMA, document: back.json }).getState().document.data;
  const lost = Object.keys({ ...document.data, ...reread }).filter((k) => seen(document.data[k]) !== seen(reread[k]));
  if (lost.length) return { error: `read-back differs: ${lost.join(', ')}` };
  return { html: out.html, data: document.data };
}

/* ---------------- run ---------------- */
const pages = findPages();
SYMPTOMS = new Set(pages.keys());
const slugs = [...pages.keys()].filter((s) => !ONLY.length || ONLY.includes(s)).sort();
fs.mkdirSync(OUT, { recursive: true });
const report = { built: 0, failed: [], skipped: {}, stats: {} };
const stat = (k, n = 1) => { report.stats[k] = (report.stats[k] || 0) + n; };
for (const slug of slugs) {
  const { file, url } = pages.get(slug);
  const html = fs.readFileSync(file, 'utf8').replace(/<script[\s\S]*?<\/script>/g, '');
  const { document } = parseHTML(html);
  const r = extract(document);
  r.skipped.forEach((s) => { report.skipped[s] = (report.skipped[s] || 0) + 1; });
  const data = toData(slug, r, url);
  ['definition', 'causes', 'whenToSeeADoctor', 'selfCare', 'illustration', 'citation', 'relatedLink', 'associatedProcedure', 'alternateName', 'lastReviewed'].forEach((k) => { if (data[k]) stat(k); });
  stat('cause entries', (data.cause || []).length);
  stat('causes linked to migrated conditions', (data.cause || []).filter((c) => (c.url || '').startsWith(CONDITION_FOLDER)).length);
  const res = toDocument(data);
  if (res.error) { report.failed.push(`${slug}: ${res.error}`); continue; }
  const inner = (res.html.match(/<main>([\s\S]*)<\/main>/) || [null, res.html])[1];
  fs.writeFileSync(path.join(OUT, `${slug}.plain.html`), `${inner}\n`);
  report.built += 1;
}
console.log(`symptom pages: ${slugs.length} | documents written: ${report.built} to ${path.relative(REPO, OUT)} | failed: ${report.failed.length}`);
report.failed.slice(0, 20).forEach((x) => console.log(`  ${x}`));
console.log(`fields: ${Object.entries(report.stats).map(([k, n]) => `${k} ${n}`).join(' | ')}`);
const top = Object.entries(report.skipped).sort((a, b) => b[1] - a[1]).slice(0, 10);
if (top.length) console.log(`left out: ${top.map(([k, n]) => `${k} ×${n}`).join('; ')}`);
