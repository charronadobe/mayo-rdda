/* eslint-disable */
/* global WebImporter */

import carouselStoryParser from './parsers/carousel-story.js';
import columnsMediaParser from './parsers/columns-media.js';
import cardsStatParser from './parsers/cards-stat.js';
import quotePullParser from './parsers/quote-pull.js';
import cardsActionParser from './parsers/cards-action.js';
import columnsBannerParser from './parsers/columns-banner.js';
import cardsLocationParser from './parsers/cards-location.js';
import tableLinedParser from './parsers/table-lined.js';
import videoInlineParser from './parsers/video-inline.js';
import accordionToggleParser from './parsers/accordion-toggle.js';
import cleanupTransformer from './transformers/mayoclinic-cleanup.js';
import sectionsTransformer from './transformers/mayoclinic-sections.js';

const PAGE_TEMPLATE = {
  "name": "care-hub",
  "urls": [
    "https://www.mayoclinic.org/about-mayo-clinic",
    "https://www.mayoclinic.org/about-mayo-clinic/contact",
    "https://www.mayoclinic.org/billing-insurance",
    "https://www.mayoclinic.org/locations",
    "https://www.mayoclinic.org/patient-centered-care"
  ],
  "description": "Care at Mayo Clinic hub pages: About Mayo Clinic, Contact Us, Billing & Insurance, Locations, Patient-Centered Care",
  "blocks": [
    {
      "name": "carousel-story",
      "instances": [
        "#main-content .cmp-slider-from-model"
      ]
    },
    {
      "name": "columns-media",
      "instances": [
        ".cmp-story-card"
      ]
    },
    {
      "name": "cards-stat",
      "instances": [
        "#main-content .cmp-column-control__container:has(> .container-child .cmp-fact-card)"
      ]
    },
    {
      "name": "quote-pull",
      "instances": [
        "#main-content .cmp-pull-quote"
      ]
    },
    {
      "name": "cards-action",
      "instances": [
        "#main-content .cmp-column-control__container:has(> .container-child > .cmp-action-card-simple)",
        "#main-content .cmp-column-control__container:has(> .container-child > .cmp-action-card-robust)"
      ]
    },
    {
      "name": "columns-banner",
      "instances": [
        "#top-advertisement",
        "#main-content .cmp-column-control__container.cmp-text-card__care"
      ]
    },
    {
      "name": "cards-location",
      "instances": [
        "#main-content .cmp-locations-card-from-model"
      ]
    },
    {
      "name": "table-lined",
      "instances": [
        "#main-content .cmp-text__rich-content table"
      ]
    },
    {
      "name": "video-inline",
      "instances": [
        "#main-content .cmp-video-from-model"
      ]
    },
    {
      "name": "accordion-toggle",
      "instances": [
        "#main-content .cmp-video-from-model .cmp-video__expando"
      ]
    }
  ],
  "sections": [
    {
      "id": "s1",
      "name": "Page intro and story carousel",
      "selector": [
        "#main-content .aem-GridColumn:has(> .cmp-yspace .cmp-headline)",
        "#main-content .aem-GridColumn:has(> .cmp-yspace h1)"
      ],
      "style": null,
      "blocks": [
        "carousel-story",
        "cards-action",
        "cards-location",
        "video-inline",
        "accordion-toggle"
      ],
      "defaultContent": [
        ".cmp-headline",
        ".cmp-title h1",
        ".cmp-hero-card",
        ".cmp-text__rich-content",
        ".cmp-video__description"
      ]
    },
    {
      "id": "s2",
      "name": "Who we are",
      "selector": [
        "#main-content .aem-GridColumn:has(> .cmp-yspace .cmp-story-card)"
      ],
      "style": null,
      "blocks": [
        "columns-media"
      ],
      "defaultContent": []
    },
    {
      "id": "s3",
      "name": "Our impact",
      "selector": [
        "#main-content .aem-GridColumn:has(> .cmp-yspace .cmp-story-card) ~ .aem-GridColumn:has(> .cmp-yspace .cmp-story-card)"
      ],
      "style": null,
      "blocks": [
        "columns-media"
      ],
      "defaultContent": []
    },
    {
      "id": "s4",
      "name": "Impact facts",
      "selector": [
        "#main-content .aem-GridColumn:has(> .cmp-yspace .cmp-fact-card)"
      ],
      "style": null,
      "blocks": [
        "cards-stat"
      ],
      "defaultContent": []
    },
    {
      "id": "s5",
      "name": "People and culture",
      "selector": [
        "#main-content .aem-GridColumn:has(> .cmp-yspace .cmp-story-card) ~ .aem-GridColumn:has(> .cmp-yspace .cmp-story-card) ~ .aem-GridColumn:has(> .cmp-yspace .cmp-story-card)"
      ],
      "style": null,
      "blocks": [
        "columns-media"
      ],
      "defaultContent": []
    },
    {
      "id": "s6",
      "name": "CEO quote",
      "selector": [
        "#main-content .cmp-pull-quote__white"
      ],
      "style": null,
      "blocks": [
        "quote-pull"
      ],
      "defaultContent": []
    },
    {
      "id": "s7",
      "name": "Resources",
      "selector": [
        "#main-content .aem-GridColumn:has(+ .aem-GridColumn .cmp-action-card-simple)"
      ],
      "style": null,
      "blocks": [
        "cards-action"
      ],
      "defaultContent": [
        ".cmp-text-card",
        ".cmp-title h3",
        ".cmp-text__rich-content"
      ]
    },
    {
      "id": "s8",
      "name": "Donation banner",
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
      "id": "s9",
      "name": "Contact: first state group",
      "selector": [
        "#main-content .aem-GridColumn:has(> .cmp-yspace table)"
      ],
      "style": null,
      "blocks": [
        "table-lined"
      ],
      "defaultContent": [
        ".cmp-title h3",
        ".cmp-text__rich-content p",
        ".cmp-link"
      ]
    },
    {
      "id": "s10",
      "name": "Contact: second state group",
      "selector": [
        "#main-content .aem-GridColumn:has(> .cmp-yspace table) ~ .aem-GridColumn:has(> .cmp-yspace table)"
      ],
      "style": null,
      "blocks": [
        "table-lined"
      ],
      "defaultContent": [
        ".cmp-title h3",
        ".cmp-text__rich-content p",
        ".cmp-link"
      ]
    },
    {
      "id": "s11",
      "name": "Contact: third state group",
      "selector": [
        "#main-content .aem-GridColumn:has(> .cmp-yspace table) ~ .aem-GridColumn:has(> .cmp-yspace table) ~ .aem-GridColumn:has(> .cmp-yspace table)"
      ],
      "style": null,
      "blocks": [
        "table-lined"
      ],
      "defaultContent": [
        ".cmp-title h3",
        ".cmp-text__rich-content p",
        ".cmp-link"
      ]
    },
    {
      "id": "s12",
      "name": "Locations: support getting to main campuses",
      "selector": [
        "#main-content .aem-GridColumn:has(> .cmp-yspace .cmp-support-card)"
      ],
      "style": "centered",
      "blocks": [],
      "defaultContent": [
        ".cmp-support-card .cmp-title h2",
        ".cmp-support-card .cmp-text__rich-content",
        ".cmp-support-card .cmp-link"
      ]
    },
    {
      "id": "s13",
      "name": "Locations: international locations",
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
      "id": "s14",
      "name": "Patient-Centered Care: patient quote band",
      "selector": [
        "#main-content .cmp-pull-quote__light-blue"
      ],
      "style": "light-blue",
      "blocks": [
        "quote-pull"
      ],
      "defaultContent": []
    },
    {
      "id": "s15",
      "name": "Patient-Centered Care: plan that works for you",
      "selector": [
        "#main-content .aem-GridColumn:has(> .cmp-yspace .cmp-text-card__care)"
      ],
      "style": null,
      "blocks": [
        "columns-banner"
      ],
      "defaultContent": []
    },
    {
      "id": "s16",
      "name": "Patient-Centered Care: full-width photo",
      "selector": [
        "#main-content .aem-GridColumn:has(> .cmp-yspace > .cmp-column-control > .cmp-column-control__container > .container-child > .cmp-image)"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": [
        ".cmp-image img"
      ]
    }
  ],
  "representativeUrl": "https://www.mayoclinic.org/about-mayo-clinic"
};

const parsers = {
  'carousel-story': carouselStoryParser,
  'columns-media': columnsMediaParser,
  'cards-stat': cardsStatParser,
  'quote-pull': quotePullParser,
  'cards-action': cardsActionParser,
  'columns-banner': columnsBannerParser,
  'cards-location': cardsLocationParser,
  'table-lined': tableLinedParser,
  'video-inline': videoInlineParser,
  'accordion-toggle': accordionToggleParser,
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
