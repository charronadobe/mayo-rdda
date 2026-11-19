/* eslint-disable no-console, no-restricted-syntax, no-await-in-loop, no-continue, max-len,
   no-loop-func, newline-per-chained-call, import/no-extraneous-dependencies -- import tooling
   (Node, dev dependencies), not site code */
/*
 * Builds medical-condition structured-content documents (schema: medical-condition.schema.json)
 * from imported condition ("Symptoms and causes") pages and the schema.org data of their saved
 * source pages, using Adobe's DA structured-content SDK.
 *
 * Inputs
 *   --pages <dir>      imported condition pages: either <dir>/**\/<slug>/symptoms-causes.plain.html
 *                      (the condition importer's output) or <dir>/<slug>.plain.html
 *   --snapshots <dir>  saved source pages: <dir>/www.mayoclinic.org/diseases-conditions/<slug>/
 *                      symptoms-causes/<id>.html (their JSON-LD: names, symptoms, tests, codes, date)
 *   --out <dir>        where documents are written as <slug>.plain.html (inner <main>), default
 *                      content/health-library/diseases-conditions/medical-condition
 *   --only a,b         limit to these slugs
 *   --check            write nothing; compare with the documents already in --out
 *
 * Every document is validated against the schema and read back (HTML -> JSON) before it is written.
 * Usage: node tools/importer/structured/build-medical-condition.mjs --pages <dir> --snapshots <dir>
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
const SCHEMA = JSON.parse(fs.readFileSync(path.join(HERE, 'medical-condition.schema.json'), 'utf8'));
const SCHEMA_NAME = 'medical-condition';
const DOC_FOLDER = '/health-library/diseases-conditions/medical-condition';

/* ---------------- arguments ---------------- */
const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const PAGES = arg('--pages');
const SNAPSHOTS = arg('--snapshots', path.join(REPO, 'migration-work/cond-snapshots'));
const OUT = path.resolve(arg('--out', path.join(REPO, `content${DOC_FOLDER}`)));
const ONLY = (arg('--only', '') || '').split(',').filter(Boolean);
const CHECK = args.includes('--check');
if (!PAGES) {
  console.error('Usage: build-medical-condition.mjs --pages <dir> [--snapshots <dir>] [--out <dir>] [--only a,b] [--check]');
  process.exit(1);
}

/* ---------------- inputs ---------------- */
/** slug -> imported page file */
function findPages(dir) {
  const found = new Map();
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === 'symptoms-causes.plain.html') found.set(path.basename(d), p);
    else if (e.name.endsWith('.plain.html') && path.resolve(d) === path.resolve(dir)) found.set(e.name.replace('.plain.html', ''), p);
  });
  walk(dir);
  return found;
}

/** The source page's schema.org data: MedicalCondition, datePublished and URL. */
function sourceData(slug) {
  const dir = path.join(SNAPSHOTS, 'www.mayoclinic.org/diseases-conditions', slug, 'symptoms-causes');
  if (!fs.existsSync(dir)) return {};
  const file = fs.readdirSync(dir).find((f) => f.endsWith('.html'));
  if (!file) return {};
  const html = fs.readFileSync(path.join(dir, file), 'utf8');
  const rec = { sourceUrl: `https://www.mayoclinic.org/diseases-conditions/${slug}/symptoms-causes/${file.replace(/\.html$/, '')}` };
  const og = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/) || html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/);
  if (og) rec.ogImage = og[1].replace(/&amp;/g, '&');
  for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    let j;
    try { j = JSON.parse(m[1]); } catch (e) { continue; }
    if (j['@type'] === 'WebPage') { rec.datePublished = j.datePublished; if (j.url) rec.sourceUrl = j.url; }
    if (j['@type'] === 'MedicalWebPage') rec.condition = j.about;
  }
  return rec;
}

