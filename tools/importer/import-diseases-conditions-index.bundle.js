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

  // tools/importer/import-diseases-conditions-index.js
  var import_diseases_conditions_index_exports = {};
  __export(import_diseases_conditions_index_exports, {
    default: () => import_diseases_conditions_index_default
  });

  // tools/importer/parsers/columns-intro-index.js
  var SOURCE_ORIGIN = "https://www.mayoclinic.org";
  var LETTER_PAGES = "/health-library/diseases-conditions";
  function letterPagePath(href) {
    const url = new URL(href, SOURCE_ORIGIN);
    const letter = (url.searchParams.get("letter") || "").trim().toLowerCase();
    if (!/\/diseases-conditions\/index$/.test(url.pathname) || !letter) return url.href;
    return `${LETTER_PAGES}/${/^[a-z]$/.test(letter) ? letter : "other"}`;
  }
  function parse(element, { document: document2, params }) {
    const introCell = [];
    const h1 = element.querySelector(".cmp-title h1");
    if (h1) {
      const h = document2.createElement("h1");
      h.textContent = h1.textContent.trim();
      introCell.push(h);
    }
    element.querySelectorAll(".cmp-text__rich-content").forEach((rich) => {
      [...rich.children].forEach((child) => {
        if (child.textContent.trim()) introCell.push(child);
      });
    });
    if (element.querySelector(".cmp-search")) {
      const p = document2.createElement("p");
      const a = document2.createElement("a");
      a.setAttribute("href", `${SOURCE_ORIGIN}/diseases-conditions/search-results`);
      a.textContent = "Search diseases & conditions";
      p.append(a);
      introCell.push(p);
    }
    const indexCell = [];
    const facet = element.querySelector(".cmp-alphabet-facet") || element;
    const label = facet.querySelector("h2.cmp-alphabet-facet--label") || facet.querySelector("h2");
    if (label) {
      const h = document2.createElement("h2");
      h.textContent = label.textContent.trim();
      indexCell.push(h);
    }
    const ul = document2.createElement("ul");
    facet.querySelectorAll("li.cmp-alphabet-facet--letter a[href]").forEach((link) => {
      const textEl = link.querySelector(".cmp-button__text");
      const text = (textEl || link).textContent.trim();
      if (!text) return;
      const li = document2.createElement("li");
      const a = document2.createElement("a");
      a.setAttribute("href", letterPagePath(link.getAttribute("href")));
      a.textContent = text;
      li.append(a);
      ul.append(li);
    });
    if (ul.children.length) indexCell.push(ul);
    const cells = [[introCell, indexCell]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-intro-index", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-banner.js
  function parse2(element, { document: document2, params }) {
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
    "https://www.mayoclinic.org/diseases-conditions/alpha-1-antitrypsin-deficiency/symptoms-causes/syc-20588790",
    "https://www.mayoclinic.org/diseases-conditions/atrial-fibrillation/symptoms-causes/syc-20350624",
    "https://www.mayoclinic.org/diseases-conditions/baby-acne/symptoms-causes/syc-20369880",
    "https://www.mayoclinic.org/diseases-conditions/back-pain/symptoms-causes/syc-20369906",
    "https://www.mayoclinic.org/diseases-conditions/bells-palsy/symptoms-causes/syc-20370028",
    "https://www.mayoclinic.org/diseases-conditions/c-difficile/symptoms-causes/syc-20351691",
    "https://www.mayoclinic.org/diseases-conditions/canker-sore/symptoms-causes/syc-20370615",
    "https://www.mayoclinic.org/diseases-conditions/common-warts/symptoms-causes/syc-20371125",
    "https://www.mayoclinic.org/diseases-conditions/dandruff/symptoms-causes/syc-20353850",
    "https://www.mayoclinic.org/diseases-conditions/digeorge-syndrome/symptoms-causes/syc-20353543",
    "https://www.mayoclinic.org/diseases-conditions/dry-macular-degeneration/symptoms-causes/syc-20350375",
    "https://www.mayoclinic.org/diseases-conditions/dry-mouth/symptoms-causes/syc-20356048",
    "https://www.mayoclinic.org/diseases-conditions/dry-skin/symptoms-causes/syc-20353885",
    "https://www.mayoclinic.org/diseases-conditions/e-coli/symptoms-causes/syc-20372058",
    "https://www.mayoclinic.org/diseases-conditions/ear-infections/symptoms-causes/syc-20351616",
    "https://www.mayoclinic.org/diseases-conditions/fatty-liver-disease-masld/symptoms-causes/syc-20354567",
    "https://www.mayoclinic.org/diseases-conditions/galactorrhea/symptoms-causes/syc-20350431",
    "https://www.mayoclinic.org/diseases-conditions/generalized-anxiety-disorder/symptoms-causes/syc-20360803",
    "https://www.mayoclinic.org/diseases-conditions/genital-warts/symptoms-causes/syc-20355234",
    "https://www.mayoclinic.org/diseases-conditions/h-pylori/symptoms-causes/syc-20356171",
    "https://www.mayoclinic.org/diseases-conditions/hirsutism/symptoms-causes/syc-20354935",
    "https://www.mayoclinic.org/diseases-conditions/inflammatory-bowel-disease/symptoms-causes/syc-20353315",
    "https://www.mayoclinic.org/diseases-conditions/irritable-bowel-syndrome/symptoms-causes/syc-20360016",
    "https://www.mayoclinic.org/diseases-conditions/jaw-tumors-cysts/symptoms-causes/syc-20350973",
    "https://www.mayoclinic.org/diseases-conditions/jellyfish-stings/symptoms-causes/syc-20353284",
    "https://www.mayoclinic.org/diseases-conditions/kaposis-sarcoma/symptoms-causes/syc-20577303",
    "https://www.mayoclinic.org/diseases-conditions/kawasaki-disease/symptoms-causes/syc-20354598",
    "https://www.mayoclinic.org/diseases-conditions/lactose-intolerance/symptoms-causes/syc-20374232",
    "https://www.mayoclinic.org/diseases-conditions/mastitis/symptoms-causes/syc-20374829",
    "https://www.mayoclinic.org/diseases-conditions/nail-fungus/symptoms-causes/syc-20353294",
    "https://www.mayoclinic.org/diseases-conditions/narcolepsy/symptoms-causes/syc-20375497",
    "https://www.mayoclinic.org/diseases-conditions/osteoarthritis/symptoms-causes/syc-20351925",
    "https://www.mayoclinic.org/diseases-conditions/overactive-bladder/symptoms-causes/syc-20355715",
    "https://www.mayoclinic.org/diseases-conditions/peptic-ulcer/symptoms-causes/syc-20354223",
    "https://www.mayoclinic.org/diseases-conditions/peripheral-artery-disease/symptoms-causes/syc-20350557",
    "https://www.mayoclinic.org/diseases-conditions/plague/symptoms-causes/syc-20351291",
    "https://www.mayoclinic.org/diseases-conditions/popliteal-artery-entrapment/symptoms-causes/syc-20465211",
    "https://www.mayoclinic.org/diseases-conditions/pseudomembranous-colitis/symptoms-causes/syc-20351434",
    "https://www.mayoclinic.org/diseases-conditions/rabies/symptoms-causes/syc-20351821",
    "https://www.mayoclinic.org/diseases-conditions/rheumatoid-arthritis/symptoms-causes/syc-20353648",
    "https://www.mayoclinic.org/diseases-conditions/sacral-dimple/symptoms-causes/syc-20377353",
    "https://www.mayoclinic.org/diseases-conditions/sacroiliitis/symptoms-causes/syc-20350747",
    "https://www.mayoclinic.org/diseases-conditions/swine-flu/symptoms-causes/syc-20378103",
    "https://www.mayoclinic.org/diseases-conditions/tachycardia/symptoms-causes/syc-20355127",
    "https://www.mayoclinic.org/diseases-conditions/takayasus-arteritis/symptoms-causes/syc-20351335",
    "https://www.mayoclinic.org/diseases-conditions/vaginal-agenesis/symptoms-causes/syc-20355737",
    "https://www.mayoclinic.org/diseases-conditions/vaginal-atrophy/symptoms-causes/syc-20352288",
    "https://www.mayoclinic.org/diseases-conditions/wet-macular-degeneration/symptoms-causes/syc-20351107",
    "https://www.mayoclinic.org/diseases-conditions/yeast-infection/symptoms-causes/syc-20378999",
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
  function daMediaUrl(src) {
    let url;
    try {
      url = new URL(src, "https://www.mayoclinic.org");
    } catch (e) {
      return null;
    }
    if (url.hostname !== "www.mayoclinic.org") return null;
    const name = decodeURIComponent(url.pathname.split("/").pop() || "").toLowerCase().replace(/[^a-z0-9._-]/g, "-");
    return name ? `${DA_MEDIA}/${name}` : null;
  }
  function transform(hookName, element, payload) {
    if (hookName === "beforeTransform") {
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
        while (next && !(next.nodeType === 1 && next.tagName === "HR")) {
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

  // tools/importer/import-diseases-conditions-index.js
  var PAGE_TEMPLATE = {
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
  var parsers = {
    "columns-intro-index": parse,
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
  var import_diseases_conditions_index_default = {
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
      const letter = (new URL(params.originalURL).searchParams.get("letter") || "").trim().toLowerCase();
      const slug = /^[a-z]$/.test(letter) ? letter : "other";
      const path = WebImporter.FileUtils.sanitizePath(`/health-library/diseases-conditions/${slug}`);
      return [{
        element: main,
        path,
        report: { title: document2.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) }
      }, ...params.fragments];
    }
  };
  return __toCommonJS(import_diseases_conditions_index_exports);
})();
