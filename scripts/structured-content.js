/*
 * Structured content (DA form documents) rendered as regular pages.
 *
 * A DA structured-content document is delivered as a `da-form` block (title, x-schema-name), a data
 * block named after the schema with one row per field (key | value), and one block per nested
 * object or rich-text value, referenced from the data block as `self://#<key>-<n>` and
 * `self://rich-text#<key>-<n>`. This module reads that markup back into data and, for the
 * medical-condition schema, rebuilds the page in the layout of a condition "Symptoms and causes"
 * page (side navigation, article sections, references, associated procedures), so the existing
 * blocks and styles apply. It runs before decorateMain().
 */

import { toClassName } from './aem.js';

const RICH_REF = /^self:\/\/rich-text#(.+)$/;
const OBJECT_REF = /^self:\/\/#(.+)$/;
// images and thumbnails stored in DA are served by the site at the same path once published
const DA_CONTENT = /^https:\/\/content\.da\.live\/[^/]+\/[^/]+(\/.*)$/;

/** Rows of a block as [key, value cell] pairs (rows with fewer than two cells are skipped). */
function rows(block) {
  return [...block.children]
    .map((row) => [...row.children])
    .filter((cells) => cells.length >= 2)
    .map(([key, value]) => [key.textContent.trim(), value]);
}

/**
 * Reads a structured-content document from `main`.
 * @param {Element} main
 * @returns {{schemaName: string, title: string, data: object, blocks: Element[]}|null}
 */
export function readStructuredContent(main) {
  const form = main.querySelector(':scope > div > .da-form');
  if (!form) return null;
  const meta = Object.fromEntries(rows(form).map(([k, v]) => [k, v.textContent.trim()]));
  const schemaName = meta['x-schema-name'];
  if (!schemaName) return null;
  const blocks = [...main.querySelectorAll(':scope > div > div[class]')];
  // nested blocks by their numbered class ("cause cause-6" -> "cause-6")
  const byId = new Map(blocks.map((b) => [b.classList[1], b]).filter(([id]) => id));
  const dataBlock = blocks.find((b) => b.classList.length === 1 && b.classList[0] === schemaName);
  if (!dataBlock) return null;

  // a value cell: a reference, a list of values, or text
  const readValue = (cell) => {
    const text = cell.textContent.trim();
    let m = text.match(RICH_REF);
    if (m) {
      const target = byId.get(m[1]);
      return target ? target.querySelector(':scope > div > div') : null;
    }
    m = text.match(OBJECT_REF);
    if (m) {
      const target = byId.get(m[1]);
      // eslint-disable-next-line no-use-before-define
      return target ? readObject(target) : null;
    }
    return text;
  };
  const readObject = (block) => Object.fromEntries(rows(block).map(([key, cell]) => {
    const list = cell.querySelector(':scope > ul, :scope > ol, :scope > p:only-child > ul');
    const single = cell.children.length === 1 && cell.firstElementChild === list;
    if (list && single) {
      return [key, [...list.querySelectorAll(':scope > li')].map((li) => readValue(li))];
    }
    // long text: keep its paragraphs (EDS may deliver it as several <p>)
    const paras = [...cell.querySelectorAll(':scope > p')];
    if (paras.length > 1) return [key, paras.map((p) => p.textContent.trim()).join('\n\n')];
    return [key, readValue(cell)];
  }));

  return {
    schemaName, title: meta.title || '', data: readObject(dataBlock), blocks,
  };
}

/* ---------- medical-condition: the "Symptoms and causes" page layout ---------- */

const SECTIONS = [
  ['overview', 'Overview'],
  ['symptoms', 'Symptoms'],
  ['whenToSeeADoctor', 'When to see a doctor'],
  ['causes', 'Causes'],
  ['riskFactors', 'Risk factors'],
  ['complications', 'Complications'],
  ['prevention', 'Prevention'],
];
// extra sections follow a standard one: "Types" after Overview, "When to get emergency help"
// (or "When to seek emergency care") after "When to see a doctor"; any other after Prevention
const EXTRA_AFTER = {
  types: 'Overview',
  'when to get emergency help': 'When to see a doctor',
  'when to seek emergency care': 'When to see a doctor',
};
const SIDE_NAV = /^(diagnosis (and|&) treatment|doctors (and|&) departments|care at mayo clinic)$/i;
// shared banner page shown at the end of every condition page (edit it once for all pages)
const DONATION_BANNER = '/fragments/donation-banner';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'];

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (v !== undefined && v !== null) node.setAttribute(k, v);
  });
  children.flat(Infinity).forEach((c) => { if (c !== null && c !== undefined) node.append(c); });
  return node;
}