/* ---------------- images ---------------- */
// Images from www.mayoclinic.org (bot-protected) and Kaltura video thumbnails are hosted in DA, under
// the same names the importer uses (transformers/mayoclinic-cleanup.js daMediaUrl). The import keeps
// the original addresses (from the pictures' sources), so they are mapped here; the image files
// themselves are uploaded to DA (media/mayoclinic, media/thumbnails) and previewed/published separately.
const DA_MEDIA = 'https://content.da.live/charronadobe/mayo-rdda/media/mayoclinic';
const DA_KALTURA = 'https://content.da.live/charronadobe/mayo-rdda/media/thumbnails';
// different illustrations with the same file name: all but the first get their own DA name
const ASSET_RENAMES = {
  '/content/dam/hecs-ccms/global/images/hil-procedures/2024/07/18/healthy-liver-vs-liver-cirrhosis-en.jpg': 'healthy-liver-vs-liver-cirrhosis-en-2.jpg',
};
function mediaUrl(src) {
  if (!src) return src;
  let url;
  try { url = new URL(src, 'https://www.mayoclinic.org'); } catch (e) { return src; }
  if (/(^|\.)kaltura\.com$/.test(url.hostname)) {
    const entry = (url.pathname.match(/\/entry_id\/([^/]+)/) || [])[1];
    // no underscores: Edge Delivery can't preview a DA file whose name has "_"
    return entry ? `${DA_KALTURA}/kaltura-${entry.toLowerCase().replace(/[^a-z0-9-]/g, '-')}.jpg` : src;
  }
  if (!['www.mayoclinic.org', 'assets.mayoclinic.org'].includes(url.hostname)) return src;
  let name = decodeURIComponent(url.pathname.split('/').pop() || '').toLowerCase().replace(/[^a-z0-9._-]/g, '-');
  // illustrations (assets.mayoclinic.org) are hosted in DA media/mayoclinic too, without "_"
  if (url.hostname === 'assets.mayoclinic.org') {
    name = ASSET_RENAMES[url.pathname.toLowerCase()] || name.replace(/_/g, '-');
  }
  return name ? `${DA_MEDIA}/${name}` : src;
}

/* ---------------- page -> data ---------------- */
const SECTIONS = {
  overview: 'overview',
  symptoms: 'symptoms',
  'when to see a doctor': 'whenToSeeADoctor',
  causes: 'causes',
  'risk factors': 'riskFactors',
  complications: 'complications',
  prevention: 'prevention',
};
const SECTION_LABEL = {
  overview: 'Overview',
  symptoms: 'Symptoms',
  whenToSeeADoctor: 'When to see a doctor',
  causes: 'Causes',
  riskFactors: 'Risk factors',
  complications: 'Complications',
  prevention: 'Prevention',
};
// article sections beyond the standard ones (kept as "Other sections")
const EXTRA = /^(types|when to get emergency help)$/i;
// link sections: their cards and link paragraphs become related links
const LINKS = {
  'associated procedures': 'associatedProcedure',
  'related content': 'relatedLink',
  'more information': 'relatedLink',
  'related information': 'relatedLink',
  'related links': 'relatedLink',
  'history of infectious disease outbreaks and vaccines timeline': 'relatedLink',
};
const SIDE_NAV = /^(diagnosis (and|&) treatment|doctors (and|&) departments|care at mayo clinic)$/i;
const RICH = ['overview', 'symptoms', 'whenToSeeADoctor', 'causes', 'riskFactors', 'complications', 'prevention'];

const text = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');

/** Lead-in name and explanation of a list item ("Tobacco use. Smoking ..."). */
function namedItem(li) {
  const first = li.firstElementChild;
  const strong = first && first.tagName === 'STRONG' && li.firstChild === first ? first : null;
  const all = text(li);
  if (strong) {
    const name = text(strong).replace(/[.:]\s*$/, '');
    const rest = all.slice(text(strong).length).trim();
    return { name, description: rest || undefined };
  }
  const m = all.match(/^([^.]{2,90}?)\.\s+(.*)$/);
  if (m && m[1].split(' ').length <= 8) return { name: m[1], description: m[2] };
  return all.length <= 160 ? { name: all.replace(/\.$/, '') } : null;
}

