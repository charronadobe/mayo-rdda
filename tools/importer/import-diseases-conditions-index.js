/* eslint-disable */
/* global WebImporter */

import columnsIntroIndexParser from './parsers/columns-intro-index.js';
import columnsBannerParser from './parsers/columns-banner.js';
import cleanupTransformer from './transformers/mayoclinic-cleanup.js';
import sectionsTransformer from './transformers/mayoclinic-sections.js';

const PAGE_TEMPLATE = {
  "name": "diseases-conditions-index",
  "urls": [
    "https://www.mayoclinic.org/diseases-conditions/index?letter=A",
    "https://www.mayoclinic.org/diseases-conditions/index?letter=B",
    "https://www.mayoclinic.org/diseases-conditions/index?letter=C",
    "https://www.mayoclinic.org/diseases-conditions/index?letter=D",
    "https://www.mayoclinic.org/diseases-conditions/index?letter=E",
    "https://www.mayoclinic.org/diseases-conditions/index?letter=F",
    "https://www.mayoclinic.org/diseases-conditions/index?letter=G",
    "https://www.mayoclinic.org/diseases-conditions/index?letter=H",
    "https://www.mayoclinic.org/diseases-conditions/index?letter=I",
    "https://www.mayoclinic.org/diseases-conditions/index?letter=J",
    "https://www.mayoclinic.org/diseases-conditions/index?letter=K",
    "https://www.mayoclinic.org/diseases-conditions/index?letter=L",
    "https://www.mayoclinic.org/diseases-conditions/index?letter=M",
    "https://www.mayoclinic.org/diseases-conditions/index?letter=N",
    "https://www.mayoclinic.org/diseases-conditions/index?letter=O",
    "https://www.mayoclinic.org/diseases-conditions/index?letter=P",
    "https://www.mayoclinic.org/diseases-conditions/index?letter=R",
    "https://www.mayoclinic.org/diseases-conditions/index?letter=S",
    "https://www.mayoclinic.org/diseases-conditions/index?letter=T",
    "https://www.mayoclinic.org/diseases-conditions/index?letter=U",
    "https://www.mayoclinic.org/diseases-conditions/index?letter=V",
    "https://www.mayoclinic.org/diseases-conditions/index?letter=W",
    "https://www.mayoclinic.org/diseases-conditions/index?letter=X",
    "https://www.mayoclinic.org/diseases-conditions/index?letter=Y",
    "https://www.mayoclinic.org/diseases-conditions/index?letter=Z",
    "https://www.mayoclinic.org/diseases-conditions/index?letter=%23"
  ],
  "description": "Diseases & conditions A-Z index: one page per first letter listing the conditions that start with it",
  "blocks": [
    {
      "name": "columns-intro-index",
      "instances": [
        "#cmp-dc-banner .cmp-container--centered"
      ]
    },
    {
      "name": "columns-banner",
      "instances": [
        "#top-advertisement"
      ]
    }
  ],
  "sections": [
    {
      "id": "s1",
      "name": "Page intro and A-Z index",
      "selector": [
        "#cmp-dc-banner"
      ],
      "style": "blue-gradient",
      "blocks": [
        "columns-intro-index"
      ],
      "defaultContent": []
    },
    {
      "id": "s2",
      "name": "Conditions starting with the letter",
      "selector": [
        ".cmp-azresults",
        "#cmp-skip-to-main__content"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": [
        ".cmp-azresults .cmp-result-letters h2",
        ".cmp-azresults ul"
      ]
    },
    {
      "id": "s3",
      "name": "Donation banner",
      "selector": [
        ".cmp-container--background-color-donations"
      ],
      "style": "dark",
      "blocks": [
        "columns-banner"
      ],
      "defaultContent": []
    }
  ]
};

const parsers = {
  'columns-intro-index': columnsIntroIndexParser,
  'columns-banner': columnsBannerParser,
};
// Late transformers change the DOM (section <hr> markers, shared fragments), so their beforeTransform
// runs after block discovery.
const sectionTransformers = [sectionsTransformer];
const fragmentTransformers = [];
const lateTransformers = [...sectionTransformers, ...fragmentTransformers];
const transformers = [cleanupTransformer, ...lateTransformers];
const earlyTransformers = transformers.filter((fn) => !lateTransformers.includes(fn));
// Catalog selectors (pageInstances, pageCleanup) count the <script> and <hr> elements the importer
// removes before transform, so a catalog template finds its targets in preprocess.
const CATALOG = Boolean(PAGE_TEMPLATE.pageCleanup || PAGE_TEMPLATE.blocks.some((b) => b.pageInstances));