/** A block in authored form: <div class="name"><div><div>…</div></div>…</div> */
function authoredBlock(name, cellRows) {
  return el('div', { class: name }, cellRows.map((cells) => el('div', {}, cells.map((c) => el('div', {}, c)))));
}

const siteUrl = (url) => {
  const m = (url || '').match(DA_CONTENT);
  return m ? m[1] : url;
};

function image(url, alt) {
  return el('picture', {}, el('img', { src: siteUrl(url), alt: alt || '', loading: 'lazy' }));
}

function link(item) {
  return el('a', { href: item.url }, item.name);
}

function formatReviewDate(iso) {
  const m = (iso || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${MONTHS[Number(m[2]) - 1]} ${m[3]}, ${m[1]}` : '';
}

const BLOCK_TAGS = /^(P|H[1-6]|UL|OL|BLOCKQUOTE|DIV|PICTURE|TABLE)$/;

/**
 * Copies of a rich-text cell's nodes (empty when the value is missing). Edge Delivery delivers a
 * value of a single paragraph as bare text (it unwraps a sole <p>), so loose text and inline
 * elements are wrapped in a paragraph: section layout only places elements.
 */
const clone = (cell) => {
  if (!cell || !cell.childNodes) return [];
  const out = [];
  let para = null;
  [...cell.childNodes].forEach((n) => {
    const isBlock = n.nodeType === Node.ELEMENT_NODE && BLOCK_TAGS.test(n.tagName);
    if (isBlock) {
      para = null;
      out.push(n.cloneNode(true));
    } else if (n.nodeType === Node.ELEMENT_NODE || n.textContent.trim()) {
      if (!para) {
        para = document.createElement('p');
        out.push(para);
      }
      para.append(n.cloneNode(true));
    }
  });
  return out;
};

/** "Request an appointment" button copied from the article text, if it has one. */
function appointmentButton(cells) {
  const a = cells.filter(Boolean).flatMap((c) => [...c.querySelectorAll('a[href]')])
    .find((x) => /^request an appointment$/i.test(x.textContent.trim()));
  return a ? el('p', {}, el('strong', {}, el('a', { href: a.getAttribute('href') }, a.textContent.trim()))) : null;
}

/** YouTube's own thumbnail of a YouTube video URL (watch, youtu.be or embed), or null. */
function youtubeThumbnail(url) {
  let u;
  try { u = new URL(url); } catch (e) { return null; }
  const host = u.hostname.replace(/^(www|m)\./, '');
  let id = '';
  if (host === 'youtu.be') [, id] = u.pathname.split('/');
  else if (['youtube.com', 'youtube-nocookie.com'].includes(host)) {
    id = u.searchParams.get('v') || (u.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/) || [])[1] || '';
  }
  return /^[\w-]{6,}$/.test(id) ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

/** Video block, the title as H3 and the transcript accordion, as on a condition page. */
function video(v) {
  // poster: the stored thumbnail, else YouTube's; none at all (the block then shows the player
  // or a text link) rather than an image without a source
  const poster = v.thumbnailUrl || youtubeThumbnail(v.url);
  const nodes = [authoredBlock('video-inline', [[[
    poster ? el('p', {}, image(poster, v.name)) : null,
    el('p', {}, v.url ? el('a', { href: v.url }, v.name) : v.name),
  ]]])];
  nodes.push(el('h3', { id: toClassName(v.name) }, v.name));
  if (v.transcript) {
    const paras = String(v.transcript).split(/\n\s*\n/)
      .map((t) => t.trim()).filter(Boolean)
      .map((t) => el('p', {}, t));
    nodes.push(authoredBlock('accordion-toggle', [['Show transcript', paras]]));
  }
  return nodes;
}

const linkCards = (items) => authoredBlock('cards-show-more', items.map((item) => [link(item)]));

function illustration(i) {
  return [
    el('p', {}, image(i.url, i.alt)),
    i.name ? el('p', {}, el('strong', {}, i.name)) : null,
    i.caption ? el('p', {}, i.caption) : null,
  ].filter(Boolean);
}

/**
 * Replaces the structured-content markup in `main` with a condition page.
 * @param {Element} main
 * @param {{data: object}} doc result of readStructuredContent()
 */
export function renderMedicalCondition(main, { data }) {
  const d = data;
  const article = [];
  const toc = [];
  // illustrations and videos follow the text of the section they belong to
  const media = (sectionName) => [
    ...(d.illustration || []).filter((i) => (i.section || 'Overview') === sectionName)
      .flatMap(illustration),
    ...(d.video || []).filter((v) => (v.section || 'Overview') === sectionName).flatMap(video),
  ];
  const addSection = (heading, body, sectionName) => {
    const id = toClassName(heading);
    toc.push(el('li', {}, el('a', { href: `#${id}` }, heading)));
    article.push(el('h2', { id }, heading), ...clone(body), ...media(sectionName || heading));
  };
  const extras = (d.additionalSection || []).map((s) => ({
    ...s, after: EXTRA_AFTER[s.heading.toLowerCase()] || 'Prevention',
  }));
  // media of section "Other" goes with the first extra section
  let otherPlaced = false;
  SECTIONS.forEach(([key, heading]) => {
    if (d[key]) addSection(heading, d[key]);
    extras.filter((s) => s.after === heading).forEach((s) => {
      addSection(s.heading, s.body, otherPlaced ? `extra:${s.heading}` : 'Other');
      otherPlaced = true;
    });
  });

  const related = d.relatedLink || [];
  const navLinks = related.filter((r) => SIDE_NAV.test(r.name));
  const otherLinks = related.filter((r) => !SIDE_NAV.test(r.name));
  const citations = d.citation || [];
  const procedures = d.associatedProcedure || [];

  const children = [
    authoredBlock('cards-side-nav', [[d.name], ['Symptoms and causes'], ...navLinks.map((r) => [link(r)])]),
    el('h1', {}, d.name, el('br'), 'Symptoms and causes'),
    d.author ? el('p', {}, `By ${d.author}`) : null,
    d.lastReviewed ? el('p', {}, formatReviewDate(d.lastReviewed)) : null,
    appointmentButton(SECTIONS.map(([key]) => d[key])),
    el('p', {}, 'On this page'),
    el('ul', {}, toc),
    article,
  ];
  if (citations.length) {
    const list = el('ol', {}, citations.map((c) => el('li', {}, c)));
    children.push(authoredBlock('accordion-toggle', [['Show references', list]]));
  }
  // as on condition pages: related content, then associated procedures
  if (otherLinks.length) {
    children.push(el('h2', { id: 'related-content' }, 'Related content'), linkCards(otherLinks));
  }
  if (procedures.length) {
    children.push(el('h2', { id: 'associated-procedures' }, 'Associated procedures'), linkCards(procedures));
  }
  children.push(authoredBlock('section-metadata', [['style', 'split']]));

  // the shared donation banner (navy band) closes every condition page
  const banner = el('div', {}, authoredBlock('fragment', [[el('a', { href: DONATION_BANNER }, DONATION_BANNER)]]));

  main.replaceChildren(el('div', {}, children), banner);
  if (d.name) document.title = `${d.name} - Symptoms and causes - Mayo Clinic`;
}

