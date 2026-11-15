/* eslint-disable */
/* global WebImporter */

import cardsLinkListParser from './parsers/cards-link-list.js';
import accordionLinedParser from './parsers/accordion-lined.js';
import columnsBannerParser from './parsers/columns-banner.js';
import cardsLocationParser from './parsers/cards-location.js';
import cleanupTransformer from './transformers/mayoclinic-cleanup.js';
import sectionsTransformer from './transformers/mayoclinic-sections.js';

const PAGE_TEMPLATE = {
  "name": "care-service",
  "urls": [
    "https://www.mayoclinic.org/appointments",
    "https://www.mayoclinic.org/patient-visitor-guide"
  ],
  "description": "Care service pages: Request Appointment, Patient & Visitor Guide",
  "blocks": [
    {
      "name": "cards-link-list",
      "instances": [
        "#main-content .cmp-link-list-robust",
        "#main-content .cmp-link-list"
      ]
    },
    {
      "name": "accordion-lined",
      "instances": [
        "#main-content .cmp-accordion"
      ]
    },
    {
      "name": "columns-banner",
      "instances": [
        "#top-advertisement",
        "#main-content .cmp-column-control__layoutType--TwoColumn > .cmp-column-control__container:has(> .container-child > .cmp-text-card .cmp-text-card__buttons):not(:has(> .container-child > :not(.cmp-text-card)))"
      ]
    },
    {
      "name": "cards-location",
      "instances": [
        "#main-content .cmp-locations-card-from-model"
      ]
    }
  ],
  "sections": [
    {
      "id": "rc5",
      "name": "Appointment request (light-blue band)",
      "selector": [
        "#main-content .aem-GridColumn:has(> .cmp-container--background-color-copyright .cmp-link-list-robust)"
      ],
      "style": "light-blue",
      "blocks": [
        "cards-link-list"
      ],
      "defaultContent": [
        ".cmp-title h1",
        ".cmp-text__rich-content"
      ]
    },
    {
      "id": "rc6",
      "name": "Schedule by phone",
      "selector": [
        "#main-content .aem-GridColumn:has(> .cmp-yspace .cmp-accordion)"
      ],
      "style": null,
      "blocks": [
        "accordion-lined"
      ],
      "defaultContent": [
        ".cmp-title h2"
      ]
    },
    {
      "id": "rc7",
      "name": "Appointments in London",
      "selector": [
        "#main-content .aem-GridColumn:has(> .cmp-yspace .cmp-accordion) + .aem-GridColumn:has(> .cmp-yspace)",
        "#main-content .aem-GridColumn:has(> .cmp-yspace):has(+ .aem-GridColumn > .cmp-container--background-color-brand .cmp-link-list-robust)"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": [
        ".cmp-title h2",
        ".cmp-text__rich-content"
      ]
    },
    {
      "id": "rc8",
      "name": "Questions about appointments (blue gradient)",
      "selector": [
        "#main-content .aem-GridColumn:has(> .cmp-container--background-color-brand .cmp-link-list-robust)"
      ],
      "style": "blue-gradient, split",
      "blocks": [
        "cards-link-list"
      ],
      "defaultContent": [
        ".cmp-text-card"
      ]
    },
    {
      "id": "rc9",
      "name": "Donation banner (navy, both pages)",
      "selector": [
        ".cmp-container--background-color-donations"
      ],
      "style": "dark",
      "blocks": [
        "columns-banner"
      ],
      "defaultContent": []
    },
    {
      "id": "pvg-2",
      "name": "Guide: before requesting an appointment",
      "selector": [
        "#main-content .aem-GridColumn:has(> .cmp-yspace > .cmp-column-control__layoutType--TwoColumn .cmp-link-list)"
      ],
      "style": "split",
      "blocks": [
        "cards-link-list"
      ],
      "defaultContent": [
        ".cmp-text-card"
      ]
    },
    {
      "id": "pvg-3",
      "name": "Guide: planning your trip and campuses",
      "selector": [
        "#main-content .aem-GridColumn:has(> .cmp-yspace .cmp-text-card):has(+ .aem-GridColumn .cmp-locations-card)"
      ],
      "style": null,
      "blocks": [
        "cards-location"
      ],
      "defaultContent": [
        ".cmp-text-card"
      ]
    },
    {
      "id": "pvg-4",
      "name": "Guide: additional help",
      "selector": [
        "#main-content .aem-GridColumn:has(> .cmp-yspace > .cmp-column-control__layoutType--OneColumn .cmp-link-list)"
      ],
      "style": null,
      "blocks": [
        "cards-link-list"
      ],
      "defaultContent": [
        ".cmp-text-card"
      ]
    },
    {
      "id": "pvg-5",
      "name": "Guide: online access and confidentiality",
      "selector": [
        "#main-content .aem-GridColumn:has(> .cmp-yspace > .cmp-column-control__layoutType--TwoColumn .cmp-text-card__buttons)"
      ],
      "style": null,
      "blocks": [
        "columns-banner"
      ],
      "defaultContent": []
    }
  ],
  "representativeUrl": "https://www.mayoclinic.org/appointments"
};

const parsers = {
  'cards-link-list': cardsLinkListParser,
  'accordion-lined': accordionLinedParser,
  'columns-banner': columnsBannerParser,
  'cards-location': cardsLocationParser,
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

    // Care at Mayo Clinic pages live directly in the care-at-mayo-clinic folder, named after the
    // last part of the source path (/appointments/find-a-doctor -> /care-at-mayo-clinic/find-a-doctor)
    const parts = new URL(params.originalURL).pathname.split('/').filter(Boolean);
    const path = WebImporter.FileUtils.sanitizePath(`/care-at-mayo-clinic/${parts[parts.length - 1] || 'index'}`);

    return [{
      element: main,
      path,
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) },
    }, ...params.fragments];
  },
};