/** Text of a cell, its paragraphs separated by blank lines. */
function longText(cell) {
  const paras = [...cell.querySelectorAll('p')];
  return paras.length ? paras.map(text).filter(Boolean).join('\n\n') : text(cell);
}

function extract(document) {
  const main = document.querySelector('main');
  const r = {
    sections: {}, extra: [], lists: {}, illustration: [], video: [], citation: [], associatedProcedure: [], relatedLink: [], skipped: [], meta: {},
  };
  main.querySelectorAll('.metadata > div').forEach((row) => {
    const [k, v] = row.children;
    if (!k || !v) return;
    const img = v.querySelector('img');
    r.meta[text(k).toLowerCase()] = img ? img.getAttribute('src') : text(v);
  });
  const h1 = main.querySelector('h1');
  if (h1) r.h1 = (h1.innerHTML.split(/<br\s*\/?>/i)[0] || '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim();
  main.querySelectorAll('.cards-side-nav a[href]').forEach((a) => {
    if (SIDE_NAV.test(text(a))) r.relatedLink.push({ name: text(a), url: a.getAttribute('href') });
  });

  const nodes = [];
  [...main.children].forEach((section) => [...section.children].forEach((c) => nodes.push(c)));
  let key = null;
  let linkKey = null;
  const html = {};
  const clean = (el) => {
    const c = el.cloneNode(true);
    c.querySelectorAll('picture, img').forEach((p) => p.remove());
    c.querySelectorAll('[id]').forEach((e) => e.removeAttribute('id'));
    c.removeAttribute('id');
    return c.outerHTML;
  };
  const push = (k, h) => { (html[k] = html[k] || []).push(h); };
  const cellOf = (block, n) => {
    const row = block.firstElementChild;
    return row && row.children[n - 1];
  };
  for (let i = 0; i < nodes.length; i += 1) {
    const el = nodes[i];
    const tag = el.tagName;
    if (el.matches('.metadata, .section-metadata, .cards-side-nav') || tag === 'H1') continue;
    if (tag === 'H2') {
      const t = text(el).toLowerCase();
      linkKey = LINKS[t] || null;
      if (SECTIONS[t]) { key = SECTIONS[t]; continue; }
      if (EXTRA.test(t)) { key = `extra:${text(el)}`; r.extra.push(text(el)); continue; }
      key = null;
      if (!linkKey) r.skipped.push(`section: ${text(el)}`);
      continue;
    }
    // references, wherever the accordion sits
    if (el.matches('.accordion-toggle') && /references/i.test(text(cellOf(el, 1)))) {
      cellOf(el, 2).querySelectorAll('li').forEach((li) => r.citation.push(text(li)));
      continue;
    }
    if (linkKey && el.matches('.cards-show-more')) {
      el.querySelectorAll('a[href]').forEach((a) => r[linkKey].push({ name: text(a), url: a.getAttribute('href') }));
      continue;
    }
    if (linkKey && tag === 'P' && !el.querySelector('strong a')) {
      el.querySelectorAll('a[href]').forEach((a) => r[linkKey].push({ name: text(a), url: a.getAttribute('href') }));
      continue;
    }
    if (!key) continue;
    if (tag === 'H3' && /^when to see a doctor$/i.test(text(el))) { key = 'whenToSeeADoctor'; continue; }
    if (el.matches('.video-inline')) {
      const img = el.querySelector('img');
      const a = el.querySelector('a[href]');
      const v = { name: text(a) || (img && img.getAttribute('alt')) || '', url: a && a.getAttribute('href'), thumbnailUrl: img && img.getAttribute('src') };
      if (nodes[i + 1] && nodes[i + 1].tagName === 'H3' && text(nodes[i + 1]) === v.name) i += 1;
      const n = nodes[i + 1];
      if (n && n.matches('.accordion-toggle') && /transcript/i.test(text(cellOf(n, 1)))) {
        v.transcript = longText(cellOf(n, 2));
        i += 1;
      }
      v.section = SECTION_LABEL[key] || 'Other';
      r.video.push(v);
      continue;
    }
    if (el.matches('.accordion-toggle')) { r.skipped.push(`accordion in ${key}: ${text(cellOf(el, 1))}`); continue; }
    if (tag === 'DIV') { r.skipped.push(`block in ${key}: ${el.className}`); continue; }
    if (tag === 'P' && el.querySelector('picture, img') && !text(el)) {
      const img = el.querySelector('img');
      const im = { url: img.getAttribute('src'), alt: img.getAttribute('alt') || undefined, section: SECTION_LABEL[key] || 'Other' };
      const n1 = nodes[i + 1];
      if (n1 && n1.tagName === 'P' && n1.children.length === 1 && n1.firstElementChild.tagName === 'STRONG' && text(n1) === text(n1.firstElementChild)) {
        im.name = text(n1);
        i += 1;
        const n2 = nodes[i + 1];
        if (n2 && n2.tagName === 'P' && !n2.querySelector('img')) { im.caption = text(n2); i += 1; }
      }
      r.illustration.push(im);
      continue;
    }
    if (/^(P|H3|H4|H5|H6|UL|OL|BLOCKQUOTE)$/.test(tag)) {
      push(key, clean(el));
      if ((tag === 'UL' || tag === 'OL') && !key.startsWith('extra:') && !r.lists[key]) {
        r.lists[key] = [...el.children].filter((c) => c.tagName === 'LI').map(namedItem).filter(Boolean);
      }
    } else {
      r.skipped.push(`element in ${key}: ${tag}`);
    }
  }
  r.sections = Object.fromEntries(Object.entries(html).map(([k, v]) => [k, v.join('')]));
  return r;
}

const names = (arr) => (arr || []).map((x) => (typeof x === 'string' ? x : x.name)).filter(Boolean);
const tidy = (s) => s && s.replace(/>\s+</g, '><').trim();

function toData(slug, r, src) {
  const c = src.condition || {};
  const alt = [...(c.alternateName || [])];
  if (c.name && r.h1 && c.name !== r.h1 && !alt.includes(c.name)) alt.unshift(c.name);
  const name = r.h1 || c.name;
  // share image: the page's metadata image, else the source page's og:image
  const shareImage = mediaUrl(r.meta.image || src.ogImage);
  r.illustration.forEach((im) => { im.url = mediaUrl(im.url); });
  r.video.forEach((v) => { v.thumbnailUrl = mediaUrl(v.thumbnailUrl); });
  const doc = {
    // the page title is the name readers see; the source's schema.org name is an alternate name
    name,
    alternateName: alt.length ? alt : undefined,
    description: r.meta.description,
    url: `${DOC_FOLDER}/${slug}`,
    sameAs: src.sourceUrl,
    image: shareImage ? { url: shareImage, alt: name } : undefined,
    lastReviewed: src.datePublished ? src.datePublished.slice(0, 10) : undefined,
    author: 'Mayo Clinic Staff',
    audience: 'Patient',
    code: (c.code || []).map((x) => ({ codeValue: String(x.codeValue), codingSystem: x.codingSystem, name: x.name })),
    associatedAnatomy: names(c.associatedAnatomy),
    // the source spells it signORsymptom
    signOrSymptom: names(c.signORsymptom || c.signOrSymptom),
    typicalTest: names(c.typicalTest),
    cause: r.lists.causes,
    riskFactor: r.lists.riskFactors,
    possibleComplication: r.lists.complications,
    primaryPrevention: r.lists.prevention,
    additionalSection: r.extra.map((h) => ({ heading: h, body: tidy(r.sections[`extra:${h}`]) })),
    illustration: r.illustration,
    video: r.video,
    citation: r.citation,
    associatedProcedure: r.associatedProcedure,
    relatedLink: r.relatedLink,
  };
  RICH.forEach((k) => { doc[k] = tidy(r.sections[k]); });
  // field order as in the schema
  const ordered = {};
  Object.keys(SCHEMA.properties).forEach((k) => {
    const v = doc[k];
    if (v !== undefined && !(Array.isArray(v) && !v.length)) ordered[k] = v;
  });
  return ordered;
}

/* ---------------- data -> document ---------------- */
const dec = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&nbsp;|&#xa0;/g, ' ');
// what a reader sees: rich text by its words and link targets, other values trimmed
const seen = (v) => JSON.stringify(v, (k, x) => {
  if (x === null || x === '') return undefined;
  if (typeof x === 'string' && /<\/?(p|ul|ol|li|h\d|strong|a)\b/.test(x)) {
    return { text: dec(x.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim(), links: [...x.matchAll(/href="([^"]*)"/g)].map((m) => dec(m[1])) };
  }
  return typeof x === 'string' ? x.replace(/\s+/g, ' ').trim() : x;
});

function toDocument(data) {
  const v = validateData({ schema: SCHEMA, data });
  if (!v.valid) {
    const errs = Object.entries(v.errors).slice(0, 3).map(([p, e]) => `${p} ${e.message}`);
    return { error: `invalid: ${[...v.schemaIssues.map((s) => s.message || s), ...errs].join('; ')}` };
  }
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

/** Data of an existing document (for --check). */
function existingData(file) {
  const html = `<body><header></header><main>${fs.readFileSync(file, 'utf8')}</main><footer></footer></body>`;
  const back = convertHtmlToJson({ html });
  return back.error ? null : createEngine({ schema: SCHEMA, document: back.json }).getState().document.data;
}

/* ---------------- run ---------------- */
const pages = findPages(PAGES);
const slugs = [...pages.keys()].filter((s) => !ONLY.length || ONLY.includes(s)).sort();
if (!CHECK) fs.mkdirSync(OUT, { recursive: true });
const report = {
  built: 0, failed: [], noSource: [], skipped: {}, same: 0, different: [],
};
for (const slug of slugs) {
  const { document } = parseHTML(`<html><body><main>${fs.readFileSync(pages.get(slug), 'utf8')}</main></body></html>`);
  const src = sourceData(slug);
  if (!src.condition) report.noSource.push(slug);
  const r = extract(document);
  r.skipped.forEach((s) => { report.skipped[s] = (report.skipped[s] || 0) + 1; });
  const res = toDocument(toData(slug, r, src));
  if (res.error) { report.failed.push(`${slug}: ${res.error}`); continue; }
  const file = path.join(OUT, `${slug}.plain.html`);
  if (CHECK) {
    const old = fs.existsSync(file) ? existingData(file) : null;
    if (!old) { report.different.push(`${slug}: no existing document`); continue; }
    const diff = Object.keys({ ...old, ...res.data }).filter((k) => seen(old[k]) !== seen(res.data[k]));
    if (diff.length) report.different.push(`${slug}: ${diff.join(', ')}`); else report.same += 1;
    continue;
  }
  const inner = (res.html.match(/<main>([\s\S]*)<\/main>/) || [null, res.html])[1];
  fs.writeFileSync(file, `${inner}\n`);
  report.built += 1;
}

console.log(`pages: ${slugs.length} | ${CHECK ? `same as existing: ${report.same} | different: ${report.different.length}` : `documents written: ${report.built} to ${path.relative(REPO, OUT)}`} | failed: ${report.failed.length} | without source data: ${report.noSource.length}`);
[...report.failed, ...report.different].slice(0, 25).forEach((x) => console.log(`  ${x}`));
const top = Object.entries(report.skipped).sort((a, b) => b[1] - a[1]).slice(0, 10);
if (top.length) console.log(`left out (not part of the schema): ${top.map(([k, n]) => `${k} ×${n}`).join('; ')}`);
