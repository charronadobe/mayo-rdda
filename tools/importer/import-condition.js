/* eslint-disable */
/* global WebImporter */

import cardsSideNavParser from './parsers/cards-side-nav.js';
import videoInlineParser from './parsers/video-inline.js';
import columnsMediaParser from './parsers/columns-media.js';
import accordionToggleParser from './parsers/accordion-toggle.js';
import cardsShowMoreParser from './parsers/cards-show-more.js';
import cardsThumbListParser from './parsers/cards-thumb-list.js';
import columnsBannerParser from './parsers/columns-banner.js';
import cleanupTransformer from './transformers/mayoclinic-cleanup.js';
import sectionsTransformer from './transformers/mayoclinic-sections.js';

const PAGE_TEMPLATE = {
  "name": "condition",
  "urls": [
    "https://www.mayoclinic.org/diseases-conditions/atrial-fibrillation/symptoms-causes/syc-20350624",
    "https://www.mayoclinic.org/diseases-conditions/alpha-1-antitrypsin-deficiency/symptoms-causes/syc-20588790",
    "https://www.mayoclinic.org/diseases-conditions/baby-acne/symptoms-causes/syc-20369880",
    "https://www.mayoclinic.org/diseases-conditions/back-pain/symptoms-causes/syc-20369906",
    "https://www.mayoclinic.org/diseases-conditions/c-difficile/symptoms-causes/syc-20351691",
    "https://www.mayoclinic.org/diseases-conditions/pseudomembranous-colitis/symptoms-causes/syc-20351434",
    "https://www.mayoclinic.org/diseases-conditions/dandruff/symptoms-causes/syc-20353850",
    "https://www.mayoclinic.org/diseases-conditions/narcolepsy/symptoms-causes/syc-20375497",
    "https://www.mayoclinic.org/diseases-conditions/e-coli/symptoms-causes/syc-20372058",
    "https://www.mayoclinic.org/diseases-conditions/ear-infections/symptoms-causes/syc-20351616",
    "https://www.mayoclinic.org/diseases-conditions/hirsutism/symptoms-causes/syc-20354935",
    "https://www.mayoclinic.org/diseases-conditions/bells-palsy/symptoms-causes/syc-20370028",
    "https://www.mayoclinic.org/diseases-conditions/generalized-anxiety-disorder/symptoms-causes/syc-20360803",
    "https://www.mayoclinic.org/diseases-conditions/galactorrhea/symptoms-causes/syc-20350431",
    "https://www.mayoclinic.org/diseases-conditions/h-pylori/symptoms-causes/syc-20356171",
    "https://www.mayoclinic.org/diseases-conditions/swine-flu/symptoms-causes/syc-20378103",
    "https://www.mayoclinic.org/diseases-conditions/inflammatory-bowel-disease/symptoms-causes/syc-20353315",
    "https://www.mayoclinic.org/diseases-conditions/irritable-bowel-syndrome/symptoms-causes/syc-20360016",
    "https://www.mayoclinic.org/diseases-conditions/jellyfish-stings/symptoms-causes/syc-20353284",
    "https://www.mayoclinic.org/diseases-conditions/jaw-tumors-cysts/symptoms-causes/syc-20350973",
    "https://www.mayoclinic.org/diseases-conditions/kaposis-sarcoma/symptoms-causes/syc-20577303",
    "https://www.mayoclinic.org/diseases-conditions/kawasaki-disease/symptoms-causes/syc-20354598",
    "https://www.mayoclinic.org/diseases-conditions/lactose-intolerance/symptoms-causes/syc-20374232",
    "https://www.mayoclinic.org/diseases-conditions/mastitis/symptoms-causes/syc-20374829",
    "https://www.mayoclinic.org/diseases-conditions/dry-macular-degeneration/symptoms-causes/syc-20350375",
    "https://www.mayoclinic.org/diseases-conditions/wet-macular-degeneration/symptoms-causes/syc-20351107",
    "https://www.mayoclinic.org/diseases-conditions/fatty-liver-disease-masld/symptoms-causes/syc-20354567",
    "https://www.mayoclinic.org/diseases-conditions/nail-fungus/symptoms-causes/syc-20353294",
    "https://www.mayoclinic.org/diseases-conditions/osteoarthritis/symptoms-causes/syc-20351925",
    "https://www.mayoclinic.org/diseases-conditions/overactive-bladder/symptoms-causes/syc-20355715",
    "https://www.mayoclinic.org/diseases-conditions/peripheral-artery-disease/symptoms-causes/syc-20350557",
    "https://www.mayoclinic.org/diseases-conditions/popliteal-artery-entrapment/symptoms-causes/syc-20465211",
    "https://www.mayoclinic.org/diseases-conditions/rheumatoid-arthritis/symptoms-causes/syc-20353648",
    "https://www.mayoclinic.org/diseases-conditions/rabies/symptoms-causes/syc-20351821",
    "https://www.mayoclinic.org/diseases-conditions/sacral-dimple/symptoms-causes/syc-20377353",
    "https://www.mayoclinic.org/diseases-conditions/sacroiliitis/symptoms-causes/syc-20350747",
    "https://www.mayoclinic.org/diseases-conditions/tachycardia/symptoms-causes/syc-20355127",
    "https://www.mayoclinic.org/diseases-conditions/takayasus-arteritis/symptoms-causes/syc-20351335",
    "https://www.mayoclinic.org/diseases-conditions/canker-sore/symptoms-causes/syc-20370615",
    "https://www.mayoclinic.org/diseases-conditions/peptic-ulcer/symptoms-causes/syc-20354223",
    "https://www.mayoclinic.org/diseases-conditions/vaginal-agenesis/symptoms-causes/syc-20355737",
    "https://www.mayoclinic.org/diseases-conditions/vaginal-atrophy/symptoms-causes/syc-20352288",
    "https://www.mayoclinic.org/diseases-conditions/genital-warts/symptoms-causes/syc-20355234",
    "https://www.mayoclinic.org/diseases-conditions/common-warts/symptoms-causes/syc-20371125",
    "https://www.mayoclinic.org/diseases-conditions/dry-skin/symptoms-causes/syc-20353885",
    "https://www.mayoclinic.org/diseases-conditions/dry-mouth/symptoms-causes/syc-20356048",
    "https://www.mayoclinic.org/diseases-conditions/yeast-infection/symptoms-causes/syc-20378999",
    "https://www.mayoclinic.org/diseases-conditions/plague/symptoms-causes/syc-20351291",
    "https://www.mayoclinic.org/diseases-conditions/zenkers-diverticulum/symptoms-causes/syc-20568839",
    "https://www.mayoclinic.org/diseases-conditions/zollinger-ellison-syndrome/symptoms-causes/syc-20379042",
    "https://www.mayoclinic.org/diseases-conditions/digeorge-syndrome/symptoms-causes/syc-20353543"
  ],
  "description": "Disease or condition page, \"Symptoms & causes\" tab: condition title, overview, symptoms, causes, risk factors, complications and prevention",
  "blocks": [
    {
      "name": "cards-side-nav",
      "instances": [
        ".cmp-column-control__level-to-nav .cmp-level-two-navigation"
      ]
    },
    {
      "name": "video-inline",
      "instances": [
        ".cmp-column-control__content-column .cmp-video-from-model"
      ]
    },
    {
      "name": "columns-media",
      "instances": [
        ".cmp-column-control__content-column .cmp-story-card"
      ]
    },
    {
      "name": "accordion-toggle",
      "instances": [
        ".cmp-hil-article-references"
      ]
    },
    {
      "name": "cards-show-more",
      "instances": [
        ".cmp-dynamic-related-content"
      ]
    },
    {
      "name": "cards-thumb-list",
      "instances": [
        ".cmp-news-and-patient-stories"
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
      "name": "Condition article with section nav",
      "selector": [
        ".cmp-column-control__layoutType--ThreeColumnWithL2AndAd"
      ],
      "style": "split",
      "blocks": [
        "cards-side-nav",
        "video-inline",
        "columns-media",
        "accordion-toggle",
        "cards-show-more",
        "cards-thumb-list"
      ],
      "defaultContent": [
        ".cmp-titlewithparent h1",
        ".cmp-health-information-topic",
        ".cmp-anchor-nav",
        ".cmp-text-card"
      ]
    },
    {
      "id": "s2",
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
  ],
  "representativeUrl": "https://www.mayoclinic.org/diseases-conditions/atrial-fibrillation/symptoms-causes/syc-20350624"
};

const parsers = {
  'cards-side-nav': cardsSideNavParser,
  'video-inline': videoInlineParser,
  'columns-media': columnsMediaParser,
  'accordion-toggle': accordionToggleParser,
  'cards-show-more': cardsShowMoreParser,
  'cards-thumb-list': cardsThumbListParser,
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

    // Condition pages mirror Mayo Clinic's paths without the content ID:
    // /diseases-conditions/<slug>/symptoms-causes/syc-... -> /health-library/diseases-conditions/<slug>/symptoms-causes
    const parts = new URL(params.originalURL).pathname.split('/').filter(Boolean);
    const rawPath = parts[0] === 'diseases-conditions' && parts.length >= 3
      ? `/health-library/diseases-conditions/${parts[1]}/${parts[2]}`
      : `/health-library/${parts.join('/')}`;
    const path = WebImporter.FileUtils.sanitizePath(rawPath);

    return [{
      element: main,
      path,
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) },
    }, ...params.fragments];
  },
};
