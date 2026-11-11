/* eslint-disable */
/* global WebImporter */

import heroVideoParser from './parsers/hero-video.js';
import searchConditionsParser from './parsers/search-conditions.js';
import columnsMediaParser from './parsers/columns-media.js';
import cardsOverlayParser from './parsers/cards-overlay.js';
import cardsLinkListParser from './parsers/cards-link-list.js';
import columnsBannerParser from './parsers/columns-banner.js';
import cleanupTransformer from './transformers/mayoclinic-cleanup.js';
import sectionsTransformer from './transformers/mayoclinic-sections.js';

const PAGE_TEMPLATE = {
  "name": "home",
  "urls": [
    "https://www.mayoclinic.org/"
  ],
  "representativeUrl": "https://www.mayoclinic.org/",
  "description": "Mayo Clinic homepage: video hero, conditions finder with search, story cards, locations cards, featured care area links and donation banner",
  "blocks": [
    {
      "name": "hero-video",
      "instances": [
        ".cmp-hero-card"
      ]
    },
    {
      "name": "search-conditions",
      "instances": [
        "#main-content .cmp-search"
      ]
    },
    {
      "name": "columns-media",
      "instances": [
        ".cmp-story-card"
      ]
    },
    {
      "name": "cards-overlay",
      "instances": [
        ".cmp-column-control__layoutType--ThreeColumn .cmp-column-control__container"
      ]
    },
    {
      "name": "cards-link-list",
      "instances": [
        ".cmp-link-list"
      ]
    },
    {
      "name": "columns-banner",
      "instances": [
        "#top-advertisement"
      ]
    }
  ],
  "urlPattern": "/",
  "sections": [
    {
      "id": "s1",
      "name": "Hero",
      "selector": [
        "#main-content .cmp-hero-card",
        "#main-content > div.aem-container.cmp-container--column-padding-0x.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(1) > div.aem-container.cmp-container--column-padding-0x.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(1)"
      ],
      "style": null,
      "blocks": [
        "hero-video"
      ],
      "defaultContent": []
    },
    {
      "id": "s2",
      "name": "Find diseases and conditions",
      "selector": [
        "#main-content .cmp-container--background-color-primary",
        "#main-content > div.aem-container.cmp-container--column-padding-0x.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(1) > div.aem-container.cmp-container--column-padding-0x.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(2)"
      ],
      "style": "split",
      "blocks": [
        "search-conditions"
      ],
      "defaultContent": [
        ".cmp-alphabet-facet"
      ]
    },
    {
      "id": "s3",
      "name": "Healing starts here",
      "selector": [
        ".cmp-yspace:has(.cmp-story-card__text-card-container--left)",
        "#main-content > div.aem-container.cmp-container--column-padding-0x.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(1) > div.aem-container.cmp-container--column-padding-0x.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(4)"
      ],
      "style": null,
      "blocks": [
        "columns-media"
      ],
      "defaultContent": []
    },
    {
      "id": "s4",
      "name": "World-class care for global patients",
      "selector": [
        ".cmp-yspace:has(.cmp-story-card__text-card-container--right)",
        "#main-content > div.aem-container.cmp-container--column-padding-0x.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(1) > div.aem-container.cmp-container--column-padding-0x.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(5)"
      ],
      "style": null,
      "blocks": [
        "columns-media"
      ],
      "defaultContent": []
    },
    {
      "id": "s5",
      "name": "Locations",
      "selector": [
        ".cmp-yspace:has(.cmp-column-control__layoutType--ThreeColumn)",
        "#main-content > div.aem-container.cmp-container--column-padding-0x.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(1) > div.aem-container.cmp-container--column-padding-0x.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(6)"
      ],
      "style": "split",
      "blocks": [
        "cards-overlay"
      ],
      "defaultContent": [
        ".cmp-column-control__layoutType--ThreeColumn .cmp-text-card"
      ]
    },
    {
      "id": "s6",
      "name": "Featured care areas",
      "selector": [
        ".cmp-yspace:has(.cmp-column-control__layoutType--MosaicSmall)",
        "#main-content > div.aem-container.cmp-container--column-padding-0x.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(1) > div.aem-container.cmp-container--column-padding-0x.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(7)"
      ],
      "style": "split",
      "blocks": [
        "cards-link-list"
      ],
      "defaultContent": [
        ".cmp-column-control__layoutType--MosaicSmall .cmp-text-card"
      ]
    },
    {
      "id": "s7",
      "name": "Donation banner",
      "selector": [
        ".cmp-container--background-color-donations",
        "#main-content > div.aem-container.cmp-container--column-padding-0x.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(2)"
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
  'hero-video': heroVideoParser,
  'search-conditions': searchConditionsParser,
  'columns-media': columnsMediaParser,
  'cards-overlay': cardsOverlayParser,
  'cards-link-list': cardsLinkListParser,
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

    main.appendChild(document.createElement('hr'));
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

    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) },
    }, ...params.fragments];
  },
};