function executeTransformers(hookName, element, payload, list = transformers) {
  const enhancedPayload = { ...payload, template: payload.params?.targets?.template || PAGE_TEMPLATE };
  list.forEach((fn) => {
    try { fn(hookName, element, enhancedPayload); }
    catch (e) { console.error(`Transformer failed at ${hookName}:`, e); }
  });
}

function findBlocksOnPage(document, template, url) {
  const pageBlocks = [];
  const pageKey = (u) => {
    try { const { origin, pathname } = new URL(u); return `${origin}${pathname.replace(/\/$/, '')}`; }
    catch { return u; }
  };
  const key = pageKey(url);
  const claim = (blockDef, selector) => {
    let matches = [];
    try { matches = document.querySelectorAll(selector); } catch { return; }
    matches.forEach((element) => {
      if (pageBlocks.some((b) => b.element === element || b.element.contains(element) || element.contains(b.element))) return;
      pageBlocks.push({ name: blockDef.name, selector, element });
    });
  };
  template.blocks.forEach((blockDef) => {
    const entry = Object.entries(blockDef.pageInstances || {}).find(([u]) => pageKey(u) === key);
    (entry ? entry[1] : []).forEach((selector) => claim(blockDef, selector));
  });
  template.blocks.forEach((blockDef) => (blockDef.instances || []).forEach((selector) => claim(blockDef, selector)));
  return pageBlocks;
}

// Runs the early transformers, then marks each block and section target with an attribute: the
// importer re-creates the body before transform, so only attributes survive, not element references.
function markPageTargets(payload) {
  const { document, params } = payload;
  executeTransformers('beforeTransform', document.body, payload, earlyTransformers);
  const blocks = findBlocksOnPage(document, PAGE_TEMPLATE, params.originalURL).map(({ name, selector, element }, i) => {
    element.setAttribute('data-excat-block', String(i));
    return { name, selector };
  });
  const sections = (PAGE_TEMPLATE.sections || []).map((section, i) => {
    const target = (section.selector || []).map((s) => { try { return document.querySelector(s); } catch { return null; } }).find(Boolean);
    if (!target) return section;
    target.setAttribute('data-excat-section', String(i));
    return { ...section, selector: [`[data-excat-section="${i}"]`] };
  });
  params.targets = { blocks, template: { ...PAGE_TEMPLATE, sections } };
}

export default {
  preprocess: (payload) => {
    if (CATALOG) markPageTargets(payload);
  },
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;
    params.fragments = [];

    if (!params.targets) markPageTargets(payload);
    const pageBlocks = params.targets.blocks
      .map((block, i) => ({ ...block, element: document.querySelector(`[data-excat-block="${i}"]`) }))
      .filter((block) => block.element);
    executeTransformers('beforeTransform', main, { ...payload, pageBlocks }, lateTransformers);

    pageBlocks.forEach((block) => {
      if (!main.contains(block.element)) return;
      const parser = parsers[block.name];
      if (!parser) return;
      try { parser(block.element, { document, url, params }); }
      catch (e) { console.error(`Failed to parse ${block.name} (${block.selector}):`, e); }
    });

    executeTransformers('afterTransform', main, payload);

    // page metadata goes into the last content section: a section of its own renders as an
    // empty section (extra white space above the footer) once Edge Delivery strips the block
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // A fragment's nodes left `main` before afterTransform: finalize it the same way, without the
    // page-only section breaks and metadata.
    params.fragments.forEach(({ element }) => {
      executeTransformers('afterTransform', element, payload, earlyTransformers);
      WebImporter.rules.transformBackgroundImages(element, document);
      WebImporter.rules.adjustImageUrls(element, url, params.originalURL);
    });

    // Every letter page has the same URL path (/diseases-conditions/index): the page path comes
    // from the ?letter= parameter ('#' -> 'other').
    const letter = (new URL(params.originalURL).searchParams.get('letter') || '').trim().toLowerCase();
    const slug = /^[a-z]$/.test(letter) ? letter : 'other';
    const path = WebImporter.FileUtils.sanitizePath(`/health-library/diseases-conditions/${slug}`);

    return [{
      element: main,
      path,
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) },
    }, ...params.fragments];
  },
};
