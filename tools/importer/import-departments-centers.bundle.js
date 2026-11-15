/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-departments-centers.js
  var import_departments_centers_exports = {};
  __export(import_departments_centers_exports, {
    default: () => import_departments_centers_default
  });

  // tools/importer/parsers/cards-action.js
  function parse(element, { document: document2, params }) {
    const TEXT_ONLY = "cmp-action-card-robust";
    const IMAGE_RIGHT = "cmp-action-card-robust-with-image";
    const IMAGE_BG = "cmp-action-card-with-background-image";
    const SIMPLE = "cmp-action-card-simple";
    const LINKBOX = "linkbox";
    const buildSimpleBody = (card) => {
      const body = [];
      const heading = card.querySelector(".cmp-action-card-simple__title, .cmp-title h2, .cmp-title h3, .cmp-title h4, .cmp-title h5");
      if (heading) {
        const titleEl = heading.querySelector(".cmp-title__inner") || heading;
        const title = titleEl.textContent.replace(/\s+/g, " ").trim();
        if (title) {
          const level = /^H[1-6]$/.test(heading.tagName) ? heading.tagName.toLowerCase() : "h3";
          const h = document2.createElement(level);
          const link = heading.querySelector("a[href]");
          if (link) {
            const a = document2.createElement("a");
            a.setAttribute("href", link.getAttribute("href"));
            a.textContent = title;
            h.append(a);
          } else {
            h.textContent = title;
          }
          body.push(h);
        }
      }
      card.querySelectorAll(".cmp-text__rich-content").forEach((rich) => {
        [...rich.children].forEach((child) => {
          if (child.textContent.trim()) body.push(child);
        });
      });
      return body;
    };
    const buildBody = (card) => {
      const body = [];
      const title = card.querySelector(".cmp-title h2, .cmp-title h3, h2");
      if (title) {
        const h = document2.createElement("h2");
        h.textContent = title.textContent.trim();
        body.push(h);
      }
      card.querySelectorAll(".cmp-text__rich-content").forEach((rich) => {
        [...rich.children].forEach((child) => {
          if (child.textContent.trim()) body.push(child);
        });
      });
      const link = card.querySelector(".cmp-link a[href]");
      if (link) {
        const textEl = link.querySelector(".cmp-button__text");
        const text = (textEl || link).textContent.trim();
        if (text) {
          const p = document2.createElement("p");
          const a = document2.createElement("a");
          a.setAttribute("href", link.getAttribute("href"));
          a.textContent = text;
          p.append(a);
          body.push(p);
        }
      }
      return body;
    };
    const buildImage = (card) => {
      const img = card.querySelector(".cmp-image img");
      if (!img || !img.getAttribute("src")) return "";
      const image = document2.createElement("img");
      image.src = img.getAttribute("src");
      image.alt = img.getAttribute("alt") || "";
      return image;
    };
    const buildLinkboxBody = (card) => {
      const clean = (text2) => (text2 || "").replace(/\s+/g, " ").trim();
      const body = [];
      const title = card.querySelector("h2, h3");
      if (title && clean(title.textContent)) {
        const h = document2.createElement("h2");
        h.textContent = clean(title.textContent);
        body.push(h);
      }
      card.querySelectorAll(":scope > p").forEach((p) => {
        if (clean(p.textContent)) body.push(p);
      });
      const action = card.querySelector(".action");
      const text = action ? clean(action.textContent) : "";
      if (text && card.getAttribute("href")) {
        const p = document2.createElement("p");
        const a = document2.createElement("a");
        a.setAttribute("href", card.getAttribute("href"));
        a.textContent = text;
        p.append(a);
        body.push(p);
      }
      return body;
    };
    const cells = [];
    element.querySelectorAll(`.${IMAGE_RIGHT}, .${TEXT_ONLY}, .${IMAGE_BG}, .${SIMPLE}, a.${LINKBOX}`).forEach((card) => {
      if (card.classList.contains(LINKBOX)) {
        const linkboxBody = buildLinkboxBody(card);
        if (linkboxBody.length) cells.push(["", linkboxBody]);
        return;
      }
      if (card.classList.contains(SIMPLE)) {
        const simpleBody = buildSimpleBody(card);
        if (simpleBody.length) cells.push(["", simpleBody]);
        return;
      }
      const body = buildBody(card);
      if (card.classList.contains(IMAGE_RIGHT)) {
        cells.push([body, buildImage(card)]);
      } else if (card.classList.contains(IMAGE_BG)) {
        cells.push([buildImage(card), body]);
      } else {
        cells.push(["", body]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-action", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-banner.js
  function appendCard(card, target, document2) {
    const clean = (text) => (text || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
    const eyebrow = card.querySelector(".cmp-title__pretitle");
    if (eyebrow && clean(eyebrow.textContent)) {
      const p = document2.createElement("p");
      p.textContent = clean(eyebrow.textContent);
      target.push(p);
    }
    const heading = card.querySelector(".cmp-title h1, .cmp-title h2, .cmp-title h3");
    if (heading && clean(heading.textContent)) {
      const h = document2.createElement(heading.tagName.toLowerCase());
      h.textContent = clean(heading.textContent);
      target.push(h);
    }
    card.querySelectorAll(".cmp-text-card__description").forEach((description) => {
      const blocks = [...description.children].filter((child) => clean(child.textContent));
      if (blocks.length) {
        blocks.forEach((child) => target.push(child));
      } else if (clean(description.textContent)) {
        const p = document2.createElement("p");
        p.textContent = clean(description.textContent);
        target.push(p);
      }
    });
    card.querySelectorAll(".cmp-text-card__buttons a[href], .cmp-link a[href]").forEach((link) => {
      const textEl = link.querySelector(".cmp-button__text");
      const text = clean((textEl || link).textContent);
      if (!text) return;
      const p = document2.createElement("p");
      const a = document2.createElement("a");
      a.setAttribute("href", link.getAttribute("href"));
      a.textContent = text;
      p.append(a);
      target.push(p);
    });
  }
  function parseTextCard(element, document2) {
    const cards = [...element.querySelectorAll(".cmp-text-card")];
    const left = [];
    const right = [];
    cards.forEach((card) => {
      const target = card.querySelector(".cmp-title h1, .cmp-title h2, .cmp-title h3") ? left : right;
      appendCard(card, target, document2);
    });
    return [[left, right]];
  }
  function parse2(element, { document: document2, params }) {
    if (element.classList.contains("cmp-text-card__care")) {
      const textCardBlock = WebImporter.Blocks.createBlock(document2, { name: "columns-banner", cells: parseTextCard(element, document2) });
      element.replaceWith(textCardBlock);
      return;
    }
    const textCards = [...element.querySelectorAll(".cmp-text-card")].filter((card) => !card.parentElement.closest(".cmp-text-card"));
    if (textCards.length && !element.matches("#top-advertisement")) {
      const row = textCards.map((card) => {
        const cell = [];
        appendCard(card, cell, document2);
        return cell;
      });
      const cardsBlock = WebImporter.Blocks.createBlock(document2, { name: "columns-banner", cells: [row] });
      element.replaceWith(cardsBlock);
      return;
    }
    const headingCell = [];
    const heading = element.querySelector(".cmp-title h1, .cmp-title h2, .cmp-title h3, h2");
    if (heading) {
      const h = document2.createElement(heading.tagName.toLowerCase());
      h.textContent = heading.textContent.trim();
      headingCell.push(h);
    }
    const textCell = [];
    element.querySelectorAll(".cmp-text__rich-content").forEach((rich) => {
      [...rich.children].forEach((child) => {
        if (child.textContent.trim()) textCell.push(child);
      });
    });
    const ctaCell = [];
    const seen = /* @__PURE__ */ new Set();
    element.querySelectorAll(".cmp-link a[href]").forEach((link) => {
      const textEl = link.querySelector(".cmp-button__text");
      const text = (textEl || link).textContent.trim();
      const href = link.getAttribute("href");
      const key = `${href}|${text}`;
      if (!text || seen.has(key)) return;
      seen.add(key);
      const p = document2.createElement("p");
      const strong = document2.createElement("strong");
      const a = document2.createElement("a");
      a.href = href;
      a.textContent = text;
      strong.append(a);
      p.append(strong);
      ctaCell.push(p);
    });
    const cells = [[headingCell, textCell, ctaCell]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/mayoclinic-cleanup.js
  var MIGRATED_CONDITION_URLS = /* @__PURE__ */ new Set([
    "https://www.mayoclinic.org/diseases-conditions/abdominal-aortic-aneurysm/symptoms-causes/syc-20350688",
    "https://www.mayoclinic.org/diseases-conditions/acanthosis-nigricans/symptoms-causes/syc-20368983",
    "https://www.mayoclinic.org/diseases-conditions/achalasia/symptoms-causes/syc-20352850",
    "https://www.mayoclinic.org/diseases-conditions/achilles-tendinitis/symptoms-causes/syc-20369020",
    "https://www.mayoclinic.org/diseases-conditions/achilles-tendon-rupture/symptoms-causes/syc-20353234",
    "https://www.mayoclinic.org/diseases-conditions/acl-injury/symptoms-causes/syc-20350738",
    "https://www.mayoclinic.org/diseases-conditions/acne/symptoms-causes/syc-20368047",
    "https://www.mayoclinic.org/diseases-conditions/actinic-keratosis/symptoms-causes/syc-20354969",
    "https://www.mayoclinic.org/diseases-conditions/acute-lymphocytic-leukemia/symptoms-causes/syc-20369077",
    "https://www.mayoclinic.org/diseases-conditions/albinism/symptoms-causes/syc-20369184",
    "https://www.mayoclinic.org/diseases-conditions/alpha-1-antitrypsin-deficiency/symptoms-causes/syc-20588790",
    "https://www.mayoclinic.org/diseases-conditions/anal-cancer/symptoms-causes/syc-20354140",
    "https://www.mayoclinic.org/diseases-conditions/anorexia-nervosa/symptoms-causes/syc-20353591",
    "https://www.mayoclinic.org/diseases-conditions/atrial-fibrillation/symptoms-causes/syc-20350624",
    "https://www.mayoclinic.org/diseases-conditions/baby-acne/symptoms-causes/syc-20369880",
    "https://www.mayoclinic.org/diseases-conditions/back-pain/symptoms-causes/syc-20369906",
    "https://www.mayoclinic.org/diseases-conditions/bacterial-vaginosis/symptoms-causes/syc-20352279",
    "https://www.mayoclinic.org/diseases-conditions/bad-breath/symptoms-causes/syc-20350922",
    "https://www.mayoclinic.org/diseases-conditions/bags-under-eyes/symptoms-causes/syc-20369927",
    "https://www.mayoclinic.org/diseases-conditions/bakers-cyst/symptoms-causes/syc-20369950",
    "https://www.mayoclinic.org/diseases-conditions/balance-problems/symptoms-causes/syc-20350474",
    "https://www.mayoclinic.org/diseases-conditions/bardet-biedl-syndrome/symptoms-causes/syc-20586227",
    "https://www.mayoclinic.org/diseases-conditions/bartholin-cyst/symptoms-causes/syc-20369976",
    "https://www.mayoclinic.org/diseases-conditions/basal-cell-carcinoma/symptoms-causes/syc-20354187",
    "https://www.mayoclinic.org/diseases-conditions/bells-palsy/symptoms-causes/syc-20370028",
    "https://www.mayoclinic.org/diseases-conditions/binge-eating-disorder/symptoms-causes/syc-20353627",
    "https://www.mayoclinic.org/diseases-conditions/black-hairy-tongue/symptoms-causes/syc-20356077",
    "https://www.mayoclinic.org/diseases-conditions/breast-pain/symptoms-causes/syc-20350423",
    "https://www.mayoclinic.org/diseases-conditions/broken-hand/symptoms-causes/syc-20450240",
    "https://www.mayoclinic.org/diseases-conditions/broken-heart-syndrome/symptoms-causes/syc-20354617",
    "https://www.mayoclinic.org/diseases-conditions/bruxism/symptoms-causes/syc-20356095",
    "https://www.mayoclinic.org/diseases-conditions/bulimia/symptoms-causes/syc-20353615",
    "https://www.mayoclinic.org/diseases-conditions/bunions/symptoms-causes/syc-20354799",
    "https://www.mayoclinic.org/diseases-conditions/burning-mouth-syndrome/symptoms-causes/syc-20350911",
    "https://www.mayoclinic.org/diseases-conditions/c-difficile/symptoms-causes/syc-20351691",
    "https://www.mayoclinic.org/diseases-conditions/calciphylaxis/symptoms-causes/syc-20370559",
    "https://www.mayoclinic.org/diseases-conditions/cancer/symptoms-causes/syc-20370588",
    "https://www.mayoclinic.org/diseases-conditions/canker-sore/symptoms-causes/syc-20370615",
    "https://www.mayoclinic.org/diseases-conditions/carcinoma-unknown-primary/symptoms-causes/syc-20370683",
    "https://www.mayoclinic.org/diseases-conditions/cerebral-palsy/symptoms-causes/syc-20353999",
    "https://www.mayoclinic.org/diseases-conditions/chest-pain/symptoms-causes/syc-20370838",
    "https://www.mayoclinic.org/diseases-conditions/chickenpox/symptoms-causes/syc-20351282",
    "https://www.mayoclinic.org/diseases-conditions/childhood-obesity/symptoms-causes/syc-20354827",
    "https://www.mayoclinic.org/diseases-conditions/childhood-schizophrenia/symptoms-causes/syc-20354483",
    "https://www.mayoclinic.org/diseases-conditions/cholecystitis/symptoms-causes/syc-20364867",
    "https://www.mayoclinic.org/diseases-conditions/cholestasis-of-pregnancy/symptoms-causes/syc-20363257",
    "https://www.mayoclinic.org/diseases-conditions/chronic-kidney-disease/symptoms-causes/syc-20354521",
    "https://www.mayoclinic.org/diseases-conditions/color-blindness/symptoms-causes/syc-20354988",
    "https://www.mayoclinic.org/diseases-conditions/common-warts/symptoms-causes/syc-20371125",
    "https://www.mayoclinic.org/diseases-conditions/compulsive-gambling/symptoms-causes/syc-20355178",
    "https://www.mayoclinic.org/diseases-conditions/corns-and-calluses/symptoms-causes/syc-20355946",
    "https://www.mayoclinic.org/diseases-conditions/creutzfeldt-jakob-disease/symptoms-causes/syc-20371226",
    "https://www.mayoclinic.org/diseases-conditions/dandruff/symptoms-causes/syc-20353850",
    "https://www.mayoclinic.org/diseases-conditions/de-quervain-tenosynovitis/symptoms-causes/syc-20371332",
    "https://www.mayoclinic.org/diseases-conditions/deep-vein-thrombosis/symptoms-causes/syc-20352557",
    "https://www.mayoclinic.org/diseases-conditions/dehydration/symptoms-causes/syc-20354086",
    "https://www.mayoclinic.org/diseases-conditions/delayed-ejaculation/symptoms-causes/syc-20371358",
    "https://www.mayoclinic.org/diseases-conditions/delayed-sleep-phase/symptoms-causes/syc-20353340",
    "https://www.mayoclinic.org/diseases-conditions/depression/symptoms-causes/syc-20356007",
    "https://www.mayoclinic.org/diseases-conditions/diabetic-ketoacidosis/symptoms-causes/syc-20371551",
    "https://www.mayoclinic.org/diseases-conditions/digeorge-syndrome/symptoms-causes/syc-20353543",
    "https://www.mayoclinic.org/diseases-conditions/dry-eyes/symptoms-causes/syc-20371863",
    "https://www.mayoclinic.org/diseases-conditions/dry-macular-degeneration/symptoms-causes/syc-20350375",
    "https://www.mayoclinic.org/diseases-conditions/dry-mouth/symptoms-causes/syc-20356048",
    "https://www.mayoclinic.org/diseases-conditions/dry-skin/symptoms-causes/syc-20353885",
    "https://www.mayoclinic.org/diseases-conditions/dumping-syndrome/symptoms-causes/syc-20371915",
    "https://www.mayoclinic.org/diseases-conditions/dyslexia/symptoms-causes/syc-20353552",
    "https://www.mayoclinic.org/diseases-conditions/e-coli/symptoms-causes/syc-20372058",
    "https://www.mayoclinic.org/diseases-conditions/ear-infections/symptoms-causes/syc-20351616",
    "https://www.mayoclinic.org/diseases-conditions/earwax-blockage/symptoms-causes/syc-20353004",
    "https://www.mayoclinic.org/diseases-conditions/eating-disorders/symptoms-causes/syc-20353603",
    "https://www.mayoclinic.org/diseases-conditions/ebsteins-anomaly/symptoms-causes/syc-20352127",
    "https://www.mayoclinic.org/diseases-conditions/esophageal-varices/symptoms-causes/syc-20351538",
    "https://www.mayoclinic.org/diseases-conditions/factitious-disorder/symptoms-causes/syc-20356028",
    "https://www.mayoclinic.org/diseases-conditions/factor-v-leiden/symptoms-causes/syc-20372423",
    "https://www.mayoclinic.org/diseases-conditions/familial-adenomatous-polyposis/symptoms-causes/syc-20372443",
    "https://www.mayoclinic.org/diseases-conditions/familial-hypercholesterolemia/symptoms-causes/syc-20353755",
    "https://www.mayoclinic.org/diseases-conditions/familial-mediterranean-fever/symptoms-causes/syc-20372470",
    "https://www.mayoclinic.org/diseases-conditions/farsightedness/symptoms-causes/syc-20372495",
    "https://www.mayoclinic.org/diseases-conditions/fatty-liver-disease-masld/symptoms-causes/syc-20354567",
    "https://www.mayoclinic.org/diseases-conditions/febrile-seizure/symptoms-causes/syc-20372522",
    "https://www.mayoclinic.org/diseases-conditions/flatfeet/symptoms-causes/syc-20372604",
    "https://www.mayoclinic.org/diseases-conditions/folliculitis/symptoms-causes/syc-20361634",
    "https://www.mayoclinic.org/diseases-conditions/fuchs-dystrophy/symptoms-causes/syc-20352727",
    "https://www.mayoclinic.org/diseases-conditions/galactorrhea/symptoms-causes/syc-20350431",
    "https://www.mayoclinic.org/diseases-conditions/gallbladder-cancer/symptoms-causes/syc-20353370",
    "https://www.mayoclinic.org/diseases-conditions/gallstones/symptoms-causes/syc-20354214",
    "https://www.mayoclinic.org/diseases-conditions/ganglion-cyst/symptoms-causes/syc-20351156",
    "https://www.mayoclinic.org/diseases-conditions/gangrene/symptoms-causes/syc-20352567",
    "https://www.mayoclinic.org/diseases-conditions/gas-and-gas-pains/symptoms-causes/syc-20372709",
    "https://www.mayoclinic.org/diseases-conditions/gastroparesis/symptoms-causes/syc-20355787",
    "https://www.mayoclinic.org/diseases-conditions/generalized-anxiety-disorder/symptoms-causes/syc-20360803",
    "https://www.mayoclinic.org/diseases-conditions/genital-warts/symptoms-causes/syc-20355234",
    "https://www.mayoclinic.org/diseases-conditions/giant-cell-arteritis/symptoms-causes/syc-20372758",
    "https://www.mayoclinic.org/diseases-conditions/granulomatosis-with-polyangiitis/symptoms-causes/syc-20351088",
    "https://www.mayoclinic.org/diseases-conditions/h-pylori/symptoms-causes/syc-20356171",
    "https://www.mayoclinic.org/diseases-conditions/hair-loss/symptoms-causes/syc-20372926",
    "https://www.mayoclinic.org/diseases-conditions/hairy-cell-leukemia/symptoms-causes/syc-20372956",
    "https://www.mayoclinic.org/diseases-conditions/hammertoe-and-mallet-toe/symptoms-causes/syc-20350839",
    "https://www.mayoclinic.org/diseases-conditions/hamstring-injury/symptoms-causes/syc-20372985",
    "https://www.mayoclinic.org/diseases-conditions/hand-foot-and-mouth-disease/symptoms-causes/syc-20353035",
    "https://www.mayoclinic.org/diseases-conditions/hangovers/symptoms-causes/syc-20373012",
    "https://www.mayoclinic.org/diseases-conditions/hantavirus-pulmonary-syndrome/symptoms-causes/syc-20351838",
    "https://www.mayoclinic.org/diseases-conditions/heart-valve-disease/symptoms-causes/syc-20353727",
    "https://www.mayoclinic.org/diseases-conditions/henoch-schonlein-purpura/symptoms-causes/syc-20354040",
    "https://www.mayoclinic.org/diseases-conditions/hip-dysplasia/symptoms-causes/syc-20350209",
    "https://www.mayoclinic.org/diseases-conditions/hirsutism/symptoms-causes/syc-20354935",
    "https://www.mayoclinic.org/diseases-conditions/horner-syndrome/symptoms-causes/syc-20373547",
    "https://www.mayoclinic.org/diseases-conditions/hyperhidrosis/symptoms-causes/syc-20367152",
    "https://www.mayoclinic.org/diseases-conditions/hypersomnia/symptoms-causes/syc-20362332",
    "https://www.mayoclinic.org/diseases-conditions/hypothyroidism/symptoms-causes/syc-20350284",
    "https://www.mayoclinic.org/diseases-conditions/idiopathic-thrombocytopenic-purpura/symptoms-causes/syc-20352325",
    "https://www.mayoclinic.org/diseases-conditions/iga-nephropathy/symptoms-causes/syc-20352268",
    "https://www.mayoclinic.org/diseases-conditions/illness-anxiety-disorder/symptoms-causes/syc-20373782",
    "https://www.mayoclinic.org/diseases-conditions/indigestion/symptoms-causes/syc-20352211",
    "https://www.mayoclinic.org/diseases-conditions/infant-acid-reflux/symptoms-causes/syc-20351408",
    "https://www.mayoclinic.org/diseases-conditions/infant-jaundice/symptoms-causes/syc-20373865",
    "https://www.mayoclinic.org/diseases-conditions/inflammatory-bowel-disease/symptoms-causes/syc-20353315",
    "https://www.mayoclinic.org/diseases-conditions/interstitial-cystitis/symptoms-causes/syc-20354357",
    "https://www.mayoclinic.org/diseases-conditions/interstitial-lung-disease/symptoms-causes/syc-20353108",
    "https://www.mayoclinic.org/diseases-conditions/irritable-bowel-syndrome/symptoms-causes/syc-20360016",
    "https://www.mayoclinic.org/diseases-conditions/jaw-tumors-cysts/symptoms-causes/syc-20350973",
    "https://www.mayoclinic.org/diseases-conditions/jellyfish-stings/symptoms-causes/syc-20353284",
    "https://www.mayoclinic.org/diseases-conditions/jet-lag/symptoms-causes/syc-20374027",
    "https://www.mayoclinic.org/diseases-conditions/jock-itch/symptoms-causes/syc-20353807",
    "https://www.mayoclinic.org/diseases-conditions/juvenile-idiopathic-arthritis/symptoms-causes/syc-20374082",
    "https://www.mayoclinic.org/diseases-conditions/kaposis-sarcoma/symptoms-causes/syc-20577303",
    "https://www.mayoclinic.org/diseases-conditions/kawasaki-disease/symptoms-causes/syc-20354598",
    "https://www.mayoclinic.org/diseases-conditions/keloid-scar/symptoms-causes/syc-20520901",
    "https://www.mayoclinic.org/diseases-conditions/keratitis/symptoms-causes/syc-20374110",
    "https://www.mayoclinic.org/diseases-conditions/keratoconus/symptoms-causes/syc-20351352",
    "https://www.mayoclinic.org/diseases-conditions/keratosis-pilaris/symptoms-causes/syc-20351149",
    "https://www.mayoclinic.org/diseases-conditions/kidney-cancer/symptoms-causes/syc-20352664",
    "https://www.mayoclinic.org/diseases-conditions/kidney-cysts/symptoms-causes/syc-20374134",
    "https://www.mayoclinic.org/diseases-conditions/knee-pain/symptoms-causes/syc-20350849",
    "https://www.mayoclinic.org/diseases-conditions/lactose-intolerance/symptoms-causes/syc-20374232",
    "https://www.mayoclinic.org/diseases-conditions/laryngitis/symptoms-causes/syc-20374262",
    "https://www.mayoclinic.org/diseases-conditions/latex-allergy/symptoms-causes/syc-20374287",
    "https://www.mayoclinic.org/diseases-conditions/lazy-eye/symptoms-causes/syc-20352391",
    "https://www.mayoclinic.org/diseases-conditions/lead-poisoning/symptoms-causes/syc-20354717",
    "https://www.mayoclinic.org/diseases-conditions/left-ventricular-hypertrophy/symptoms-causes/syc-20374314",
    "https://www.mayoclinic.org/diseases-conditions/lichen-sclerosus/symptoms-causes/syc-20374448",
    "https://www.mayoclinic.org/diseases-conditions/lobular-carcinoma-in-situ/symptoms-causes/syc-20374529",
    "https://www.mayoclinic.org/diseases-conditions/malaria/symptoms-causes/syc-20351184",
    "https://www.mayoclinic.org/diseases-conditions/male-breast-cancer/symptoms-causes/syc-20374740",
    "https://www.mayoclinic.org/diseases-conditions/male-hypogonadism/symptoms-causes/syc-20354881",
    "https://www.mayoclinic.org/diseases-conditions/male-infertility/symptoms-causes/syc-20374773",
    "https://www.mayoclinic.org/diseases-conditions/malignant-hyperthermia/symptoms-causes/syc-20353750",
    "https://www.mayoclinic.org/diseases-conditions/malignant-peripheral-nerve-sheath-tumors/symptoms-causes/syc-20362603",
    "https://www.mayoclinic.org/diseases-conditions/mastitis/symptoms-causes/syc-20374829",
    "https://www.mayoclinic.org/diseases-conditions/medication-overuse-headache/symptoms-causes/syc-20377083",
    "https://www.mayoclinic.org/diseases-conditions/men-1/symptoms-causes/syc-20353064",
    "https://www.mayoclinic.org/diseases-conditions/menstrual-cramps/symptoms-causes/syc-20374938",
    "https://www.mayoclinic.org/diseases-conditions/mesothelioma/symptoms-causes/syc-20375022",
    "https://www.mayoclinic.org/diseases-conditions/mitral-valve-prolapse/symptoms-causes/syc-20355446",
    "https://www.mayoclinic.org/diseases-conditions/myelofibrosis/symptoms-causes/syc-20355057",
    "https://www.mayoclinic.org/diseases-conditions/nail-fungus/symptoms-causes/syc-20353294",
    "https://www.mayoclinic.org/diseases-conditions/narcissistic-personality-disorder/symptoms-causes/syc-20366662",
    "https://www.mayoclinic.org/diseases-conditions/narcolepsy/symptoms-causes/syc-20375497",
    "https://www.mayoclinic.org/diseases-conditions/nasal-paranasal-tumors/symptoms-causes/syc-20354136",
    "https://www.mayoclinic.org/diseases-conditions/nasal-polyps/symptoms-causes/syc-20351888",
    "https://www.mayoclinic.org/diseases-conditions/nasopharyngeal-carcinoma/symptoms-causes/syc-20375529",
    "https://www.mayoclinic.org/diseases-conditions/nearsightedness/symptoms-causes/syc-20375556",
    "https://www.mayoclinic.org/diseases-conditions/neck-pain/symptoms-causes/syc-20375581",
    "https://www.mayoclinic.org/diseases-conditions/nephrogenic-systemic-fibrosis/symptoms-causes/syc-20352299",
    "https://www.mayoclinic.org/diseases-conditions/neuroendocrine-tumors/symptoms-causes/syc-20354132",
    "https://www.mayoclinic.org/diseases-conditions/neurofibromatosis-type-2/symptoms-causes/syc-20594157",
    "https://www.mayoclinic.org/diseases-conditions/obesity/symptoms-causes/syc-20375742",
    "https://www.mayoclinic.org/diseases-conditions/obsessive-compulsive-disorder/symptoms-causes/syc-20354432",
    "https://www.mayoclinic.org/diseases-conditions/obstructive-sleep-apnea/symptoms-causes/syc-20352090",
    "https://www.mayoclinic.org/diseases-conditions/occupational-asthma/symptoms-causes/syc-20375772",
    "https://www.mayoclinic.org/diseases-conditions/ocular-rosacea/symptoms-causes/syc-20375798",
    "https://www.mayoclinic.org/diseases-conditions/osteoarthritis/symptoms-causes/syc-20351925",
    "https://www.mayoclinic.org/diseases-conditions/overactive-bladder/symptoms-causes/syc-20355715",
    "https://www.mayoclinic.org/diseases-conditions/pagets-disease-of-bone/symptoms-causes/syc-20350811",
    "https://www.mayoclinic.org/diseases-conditions/pagets-disease-of-the-breast/symptoms-causes/syc-20351079",
    "https://www.mayoclinic.org/diseases-conditions/painful-intercourse/symptoms-causes/syc-20375967",
    "https://www.mayoclinic.org/diseases-conditions/patellar-tendinitis/symptoms-causes/syc-20376113",
    "https://www.mayoclinic.org/diseases-conditions/pediatric-sleep-apnea/symptoms-causes/syc-20376196",
    "https://www.mayoclinic.org/diseases-conditions/pediatric-white-blood-cell-disorders/symptoms-causes/syc-20352674",
    "https://www.mayoclinic.org/diseases-conditions/peptic-ulcer/symptoms-causes/syc-20354223",
    "https://www.mayoclinic.org/diseases-conditions/peripheral-artery-disease/symptoms-causes/syc-20350557",
    "https://www.mayoclinic.org/diseases-conditions/petit-mal-seizure/symptoms-causes/syc-20359683",
    "https://www.mayoclinic.org/diseases-conditions/plague/symptoms-causes/syc-20351291",
    "https://www.mayoclinic.org/diseases-conditions/plantar-warts/symptoms-causes/syc-20352691",
    "https://www.mayoclinic.org/diseases-conditions/poison-ivy/symptoms-causes/syc-20376485",
    "https://www.mayoclinic.org/diseases-conditions/popliteal-artery-entrapment/symptoms-causes/syc-20465211",
    "https://www.mayoclinic.org/diseases-conditions/precocious-puberty/symptoms-causes/syc-20351811",
    "https://www.mayoclinic.org/diseases-conditions/premature-ventricular-contractions/symptoms-causes/syc-20376757",
    "https://www.mayoclinic.org/diseases-conditions/pseudobulbar-affect/symptoms-causes/syc-20353737",
    "https://www.mayoclinic.org/diseases-conditions/pseudomembranous-colitis/symptoms-causes/syc-20351434",
    "https://www.mayoclinic.org/diseases-conditions/pseudotumor-cerebri/symptoms-causes/syc-20354031",
    "https://www.mayoclinic.org/diseases-conditions/rabies/symptoms-causes/syc-20351821",
    "https://www.mayoclinic.org/diseases-conditions/radiation-enteritis/symptoms-causes/syc-20355409",
    "https://www.mayoclinic.org/diseases-conditions/radiation-sickness/symptoms-causes/syc-20377058",
    "https://www.mayoclinic.org/diseases-conditions/ramsay-hunt-syndrome/symptoms-causes/syc-20351783",
    "https://www.mayoclinic.org/diseases-conditions/raynauds-disease/symptoms-causes/syc-20363571",
    "https://www.mayoclinic.org/diseases-conditions/reactive-arthritis/symptoms-causes/syc-20354838",
    "https://www.mayoclinic.org/diseases-conditions/reactive-attachment-disorder/symptoms-causes/syc-20352939",
    "https://www.mayoclinic.org/diseases-conditions/rectal-ulcer/symptoms-causes/syc-20377749",
    "https://www.mayoclinic.org/diseases-conditions/rectocele/symptoms-causes/syc-20353414",
    "https://www.mayoclinic.org/diseases-conditions/rem-sleep-behavior-disorder/symptoms-causes/syc-20352920",
    "https://www.mayoclinic.org/diseases-conditions/rheumatoid-arthritis/symptoms-causes/syc-20353648",
    "https://www.mayoclinic.org/diseases-conditions/ruptured-eardrum/symptoms-causes/syc-20351879",
    "https://www.mayoclinic.org/diseases-conditions/sacral-dimple/symptoms-causes/syc-20377353",
    "https://www.mayoclinic.org/diseases-conditions/sacroiliitis/symptoms-causes/syc-20350747",
    "https://www.mayoclinic.org/diseases-conditions/salivary-gland-cancer/symptoms-causes/syc-20354151",
    "https://www.mayoclinic.org/diseases-conditions/salmonella/symptoms-causes/syc-20355329",
    "https://www.mayoclinic.org/diseases-conditions/sarcoidosis/symptoms-causes/syc-20350358",
    "https://www.mayoclinic.org/diseases-conditions/scabies/symptoms-causes/syc-20377378",
    "https://www.mayoclinic.org/diseases-conditions/seasonal-affective-disorder/symptoms-causes/syc-20364651",
    "https://www.mayoclinic.org/diseases-conditions/seborrheic-keratosis/symptoms-causes/syc-20353878",
    "https://www.mayoclinic.org/diseases-conditions/shingles/symptoms-causes/syc-20353054",
    "https://www.mayoclinic.org/diseases-conditions/small-intestinal-bacterial-overgrowth/symptoms-causes/syc-20370168",
    "https://www.mayoclinic.org/diseases-conditions/spontaneous-coronary-artery-dissection/symptoms-causes/syc-20353711",
    "https://www.mayoclinic.org/diseases-conditions/swimmers-ear/symptoms-causes/syc-20351682",
    "https://www.mayoclinic.org/diseases-conditions/swine-flu/symptoms-causes/syc-20378103",
    "https://www.mayoclinic.org/diseases-conditions/swollen-knee/symptoms-causes/syc-20378129",
    "https://www.mayoclinic.org/diseases-conditions/t-cell-lymphoma/symptoms-causes/syc-20588407",
    "https://www.mayoclinic.org/diseases-conditions/tachycardia/symptoms-causes/syc-20355127",
    "https://www.mayoclinic.org/diseases-conditions/takayasus-arteritis/symptoms-causes/syc-20351335",
    "https://www.mayoclinic.org/diseases-conditions/tapeworm/symptoms-causes/syc-20378174",
    "https://www.mayoclinic.org/diseases-conditions/tay-sachs-disease/symptoms-causes/syc-20378190",
    "https://www.mayoclinic.org/diseases-conditions/teen-depression/symptoms-causes/syc-20350985",
    "https://www.mayoclinic.org/diseases-conditions/tennis-elbow/symptoms-causes/syc-20351987",
    "https://www.mayoclinic.org/diseases-conditions/tetralogy-of-fallot/symptoms-causes/syc-20353477",
    "https://www.mayoclinic.org/diseases-conditions/toe-walking/symptoms-causes/syc-20378410",
    "https://www.mayoclinic.org/diseases-conditions/traumatic-brain-injury/symptoms-causes/syc-20378557",
    "https://www.mayoclinic.org/diseases-conditions/trichotillomania/symptoms-causes/syc-20355188",
    "https://www.mayoclinic.org/diseases-conditions/triple-x-syndrome/symptoms-causes/syc-20350977",
    "https://www.mayoclinic.org/diseases-conditions/tuberculosis/symptoms-causes/syc-20351250",
    "https://www.mayoclinic.org/diseases-conditions/ulcerative-colitis/symptoms-causes/syc-20353326",
    "https://www.mayoclinic.org/diseases-conditions/ulnar-wrist-pain/symptoms-causes/syc-20355510",
    "https://www.mayoclinic.org/diseases-conditions/umbilical-hernia/symptoms-causes/syc-20378685",
    "https://www.mayoclinic.org/diseases-conditions/undescended-testicle/symptoms-causes/syc-20351995",
    "https://www.mayoclinic.org/diseases-conditions/ureteral-cancer/symptoms-causes/syc-20360721",
    "https://www.mayoclinic.org/diseases-conditions/ureteral-obstruction/symptoms-causes/syc-20354676",
    "https://www.mayoclinic.org/diseases-conditions/vaginal-agenesis/symptoms-causes/syc-20355737",
    "https://www.mayoclinic.org/diseases-conditions/vaginal-atrophy/symptoms-causes/syc-20352288",
    "https://www.mayoclinic.org/diseases-conditions/vaginal-cancer/symptoms-causes/syc-20352447",
    "https://www.mayoclinic.org/diseases-conditions/vaginal-fistulas/symptoms-causes/syc-20355762",
    "https://www.mayoclinic.org/diseases-conditions/vaginitis/symptoms-causes/syc-20354707",
    "https://www.mayoclinic.org/diseases-conditions/valley-fever/symptoms-causes/syc-20378761",
    "https://www.mayoclinic.org/diseases-conditions/varicocele/symptoms-causes/syc-20378771",
    "https://www.mayoclinic.org/diseases-conditions/varicose-veins/symptoms-causes/syc-20350643",
    "https://www.mayoclinic.org/diseases-conditions/viral-hemorrhagic-fevers/symptoms-causes/syc-20351260",
    "https://www.mayoclinic.org/diseases-conditions/wet-macular-degeneration/symptoms-causes/syc-20351107",
    "https://www.mayoclinic.org/diseases-conditions/wheat-allergy/symptoms-causes/syc-20378897",
    "https://www.mayoclinic.org/diseases-conditions/whiplash/symptoms-causes/syc-20378921",
    "https://www.mayoclinic.org/diseases-conditions/whipples-disease/symptoms-causes/syc-20378946",
    "https://www.mayoclinic.org/diseases-conditions/wilms-tumor/symptoms-causes/syc-20352655",
    "https://www.mayoclinic.org/diseases-conditions/wrist-pain/symptoms-causes/syc-20366213",
    "https://www.mayoclinic.org/diseases-conditions/x-linked-agammaglobulinemia/symptoms-causes/syc-20361635",
    "https://www.mayoclinic.org/diseases-conditions/yeast-infection/symptoms-causes/syc-20378999",
    "https://www.mayoclinic.org/diseases-conditions/yips/symptoms-causes/syc-20379021",
    "https://www.mayoclinic.org/diseases-conditions/zenkers-diverticulum/symptoms-causes/syc-20568839",
    "https://www.mayoclinic.org/diseases-conditions/zollinger-ellison-syndrome/symptoms-causes/syc-20379042"
  ]);
  function migratedConditionPath(href) {
    let url;
    try {
      url = new URL(href, "https://www.mayoclinic.org");
    } catch (e) {
      return null;
    }
    if (!MIGRATED_CONDITION_URLS.has(`https://www.mayoclinic.org${url.pathname.replace(/\/$/, "")}`)) return null;
    const parts = url.pathname.split("/").filter(Boolean);
    return `/health-library/diseases-conditions/${parts[1]}/${parts[2]}`;
  }
  var CONDITION_ROOT = ".cmp-column-control__layoutType--ThreeColumnWithL2AndAd";
  var MAYO_ORIGIN = "https://www.mayoclinic.org";
  function isEmpty(el) {
    return !el.textContent.trim() && !el.querySelector("img, picture, video, iframe, table, hr");
  }
  function removeWithEmptyWrappers(el, stopAt) {
    let parent = el.parentElement;
    el.remove();
    while (parent && parent !== stopAt && stopAt.contains(parent) && isEmpty(parent)) {
      const next = parent.parentElement;
      parent.remove();
      parent = next;
    }
  }
  function fixLazyImages(root) {
    root.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src") || "";
      const placeholder = !src || src.startsWith("data:") || /blank|placeholder|spacer/i.test(src);
      const lazy = img.getAttribute("data-src") || img.getAttribute("data-lazy-src") || img.getAttribute("data-original");
      const srcset = img.getAttribute("srcset") || img.getAttribute("data-srcset") || "";
      if (lazy && placeholder) {
        img.setAttribute("src", lazy);
      } else if (placeholder && srcset) {
        const first = srcset.split(",")[0].trim().split(/\s+/)[0];
        if (first) img.setAttribute("src", first);
      }
      ["data-src", "data-lazy-src", "data-original", "data-srcset", "srcset", "sizes"].forEach((a) => img.removeAttribute(a));
    });
  }
  function slugify(text) {
    return text.trim().toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, "").replace(/\s/g, "-");
  }
  function recordYoutubeVideos(element) {
    element.querySelectorAll(".cmp-video-from-model").forEach((video) => {
      if (video.hasAttribute("data-youtube-src")) return;
      const iframe = video.querySelector('iframe[src*="youtube"], iframe[id^="youtube-"]');
      if (!iframe) return;
      const src = iframe.getAttribute("src") || "";
      const fromSrc = src.match(/youtube(?:-nocookie)?\.com\/embed\/([\w-]{6,})/);
      const fromId = (iframe.id || "").match(/^youtube-([\w-]{6,}?)(?:-r\d+)?$/);
      const id = fromSrc && fromSrc[1] || fromId && fromId[1];
      if (id) video.setAttribute("data-youtube-src", `https://www.youtube.com/watch?v=${id}`);
    });
  }
  function cleanConditionBefore(root) {
    const doc = root.ownerDocument;
    root.querySelectorAll(".cmp-column-control__ad-column").forEach((el) => el.remove());
    const column = root.querySelector(".cmp-column-control__content-column");
    if (column) {
      [
        // Duplicate section nav at the end of the article (mobile pattern; the left nav is the block)
        ".cmp-level-two-navigation",
        // Newsletter sign-up card (e-mail form)
        ".cmp-news-letter-signup-from-model",
        // Print button (links to the ?p=1 print rendition)
        ".cmp-print-button",
        // Internal content ID (CON-...)
        ".cmp-poc-id",
        // Empty placeholders
        "#empty-dynamic-related-content",
        // In-article mobile ad slot and its separators
        "#cmp-mobile-advertisement__wrapped-content-container",
        ".cmp-mobile-advertisement",
        // Decorative separators inside the related-content and news lists
        ".cmp-dynamic-related-content .cmp-separator",
        ".cmp-dynamic-related-content hr",
        ".cmp-news-and-patient-stories .cmp-separator",
        ".cmp-news-and-patient-stories hr"
      ].forEach((sel) => {
        column.querySelectorAll(sel).forEach((el) => {
          if (!el.isConnected) return;
          const target = el.closest(".cmp-link") && sel === ".cmp-print-button" ? el.closest(".cmp-link") : el;
          removeWithEmptyWrappers(target, column);
        });
      });
    }
    root.querySelectorAll(".cmp-icon, svg").forEach((el) => el.remove());
    fixLazyImages(root);
    root.querySelectorAll(".cmp-titlewithparent h1").forEach((h1) => {
      const second = h1.querySelector(".second-title");
      const secondText = second ? second.textContent.trim() : "";
      if (second) second.remove();
      const firstText = h1.textContent.replace(/\s+/g, " ").trim();
      const heading = doc.createElement("h1");
      heading.append(doc.createTextNode(firstText));
      if (secondText) heading.append(doc.createElement("br"), doc.createTextNode(secondText));
      h1.replaceWith(heading);
    });
  }
  function linkText(a) {
    const label = a.querySelector(".cmp-button__text") || a;
    return label.textContent.replace(/\s+/g, " ").trim();
  }
  function cleanLink(doc, a) {
    const link = doc.createElement("a");
    link.setAttribute("href", a.getAttribute("href"));
    link.textContent = linkText(a);
    return link;
  }
  function paragraph(doc, ...children) {
    const p = doc.createElement("p");
    p.append(...children);
    return p;
  }
  function isDefaultContent(el) {
    return !el.closest("table");
  }
  function cleanConditionAfter(root) {
    const doc = root.ownerDocument;
    const each = (sel, fn) => [...root.querySelectorAll(sel)].filter(isDefaultContent).forEach(fn);
    each("conbodydiv, section", (el) => el.replaceWith(...el.childNodes));
    each(".cmp-anchor-nav", (nav) => {
      const frag = doc.createDocumentFragment();
      const label = nav.querySelector(".cmp-title, h2");
      if (label && label.textContent.trim()) frag.append(paragraph(doc, doc.createTextNode(label.textContent.trim())));
      const ul = doc.createElement("ul");
      nav.querySelectorAll("a[href]").forEach((a) => {
        const link = cleanLink(doc, a);
        const href = a.getAttribute("href");
        if (href.startsWith("#")) {
          let target = null;
          try {
            target = root.querySelector(`[id="${href.slice(1).replace(/"/g, '\\"')}"]`);
          } catch (e) {
          }
          if (target && target.textContent.trim()) link.setAttribute("href", `#${slugify(target.textContent)}`);
        }
        const li = doc.createElement("li");
        li.append(link);
        ul.append(li);
      });
      if (ul.children.length) frag.append(ul);
      nav.replaceWith(frag);
    });
    each(".cmp-text-card", (card) => {
      const frag = doc.createDocumentFragment();
      const title = card.querySelector(".cmp-text-card__title, h2, h3");
      if (title && title.textContent.trim()) {
        const h = doc.createElement(title.tagName.toLowerCase().match(/^h[1-6]$/) ? title.tagName.toLowerCase() : "h2");
        h.textContent = title.textContent.trim();
        frag.append(h);
      }
      const desc = card.querySelector(".cmp-text-card__description");
      if (desc) frag.append(...desc.childNodes);
      card.querySelectorAll(".cmp-text-card__buttons a[href]").forEach((a) => frag.append(paragraph(doc, cleanLink(doc, a))));
      card.replaceWith(frag);
    });
    each(".cmp-image-with-title", (fig) => {
      const frag = doc.createDocumentFragment();
      const img = fig.querySelector("picture") || fig.querySelector("img");
      if (img) frag.append(paragraph(doc, img));
      const title = fig.querySelector(".cmp-image-with-title__title-wrapper .cmp-title");
      if (title && title.textContent.trim()) {
        const strong = doc.createElement("strong");
        strong.textContent = title.textContent.trim();
        frag.append(paragraph(doc, strong));
      }
      const caption = fig.querySelector(".cmp-text__rich-content");
      if (caption) {
        const blocks = caption.querySelectorAll(":scope > p, :scope > ul, :scope > ol");
        if (blocks.length) frag.append(...blocks);
        else if (caption.textContent.trim()) frag.append(paragraph(doc, doc.createTextNode(caption.textContent.trim())));
      }
      fig.replaceWith(frag);
    });
    each("dl", (dl) => {
      const frag = doc.createDocumentFragment();
      [...dl.children].forEach((child) => {
        if (child.tagName === "DT") {
          const h3 = doc.createElement("h3");
          h3.textContent = child.textContent.trim();
          frag.append(h3);
        } else if (child.tagName === "DD") {
          frag.append(...child.childNodes);
        }
      });
      dl.replaceWith(frag);
    });
    each("a.cmp-health-information-topic__byline", (a) => (a.closest(".cmp-link") || a).replaceWith(paragraph(doc, cleanLink(doc, a))));
    each(".cmp-health-information-topic__date", (el) => el.replaceWith(paragraph(doc, doc.createTextNode(el.textContent.trim()))));
    each("a.cmp-button", (a) => {
      if (!a.isConnected || !a.getAttribute("href")) return;
      const link = cleanLink(doc, a);
      const primary = a.matches(".cmp-request-appointment-button") || !!a.querySelector(".cmp-button__inner--type-pill");
      let content = link;
      if (primary) {
        content = doc.createElement("strong");
        content.append(link);
      }
      const wrapper = a.closest(".cmp-link") || a;
      if (wrapper.closest("li, p")) wrapper.replaceWith(content);
      else wrapper.replaceWith(paragraph(doc, content));
    });
    each("h1, h2, h3, h4, h5, h6", (h) => {
      [...h.attributes].forEach((attr) => h.removeAttribute(attr.name));
    });
    root.querySelectorAll('a[href^="/"]:not([href^="//"])').forEach((a) => {
      const href = a.getAttribute("href");
      if (href === "/health-library" || href.startsWith("/health-library/")) return;
      const absolute = `${MAYO_ORIGIN}${href}`;
      a.setAttribute("href", absolute);
      if (a.textContent.trim() === href) a.textContent = absolute;
    });
  }
  var DA_MEDIA = "https://content.da.live/charronadobe/mayo-rdda/media/mayoclinic";
  var DA_KALTURA = "https://content.da.live/charronadobe/mayo-rdda/media/thumbnails";
  function daMediaUrl(src) {
    let url;
    try {
      url = new URL(src, "https://www.mayoclinic.org");
    } catch (e) {
      return null;
    }
    if (/(^|\.)kaltura\.com$/.test(url.hostname)) {
      const entry = (url.pathname.match(/\/entry_id\/([^/]+)/) || [])[1];
      return entry ? `${DA_KALTURA}/kaltura-${entry.toLowerCase().replace(/[^a-z0-9_-]/g, "-")}.jpg` : null;
    }
    if (url.hostname !== "www.mayoclinic.org") return null;
    const name = decodeURIComponent(url.pathname.split("/").pop() || "").toLowerCase().replace(/[^a-z0-9._-]/g, "-");
    return name ? `${DA_MEDIA}/${name}` : null;
  }
  var CARE_TEMPLATES = /* @__PURE__ */ new Set(["care-hub", "care-service", "find-a-doctor", "departments-centers", "international"]);
  var CARE_PAGES = {
    "/patient-centered-care": "/care-at-mayo-clinic/patient-centered-care",
    "/about-mayo-clinic": "/care-at-mayo-clinic/about-mayo-clinic",
    "/appointments": "/care-at-mayo-clinic/appointments",
    "/appointments/find-a-doctor": "/care-at-mayo-clinic/find-a-doctor",
    "/locations": "/care-at-mayo-clinic/locations",
    "/patient-visitor-guide": "/care-at-mayo-clinic/patient-visitor-guide",
    "/billing-insurance": "/care-at-mayo-clinic/billing-insurance",
    "/departments-centers": "/care-at-mayo-clinic/departments-centers",
    "/international": "/care-at-mayo-clinic/international",
    "/about-mayo-clinic/contact": "/care-at-mayo-clinic/contact"
  };
  var CARE_FRAGMENTS = {
    "/about-mayo-clinic/contact": {
      arizona: "arizona---scottsdalephoenix",
      florida: "florida---jacksonville",
      minnesota: "minnesota---rochester",
      "staff-directories": "staff-phone-and-email-directories"
    }
  };
  function isCarePage(payload) {
    const template = payload && payload.template;
    return !!(template && CARE_TEMPLATES.has(template.name));
  }
  function anchorSlug(root, id) {
    let target = null;
    try {
      target = root.querySelector(`[id="${id.replace(/"/g, '\\"')}"]`);
    } catch (e) {
      return null;
    }
    if (!target) return null;
    const heading = /^H[1-6]$/.test(target.tagName) ? target : target.querySelector("h1, h2, h3, h4, h5, h6");
    return heading && heading.textContent.trim() ? slugify(heading.textContent) : null;
  }
  function cleanCareBefore(main) {
    const doc = main.ownerDocument;
    main.querySelectorAll(".cmp-video-from-model:not([data-youtube-src])").forEach((video) => {
      const poster = video.querySelector('img[src*="ytimg.com/vi/"]');
      const id = poster && (poster.getAttribute("src").match(/ytimg\.com\/vi\/([\w-]{6,})\//) || [])[1];
      if (id) video.setAttribute("data-youtube-src", `https://www.youtube.com/watch?v=${id}`);
    });
    [
      // Slider dots and prev/next arrows (generated by the carousel-story block code)
      ".cmp-slider__controls-container",
      // Story cards: the mobile-only "Read more about ..." expando repeats the collapsible text
      ".cmp-story-card .cmp-text-card__expando",
      // Video poster play button and duration (decorative; the block renders its own)
      ".cmp-poster__content"
    ].forEach((sel) => main.querySelectorAll(sel).forEach((el) => el.remove()));
    main.querySelectorAll('a[href="#top"], a[href$="#top"]').forEach((a) => {
      if (!a.isConnected) return;
      removeWithEmptyWrappers(a.closest(".cmp-link") || a, main);
    });
    main.querySelectorAll(".cmp-icon, mc-icon, svg").forEach((el) => el.remove());
    fixLazyImages(main);
    main.querySelectorAll(".cmp-headline__titles").forEach((titles) => {
      const h1s = [...titles.querySelectorAll("h1")];
      if (h1s.length < 2) return;
      const heading = doc.createElement("h1");
      h1s.forEach((h, i) => {
        if (i) heading.append(doc.createElement("br"));
        heading.append(doc.createTextNode(h.textContent.replace(/\s+/g, " ").trim()));
      });
      h1s[0].replaceWith(heading);
      h1s.slice(1).forEach((h) => removeWithEmptyWrappers(h, titles));
    });
    main.querySelectorAll('a[href^="#"]').forEach((a) => {
      const id = a.getAttribute("href").slice(1);
      const slug = id && anchorSlug(main, id);
      if (slug) a.setAttribute("href", `#${slug}`);
    });
    main.querySelectorAll(".cmp-anchor-nav").forEach((nav) => {
      const frag = doc.createDocumentFragment();
      const label = nav.querySelector(".cmp-title, h2, h3");
      if (label && label.textContent.trim()) frag.append(paragraph(doc, doc.createTextNode(label.textContent.trim())));
      const ul = doc.createElement("ul");
      nav.querySelectorAll("a[href]").forEach((a) => {
        const li = doc.createElement("li");
        li.append(cleanLink(doc, a));
        ul.append(li);
      });
      if (ul.children.length) frag.append(ul);
      nav.replaceWith(frag);
    });
  }
  function careLocalHref(href) {
    let url;
    try {
      url = new URL(href);
    } catch (e) {
      return null;
    }
    if (!/^(www\.)?mayoclinic\.org$/.test(url.hostname)) return null;
    const path = url.pathname.replace(/\/+$/, "").toLowerCase() || "/";
    if (path === "/departments-centers" && url.searchParams.has("location")) return null;
    const local = CARE_PAGES[path];
    if (local) {
      const id = url.hash.slice(1);
      const fragments = CARE_FRAGMENTS[path] || {};
      const hash = id ? `#${fragments[id] || id}` : "";
      return `${local}${url.search}${hash}`;
    }
    return migratedConditionPath(url.href);
  }
  function cleanCareAfter(main) {
    main.querySelectorAll("a[href]").forEach((a) => {
      const href = a.getAttribute("href").trim();
      let next = href;
      if (/^\/(?!\/)/.test(href) && href !== "/health-library" && !href.startsWith("/health-library/")) {
        next = `${MAYO_ORIGIN}${href}`;
      }
      if (/^https?:\/\//.test(next)) next = careLocalHref(next) || next;
      if (next === href) return;
      a.setAttribute("href", next);
      if (a.textContent.trim() === href) a.textContent = next;
    });
    main.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((h) => {
      [...h.attributes].forEach((attr) => h.removeAttribute(attr.name));
    });
  }
  function isCareServicePage(payload) {
    return !!(payload && payload.template && payload.template.name === "care-service");
  }
  function cleanCareServiceBefore(main) {
    main.querySelectorAll('.cmp-container--background-color-donations img[src*="/images/icons/"]').forEach((img) => {
      removeWithEmptyWrappers(img.closest("picture") || img, main);
    });
  }
  function widestImageSrc(picture) {
    let best = null;
    let bestWidth = -1;
    picture.querySelectorAll("source[srcset]").forEach((source) => {
      const width = +((source.getAttribute("media") || "").match(/min-width:\s*(\d+)px/) || [0, 0])[1];
      const src = source.getAttribute("srcset").split(",")[0].trim().split(/\s+/)[0];
      if (src && width >= bestWidth) {
        best = src;
        bestWidth = width;
      }
    });
    const img = picture.querySelector("img");
    return best || img && img.getAttribute("src");
  }
  function cleanCareServiceAfter(main) {
    const doc = main.ownerDocument;
    const each = (sel, fn) => [...main.querySelectorAll(sel)].filter(isDefaultContent).forEach(fn);
    each(".cmp-text-card", (card) => {
      if (card.querySelector(".cmp-text-card__buttons a[href]")) return;
      const frag = doc.createDocumentFragment();
      const title = card.querySelector(".cmp-text-card__title, h2, h3, h4");
      if (title && title.textContent.trim()) {
        const tag = /^H[1-6]$/.test(title.tagName) ? title.tagName.toLowerCase() : "h2";
        const h = doc.createElement(tag);
        h.textContent = title.textContent.replace(/\s+/g, " ").trim();
        frag.append(h);
      }
      const desc = card.querySelector(".cmp-text-card__description");
      if (desc) {
        const blocks = desc.querySelectorAll(":scope > p, :scope > ul, :scope > ol");
        if (blocks.length) frag.append(...blocks);
        else if (desc.textContent.trim()) frag.append(paragraph(doc, doc.createTextNode(desc.textContent.trim())));
      }
      card.replaceWith(frag);
    });
    each(".cmp-hero-card", (hero) => {
      const picture = hero.querySelector("picture");
      const src = picture && widestImageSrc(picture);
      if (!src) return;
      const source = picture.querySelector("img");
      const img = doc.createElement("img");
      img.setAttribute("src", src);
      img.setAttribute("alt", source && source.getAttribute("alt") || "");
      hero.replaceWith(paragraph(doc, img));
    });
  }
  function isFindADoctorPage(payload) {
    return !!(payload && payload.template && payload.template.name === "find-a-doctor");
  }
  function cleanFindADoctorBefore(root) {
    const doc = root.ownerDocument;
    root.querySelectorAll(".main > header").forEach((header) => {
      const title = [...header.querySelectorAll("h1")].map((h) => h.textContent.replace(/\s+/g, " ").trim()).find(Boolean);
      if (!title) return;
      const h1 = doc.createElement("h1");
      h1.textContent = title;
      header.replaceWith(h1);
    });
    root.querySelectorAll("#main-content .breadcrumbs").forEach((el) => {
      const main = el.closest("#main-content");
      if (el.isConnected) removeWithEmptyWrappers(el, main);
    });
    root.querySelectorAll("ul.ui-autocomplete, .ui-helper-hidden-accessible, .page-alert").forEach((el) => el.remove());
    root.querySelectorAll('.cmp-container--background-color-donations img[src*="/images/icons/"]').forEach((img) => {
      if (!img.isConnected) return;
      const band = img.closest(".cmp-container--background-color-donations");
      removeWithEmptyWrappers(img.closest("picture") || img, band);
    });
    root.querySelectorAll("#main-content .sub").forEach((sub) => {
      const columns = [...sub.querySelectorAll(":scope > .p-4")].filter((col) => col.querySelector(":scope > a.linkbox"));
      const [first, ...rest] = columns;
      rest.forEach((col) => {
        first.append(...col.querySelectorAll(":scope > a.linkbox"));
        if (isEmpty(col)) col.remove();
      });
    });
  }
  function cleanFindADoctorAfter(root) {
    const doc = root.ownerDocument;
    root.querySelectorAll("ol.acces-alpha").forEach((list) => {
      const ol = doc.createElement("ol");
      list.querySelectorAll("a[href]").forEach((a) => {
        const shown = a.querySelector('[aria-hidden="true"]');
        const text = (shown || a).textContent.replace(/\s+/g, " ").trim();
        if (!text) return;
        let href = a.getAttribute("href");
        try {
          href = new URL(href, MAYO_ORIGIN).href;
        } catch (e) {
        }
        const link = doc.createElement("a");
        link.setAttribute("href", href);
        link.textContent = text;
        const li = doc.createElement("li");
        li.append(link);
        ol.append(li);
      });
      list.replaceWith(ol);
    });
  }
  function isDepartmentsCentersPage(payload) {
    return !!(payload && payload.template && payload.template.name === "departments-centers");
  }
  function isLegacyAspPage(payload) {
    return isFindADoctorPage(payload) || isDepartmentsCentersPage(payload);
  }
  function careRootSelector(payload) {
    return isDepartmentsCentersPage(payload) ? "#main" : "#main-content";
  }
  function cleanDepartmentsCentersBefore(root) {
    const doc = root.ownerDocument;
    const text = (el) => el.textContent.replace(/\s+/g, " ").trim();
    root.querySelectorAll("#main > .page-header h1").forEach((h) => {
      if (!text(h)) {
        h.remove();
        return;
      }
      const h1 = doc.createElement("h1");
      h1.textContent = text(h);
      h.replaceWith(h1);
    });
    root.querySelectorAll("#mayo-wrapper > div.pageinfo, #filter a.mobilePull, #main a.linkbox script").forEach((el) => el.remove());
    root.querySelectorAll("#main .internalads, #main .mobile.test").forEach((el) => {
      if (el.isConnected && isEmpty(el)) el.remove();
    });
    root.querySelectorAll("#main > div.clearfix").forEach((el) => el.remove());
    root.querySelectorAll("#main .related-links a.linkbox").forEach((box) => {
      const frag = doc.createDocumentFragment();
      const title = box.querySelector("h2, h3, h4");
      if (title && text(title)) {
        const h2 = doc.createElement("h2");
        h2.textContent = text(title);
        frag.append(h2);
      }
      box.querySelectorAll(":scope > p").forEach((p) => {
        if (text(p)) frag.append(paragraph(doc, doc.createTextNode(text(p))));
      });
      const action = box.querySelector(".action");
      if (action && text(action) && box.getAttribute("href")) {
        const a = doc.createElement("a");
        a.setAttribute("href", box.getAttribute("href"));
        a.textContent = text(action);
        frag.append(paragraph(doc, a));
      }
      box.replaceWith(frag);
    });
  }
  function linkList(doc, list) {
    const ul = doc.createElement("ul");
    list.querySelectorAll(":scope > li").forEach((item) => {
      const li = doc.createElement("li");
      const a = item.querySelector(":scope > a[href]");
      if (a && linkText(a)) li.append(cleanLink(doc, a));
      item.querySelectorAll(":scope > ol, :scope > ul").forEach((sub) => {
        const nested = linkList(doc, sub);
        if (nested.children.length) li.append(nested);
      });
      if (li.childNodes.length) ul.append(li);
    });
    return ul;
  }
  function cleanDepartmentsCentersAfter(root) {
    const doc = root.ownerDocument;
    root.querySelectorAll("#filter .holder ol, #main-content > .list > ol").forEach((list) => {
      list.replaceWith(linkList(doc, list));
    });
    root.querySelectorAll("#main-content h2, #main-content h3").forEach((h) => {
      if (!h.children.length) h.textContent = h.textContent.replace(/\s+/g, " ").trim();
    });
  }
  var INTERNATIONAL_COLUMN = ".cmp-column-control__layoutType--LevelTwoNavigation .cmp-column-control__content-column";
  function isInternationalPage(payload) {
    return !!(payload && payload.template && payload.template.name === "international");
  }
  function cleanInternationalBefore(root) {
    root.querySelectorAll(`${INTERNATIONAL_COLUMN} > aside`).forEach((aside) => {
      aside.replaceWith(...aside.childNodes);
    });
    root.querySelectorAll(".cmp-luma-chat").forEach((el) => el.remove());
  }
  function cleanInternationalAfter(root) {
    const doc = root.ownerDocument;
    root.querySelectorAll(`${INTERNATIONAL_COLUMN} a.cmp-button`).forEach((a) => {
      if (!isDefaultContent(a) || !a.getAttribute("href") || !linkText(a)) return;
      const link = cleanLink(doc, a);
      let content = link;
      if (a.querySelector(".cmp-button__inner--type-pill")) {
        content = doc.createElement("strong");
        content.append(link);
      }
      const wrapper = a.closest(".cmp-link") || a;
      if (wrapper.closest("li, p")) wrapper.replaceWith(content);
      else wrapper.replaceWith(paragraph(doc, content));
    });
  }
  function transform(hookName, element, payload) {
    if (hookName === "beforeTransform") {
      if (isInternationalPage(payload)) cleanInternationalBefore(element);
      const head = element.ownerDocument && element.ownerDocument.head;
      if (head) {
        head.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"], meta[property="twitter:image"]').forEach((meta) => {
          const local = daMediaUrl(meta.getAttribute("content") || "");
          if (local) meta.setAttribute("content", local);
        });
      }
      recordYoutubeVideos(element);
      WebImporter.DOMUtils.remove(element, [
        // Global alert banners (empty ul in captured DOM)
        ".cmp-global-alerts",
        // Skip links (global and "Skip this Section" in alphabet facet)
        ".cmp-skip-to-main",
        // Feedback widget (Medallia/Kampyle)
        "#kampyleButtonContainer",
        ".kampyle_feedback-button",
        // Next.js route announcer
        "next-route-announcer",
        // Tracking / text-zoom iframes
        "iframe",
        // Decorative horizontal rule between sections (would create a stray section break)
        ".cmp-separator",
        // Decorative chevron icons (inline data-URI SVGs) inside A-Z letter links
        ".cmp-alphabet-facet .cmp-icon",
        // Breadcrumb: navigation chrome generated from the page path (diseases-conditions)
        ".cmp-breadcrumb",
        // Empty right-hand aside column (no text or media)
        "#main-content aside",
        // A-Z index pages: advertisement wrapper and the advertising disclaimer
        // ("Mayo Clinic does not endorse...", Advertising & Sponsorship links)
        // that sit next to the aside in the right-hand column
        ".cmp-advertisement__wrapper",
        "#advertising-disclaimer",
        // Some letter pages (e.g. O, S, X) render the disclaimer as a link list in its own container
        '.cmp-container--column-padding-3x:has(> .aem-GridColumn > .cmp-link-list-from-model a[href*="/about-this-site/advertising-sponsorship"])'
      ]);
      element.querySelectorAll(".cmp-azresults a.cmp-back-to-top").forEach((a) => {
        const wrapper = a.closest(".cmp-link") || a;
        wrapper.remove();
      });
      element.querySelectorAll(CONDITION_ROOT).forEach(cleanConditionBefore);
      if (isCarePage(payload)) element.querySelectorAll(careRootSelector(payload)).forEach(cleanCareBefore);
      if (isCareServicePage(payload)) element.querySelectorAll("#main-content").forEach(cleanCareServiceBefore);
      if (isLegacyAspPage(payload)) cleanFindADoctorBefore(element);
      if (isDepartmentsCentersPage(payload)) cleanDepartmentsCentersBefore(element);
    }
    if (hookName === "afterTransform") {
      WebImporter.DOMUtils.remove(element, [
        // Global header wrapper
        "div.aem-page.page > div:nth-child(1) > div:nth-child(2)",
        "#header__container",
        "header",
        // Footer
        "#cmp-footer",
        "footer",
        // Remaining nav and non-authorable elements
        "nav",
        "script",
        "style",
        "noscript",
        "link"
      ]);
      element.querySelectorAll('a[href^="/diseases-conditions/index"], a[href^="/diseases-conditions/search-results"]').forEach((a) => {
        const href = a.getAttribute("href");
        const absolute = `https://www.mayoclinic.org${href}`;
        a.setAttribute("href", absolute);
        if (a.textContent.trim() === href) a.textContent = absolute;
      });
      element.querySelectorAll('a[href*="/diseases-conditions/index?letter="]').forEach((a) => {
        const url = new URL(a.getAttribute("href"), "https://www.mayoclinic.org");
        if (url.hostname !== "www.mayoclinic.org" || url.pathname !== "/diseases-conditions/index") return;
        const letter = (url.searchParams.get("letter") || "").trim().toLowerCase();
        if (!letter) return;
        a.setAttribute("href", `/health-library/diseases-conditions/${/^[a-z]$/.test(letter) ? letter : "other"}`);
      });
      element.querySelectorAll(".cmp-azresults").forEach((az) => {
        const doc = az.ownerDocument;
        az.querySelectorAll('a[href^="/"]:not([href^="//"])').forEach((a) => {
          const href = a.getAttribute("href");
          const absolute = `https://www.mayoclinic.org${href}`;
          a.setAttribute("href", absolute);
          if (a.textContent.trim() === href) a.textContent = absolute;
        });
        az.querySelectorAll('a[href^="https://www.mayoclinic.org/diseases-conditions/"]').forEach((a) => {
          const local = migratedConditionPath(a.getAttribute("href"));
          if (local) a.setAttribute("href", local);
        });
        az.querySelectorAll(".cmp-result-letters").forEach((wrap) => {
          const h2 = wrap.querySelector("h2");
          if (!h2) {
            wrap.remove();
            return;
          }
          const heading = doc.createElement("h2");
          heading.textContent = h2.textContent.trim();
          wrap.replaceWith(heading);
        });
        az.querySelectorAll("ul > li").forEach((li) => {
          const cleanLink2 = (a2) => {
            const link = doc.createElement("a");
            link.setAttribute("href", a2.getAttribute("href"));
            link.textContent = a2.textContent.trim();
            return link;
          };
          const alias = li.querySelector(".cmp-results-with-primary-name");
          if (alias) {
            const label = alias.querySelector(".cmp-results-with-primary-name__label");
            const a2 = alias.querySelector("a[href]");
            li.textContent = "";
            if (label) li.append(doc.createTextNode(label.textContent.trim()));
            if (a2) {
              if (label) li.append(doc.createElement("br"));
              li.append(doc.createTextNode("See "), cleanLink2(a2));
            }
            return;
          }
          const a = li.querySelector("a[href]");
          if (a) {
            li.textContent = "";
            li.append(cleanLink2(a));
          }
        });
        az.querySelectorAll("ul, li").forEach((el) => {
          [...el.attributes].forEach((attr) => el.removeAttribute(attr.name));
        });
      });
      element.querySelectorAll(CONDITION_ROOT).forEach(cleanConditionAfter);
      if (isCareServicePage(payload)) element.querySelectorAll("#main-content").forEach(cleanCareServiceAfter);
      if (isFindADoctorPage(payload)) cleanFindADoctorAfter(element);
      if (isDepartmentsCentersPage(payload)) cleanDepartmentsCentersAfter(element);
      if (isInternationalPage(payload)) cleanInternationalAfter(element);
      if (isCarePage(payload)) element.querySelectorAll(careRootSelector(payload)).forEach(cleanCareAfter);
      element.querySelectorAll("img[src]").forEach((img) => {
        const local = daMediaUrl(img.getAttribute("src"));
        if (local) img.setAttribute("src", local);
      });
      element.querySelectorAll("[onclick], [data-track], [data-analytics], [data-cmp-data-layer]").forEach((el) => {
        el.removeAttribute("onclick");
        el.removeAttribute("data-track");
        el.removeAttribute("data-analytics");
        el.removeAttribute("data-cmp-data-layer");
      });
    }
  }

  // tools/importer/transformers/mayoclinic-sections.js
  var MARKER_ATTR = "data-excat-section-id";
  function findSectionElement(root, section) {
    const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
    for (const sel of selectors) {
      if (!sel) continue;
      try {
        const el = root.querySelector(sel);
        if (el) return el;
      } catch (e) {
      }
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const template = payload && payload.template;
    const sections = template && template.sections;
    if (!sections || sections.length < 2) return;
    const doc = element.ownerDocument || document;
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        const el = findSectionElement(element, section);
        if (!el) continue;
        const isFirst = i === 0;
        if (isFirst && !section.style) continue;
        const hr = doc.createElement("hr");
        if (section.style) hr.setAttribute(MARKER_ATTR, section.id);
        if (isFirst) hr.setAttribute("data-excat-first-section", "true");
        el.parentNode.insertBefore(hr, el);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`hr[${MARKER_ATTR}="${section.id}"]`);
        if (!marker) continue;
        let last = marker;
        let next = marker.nextSibling;
        while (next && !(next.nodeType === 1 && (next.tagName === "HR" || next.querySelector("hr")))) {
          last = next;
          next = next.nextSibling;
        }
        const meta = WebImporter.Blocks.createBlock(doc, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        if (last.nextSibling) {
          last.parentNode.insertBefore(meta, last.nextSibling);
        } else {
          last.parentNode.appendChild(meta);
        }
        if (marker.hasAttribute("data-excat-first-section")) {
          marker.remove();
        } else {
          marker.removeAttribute(MARKER_ATTR);
        }
      }
    }
  }

  // tools/importer/import-departments-centers.js
  var PAGE_TEMPLATE = {
    "name": "departments-centers",
    "urls": [
      "https://www.mayoclinic.org/departments-centers"
    ],
    "description": "Departments & Centers: A-Z directory of departments",
    "blocks": [
      {
        "name": "cards-action",
        "instances": [
          "#main > #secondary:has(> a.linkbox)"
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
        "id": "rc6",
        "name": "Page title",
        "selector": [
          "#main > .page-header"
        ],
        "style": null,
        "blocks": [],
        "defaultContent": [
          "#main > .page-header h1"
        ]
      },
      {
        "id": "rc7",
        "name": "Department directory with location filter and appointment promo",
        "selector": [
          "#main > #main-content:has(> #filter)"
        ],
        "style": "split",
        "blocks": [
          "cards-action"
        ],
        "defaultContent": [
          "#filter .holder > h2",
          "#filter .holder h3",
          "#filter .holder ol",
          "#main-content > .list > h2",
          "#main-content > .list > h3",
          "#main-content > .list > ol.navlist"
        ]
      },
      {
        "id": "rc8",
        "name": "Related information",
        "selector": [
          "#main > .placeHolder:has(> .related-links)"
        ],
        "style": null,
        "blocks": [],
        "defaultContent": [
          ".related-links h2",
          ".related-links p"
        ]
      },
      {
        "id": "rc11",
        "name": "Donation banner (navy)",
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
    "representativeUrl": "https://www.mayoclinic.org/departments-centers"
  };
  var parsers = {
    "cards-action": parse,
    "columns-banner": parse2
  };
  var sectionTransformers = [transform2];
  var fragmentTransformers = [];
  var lateTransformers = [...sectionTransformers, ...fragmentTransformers];
  var transformers = [transform, ...lateTransformers];
  var earlyTransformers = transformers.filter((fn) => !lateTransformers.includes(fn));
  var CATALOG = Boolean(PAGE_TEMPLATE.pageCleanup || PAGE_TEMPLATE.blocks.some((b) => b.pageInstances));
  function executeTransformers(hookName, element, payload, list = transformers) {
    var _a, _b;
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: ((_b = (_a = payload.params) == null ? void 0 : _a.targets) == null ? void 0 : _b.template) || PAGE_TEMPLATE });
    list.forEach((fn) => {
      try {
        fn(hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template, url) {
    const pageBlocks = [];
    const pageKey = (u) => {
      try {
        const { origin, pathname } = new URL(u);
        return `${origin}${pathname.replace(/\/$/, "")}`;
      } catch (e) {
        return u;
      }
    };
    const key = pageKey(url);
    const claim = (blockDef, selector) => {
      let matches = [];
      try {
        matches = document2.querySelectorAll(selector);
      } catch (e) {
        return;
      }
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
  function markPageTargets(payload) {
    const { document: document2, params } = payload;
    executeTransformers("beforeTransform", document2.body, payload, earlyTransformers);
    const blocks = findBlocksOnPage(document2, PAGE_TEMPLATE, params.originalURL).map(({ name, selector, element }, i) => {
      element.setAttribute("data-excat-block", String(i));
      return { name, selector };
    });
    const sections = (PAGE_TEMPLATE.sections || []).map((section, i) => {
      const target = (section.selector || []).map((s) => {
        try {
          return document2.querySelector(s);
        } catch (e) {
          return null;
        }
      }).find(Boolean);
      if (!target) return section;
      target.setAttribute("data-excat-section", String(i));
      return __spreadProps(__spreadValues({}, section), { selector: [`[data-excat-section="${i}"]`] });
    });
    params.targets = { blocks, template: __spreadProps(__spreadValues({}, PAGE_TEMPLATE), { sections }) };
  }
  var import_departments_centers_default = {
    preprocess: (payload) => {
      if (CATALOG) markPageTargets(payload);
    },
    transform: (payload) => {
      const { document: document2, url, params } = payload;
      const main = document2.body;
      params.fragments = [];
      if (!params.targets) markPageTargets(payload);
      const pageBlocks = params.targets.blocks.map((block, i) => __spreadProps(__spreadValues({}, block), { element: document2.querySelector(`[data-excat-block="${i}"]`) })).filter((block) => block.element);
      executeTransformers("beforeTransform", main, __spreadProps(__spreadValues({}, payload), { pageBlocks }), lateTransformers);
      pageBlocks.forEach((block) => {
        if (!main.contains(block.element)) return;
        const parser = parsers[block.name];
        if (!parser) return;
        try {
          parser(block.element, { document: document2, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      });
      executeTransformers("afterTransform", main, payload);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      params.fragments.forEach(({ element }) => {
        executeTransformers("afterTransform", element, payload, earlyTransformers);
        WebImporter.rules.transformBackgroundImages(element, document2);
        WebImporter.rules.adjustImageUrls(element, url, params.originalURL);
      });
      const parts = new URL(params.originalURL).pathname.split("/").filter(Boolean);
      const path = WebImporter.FileUtils.sanitizePath(`/care-at-mayo-clinic/${parts[parts.length - 1] || "index"}`);
      return [{
        element: main,
        path,
        report: { title: document2.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) }
      }, ...params.fragments];
    }
  };
  return __toCommonJS(import_departments_centers_exports);
})();