/* ---------- medical-symptom: the symptom ("Causes and definition") page layout ---------- */

const SYMPTOM_SECTIONS = [
  ['definition', 'Definition'],
  ['causes', 'Causes'],
  ['whenToSeeADoctor', 'When to see a doctor'],
];
const APPOINTMENTS = 'https://www.mayoclinic.org/appointments';
// shown after the causes on every symptom page (source boilerplate, not stored per document)
const CAUSES_NOTE = 'Causes shown here are commonly associated with this symptom. Work with your '
  + 'doctor or other health care professional for an accurate diagnosis.';

/**
 * Replaces the structured-content markup in `main` with a symptom page: title, byline, date,
 * appointment button, "On this page", Definition, Causes, When to see a doctor (with its Self-care
 * part), extra sections, references, related content, then the shared donation banner.
 * @param {Element} main
 * @param {{data: object}} doc result of readStructuredContent()
 */
export function renderMedicalSymptom(main, { data }) {
  const d = data;
  const article = [];
  const toc = [];
  const media = (sectionName) => (d.illustration || [])
    .filter((i) => (i.section || 'Definition') === sectionName).flatMap(illustration);
  const addSection = (heading, body, sectionName) => {
    const id = toClassName(heading);
    toc.push(el('li', {}, el('a', { href: `#${id}` }, heading)));
    article.push(el('h2', { id }, heading), ...clone(body), ...media(sectionName || heading));
  };
  SYMPTOM_SECTIONS.forEach(([key, heading]) => {
    if (!d[key] && !(key === 'whenToSeeADoctor' && d.selfCare)) return;
    addSection(heading, d[key]);
    if (key === 'causes') article.push(el('p', {}, el('strong', {}, CAUSES_NOTE)));
    if (key === 'whenToSeeADoctor' && d.selfCare) {
      // the self-care text keeps its source heading ("Self-care", "Self-care for ..."); add one
      // if it is missing
      const body = clone(d.selfCare);
      const hasHeading = body[0] && /^H[2-6]$/.test(body[0].tagName);
      if (!hasHeading) article.push(el('h3', { id: 'self-care' }, 'Self-care'));
      article.push(...body, ...media('Self-care'));
    }
  });
  (d.additionalSection || []).forEach((s, i) => addSection(s.heading, s.body, i ? `extra:${s.heading}` : 'Other'));

  // every symptom page has the button above "On this page" and after the article (source)
  const button = appointmentButton(SYMPTOM_SECTIONS.map(([key]) => d[key]).concat(d.selfCare))
    || el('p', {}, el('strong', {}, el('a', { href: APPOINTMENTS }, 'Request an appointment')));
  const citations = d.citation || [];
  const related = d.relatedLink || [];
  const procedures = d.associatedProcedure || [];

  const children = [
    el('h1', {}, d.name),
    d.author ? el('p', {}, `By ${d.author}`) : null,
    d.lastReviewed ? el('p', {}, formatReviewDate(d.lastReviewed)) : null,
    button,
    toc.length > 1 ? [el('p', {}, 'On this page'), el('ul', {}, toc)] : null,
    article,
    button.cloneNode(true),
  ];
  if (citations.length) {
    const list = el('ol', {}, citations.map((c) => el('li', {}, c)));
    children.push(authoredBlock('accordion-toggle', [['Show references', list]]));
  }
  if (related.length) {
    children.push(el('h2', { id: 'related-content' }, 'Related content'), linkCards(related));
  }
  if (procedures.length) {
    children.push(el('h2', { id: 'associated-procedures' }, 'Associated procedures'), linkCards(procedures));
  }
  children.push(authoredBlock('section-metadata', [['style', 'article']]));

  const banner = el('div', {}, authoredBlock('fragment', [[el('a', { href: DONATION_BANNER }, DONATION_BANNER)]]));

  main.replaceChildren(el('div', {}, children), banner);
  if (d.name) document.title = `${d.name} - Causes and definition - Mayo Clinic`;
}

const RENDERERS = {
  'medical-condition': renderMedicalCondition,
  'medical-symptom': renderMedicalSymptom,
};

/**
 * Renders a structured-content document in `main` as a page, if there is a renderer for its schema.
 * @param {Element} main
 * @returns {boolean} true when the page was rendered
 */
export default function renderStructuredContent(main) {
  const doc = readStructuredContent(main);
  const render = doc && RENDERERS[doc.schemaName];
  if (!render) return false;
  render(main, doc);
  return true;
}
