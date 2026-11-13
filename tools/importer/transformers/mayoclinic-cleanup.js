/* eslint-disable */
/* global WebImporter */

// <migrated-conditions> (generated from tools/importer/urls-condition.txt; keep self-contained)
const MIGRATED_CONDITION_URLS = new Set([
  'https://www.mayoclinic.org/diseases-conditions/alpha-1-antitrypsin-deficiency/symptoms-causes/syc-20588790',
  'https://www.mayoclinic.org/diseases-conditions/atrial-fibrillation/symptoms-causes/syc-20350624',
  'https://www.mayoclinic.org/diseases-conditions/baby-acne/symptoms-causes/syc-20369880',
  'https://www.mayoclinic.org/diseases-conditions/back-pain/symptoms-causes/syc-20369906',
  'https://www.mayoclinic.org/diseases-conditions/bells-palsy/symptoms-causes/syc-20370028',
  'https://www.mayoclinic.org/diseases-conditions/c-difficile/symptoms-causes/syc-20351691',
  'https://www.mayoclinic.org/diseases-conditions/canker-sore/symptoms-causes/syc-20370615',
  'https://www.mayoclinic.org/diseases-conditions/common-warts/symptoms-causes/syc-20371125',
  'https://www.mayoclinic.org/diseases-conditions/dandruff/symptoms-causes/syc-20353850',
  'https://www.mayoclinic.org/diseases-conditions/digeorge-syndrome/symptoms-causes/syc-20353543',
  'https://www.mayoclinic.org/diseases-conditions/dry-macular-degeneration/symptoms-causes/syc-20350375',
  'https://www.mayoclinic.org/diseases-conditions/dry-mouth/symptoms-causes/syc-20356048',
  'https://www.mayoclinic.org/diseases-conditions/dry-skin/symptoms-causes/syc-20353885',
  'https://www.mayoclinic.org/diseases-conditions/e-coli/symptoms-causes/syc-20372058',
  'https://www.mayoclinic.org/diseases-conditions/ear-infections/symptoms-causes/syc-20351616',
  'https://www.mayoclinic.org/diseases-conditions/fatty-liver-disease-masld/symptoms-causes/syc-20354567',
  'https://www.mayoclinic.org/diseases-conditions/galactorrhea/symptoms-causes/syc-20350431',
  'https://www.mayoclinic.org/diseases-conditions/generalized-anxiety-disorder/symptoms-causes/syc-20360803',
  'https://www.mayoclinic.org/diseases-conditions/genital-warts/symptoms-causes/syc-20355234',
  'https://www.mayoclinic.org/diseases-conditions/h-pylori/symptoms-causes/syc-20356171',
  'https://www.mayoclinic.org/diseases-conditions/hirsutism/symptoms-causes/syc-20354935',
  'https://www.mayoclinic.org/diseases-conditions/inflammatory-bowel-disease/symptoms-causes/syc-20353315',
  'https://www.mayoclinic.org/diseases-conditions/irritable-bowel-syndrome/symptoms-causes/syc-20360016',
  'https://www.mayoclinic.org/diseases-conditions/jaw-tumors-cysts/symptoms-causes/syc-20350973',
  'https://www.mayoclinic.org/diseases-conditions/jellyfish-stings/symptoms-causes/syc-20353284',
  'https://www.mayoclinic.org/diseases-conditions/kaposis-sarcoma/symptoms-causes/syc-20577303',
  'https://www.mayoclinic.org/diseases-conditions/kawasaki-disease/symptoms-causes/syc-20354598',
  'https://www.mayoclinic.org/diseases-conditions/lactose-intolerance/symptoms-causes/syc-20374232',
  'https://www.mayoclinic.org/diseases-conditions/mastitis/symptoms-causes/syc-20374829',
  'https://www.mayoclinic.org/diseases-conditions/nail-fungus/symptoms-causes/syc-20353294',
  'https://www.mayoclinic.org/diseases-conditions/narcolepsy/symptoms-causes/syc-20375497',
  'https://www.mayoclinic.org/diseases-conditions/osteoarthritis/symptoms-causes/syc-20351925',
  'https://www.mayoclinic.org/diseases-conditions/overactive-bladder/symptoms-causes/syc-20355715',
  'https://www.mayoclinic.org/diseases-conditions/peptic-ulcer/symptoms-causes/syc-20354223',
  'https://www.mayoclinic.org/diseases-conditions/peripheral-artery-disease/symptoms-causes/syc-20350557',
  'https://www.mayoclinic.org/diseases-conditions/plague/symptoms-causes/syc-20351291',
  'https://www.mayoclinic.org/diseases-conditions/popliteal-artery-entrapment/symptoms-causes/syc-20465211',
  'https://www.mayoclinic.org/diseases-conditions/pseudomembranous-colitis/symptoms-causes/syc-20351434',
  'https://www.mayoclinic.org/diseases-conditions/rabies/symptoms-causes/syc-20351821',
  'https://www.mayoclinic.org/diseases-conditions/rheumatoid-arthritis/symptoms-causes/syc-20353648',
  'https://www.mayoclinic.org/diseases-conditions/sacral-dimple/symptoms-causes/syc-20377353',
  'https://www.mayoclinic.org/diseases-conditions/sacroiliitis/symptoms-causes/syc-20350747',
  'https://www.mayoclinic.org/diseases-conditions/swine-flu/symptoms-causes/syc-20378103',
  'https://www.mayoclinic.org/diseases-conditions/tachycardia/symptoms-causes/syc-20355127',
  'https://www.mayoclinic.org/diseases-conditions/takayasus-arteritis/symptoms-causes/syc-20351335',
  'https://www.mayoclinic.org/diseases-conditions/vaginal-agenesis/symptoms-causes/syc-20355737',
  'https://www.mayoclinic.org/diseases-conditions/vaginal-atrophy/symptoms-causes/syc-20352288',
  'https://www.mayoclinic.org/diseases-conditions/wet-macular-degeneration/symptoms-causes/syc-20351107',
  'https://www.mayoclinic.org/diseases-conditions/yeast-infection/symptoms-causes/syc-20378999',
  'https://www.mayoclinic.org/diseases-conditions/zenkers-diverticulum/symptoms-causes/syc-20568839',
  'https://www.mayoclinic.org/diseases-conditions/zollinger-ellison-syndrome/symptoms-causes/syc-20379042',
]);
// </migrated-conditions>

/**
 * Local path for a condition page already migrated to this site, or null.
 * /diseases-conditions/<slug>/symptoms-causes/syc-... -> /health-library/diseases-conditions/<slug>/symptoms-causes
 * @param {string} href absolute www.mayoclinic.org URL
 */
function migratedConditionPath(href) {
  let url;
  try { url = new URL(href, 'https://www.mayoclinic.org'); } catch (e) { return null; }
  if (!MIGRATED_CONDITION_URLS.has(`https://www.mayoclinic.org${url.pathname.replace(/\/$/, '')}`)) return null;
  const parts = url.pathname.split('/').filter(Boolean);
  return `/health-library/diseases-conditions/${parts[1]}/${parts[2]}`;
}

/**
 * Mayo Clinic cleanup transformer.
 * Removes non-authorable chrome: global header, footer, alerts, skip links,
 * feedback/tracking widgets, iframes and framework artifacts.
 * Selectors are taken from migration-work/cleaned.html.
 */
// Condition ("Symptoms & causes") pages: everything condition-specific below is
// scoped to this layout element, which no home / diseases-conditions / A-Z page has.
const CONDITION_ROOT = '.cmp-column-control__layoutType--ThreeColumnWithL2AndAd';
const MAYO_ORIGIN = 'https://www.mayoclinic.org';

// True when nothing authorable is left inside el (no text, no media, no block table)
function isEmpty(el) {
  return !el.textContent.trim() && !el.querySelector('img, picture, video, iframe, table, hr');
}

// Remove el, then every ancestor it leaves empty, stopping at (and keeping) stopAt
function removeWithEmptyWrappers(el, stopAt) {
  let parent = el.parentElement;
  el.remove();
  while (parent && parent !== stopAt && stopAt.contains(parent) && isEmpty(parent)) {
    const next = parent.parentElement;
    parent.remove();
    parent = next;
  }
}

// Same slug as the Edge Delivery html pipeline gives headings (github-slugger),
// e.g. "When to see a doctor" -> "when-to-see-a-doctor", "Diseases & Conditions" -> "diseases--conditions"
function slugify(text) {
  return text.trim().toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s/g, '-');
}

// Condition page YouTube video: the source renders it as an iframe inside .cmp-video-from-model.
// All iframes are removed in beforeTransform (before parsers run), so the embed URL is first
// recorded on the video container as data-youtube-src (canonical https://www.youtube.com/watch?v=ID)
// for the video-inline parser to read.
function recordYoutubeVideos(element) {
  element.querySelectorAll('.cmp-video-from-model').forEach((video) => {
    if (video.hasAttribute('data-youtube-src')) return;
    const iframe = video.querySelector('iframe[src*="youtube"], iframe[id^="youtube-"]');
    if (!iframe) return;
    const src = iframe.getAttribute('src') || '';
    const fromSrc = src.match(/youtube(?:-nocookie)?\.com\/embed\/([\w-]{6,})/);
    const fromId = (iframe.id || '').match(/^youtube-([\w-]{6,}?)(?:-r\d+)?$/);
    const id = (fromSrc && fromSrc[1]) || (fromId && fromId[1]);
    if (id) video.setAttribute('data-youtube-src', `https://www.youtube.com/watch?v=${id}`);
  });
}

function cleanConditionBefore(root) {
  const doc = root.ownerDocument;

  // Right ad rail: ad slots, advertising disclaimer, "Mayo Clinic Press" promo links
  root.querySelectorAll('.cmp-column-control__ad-column').forEach((el) => el.remove());

  const column = root.querySelector('.cmp-column-control__content-column');
  if (column) {
    [
      // Duplicate section nav at the end of the article (mobile pattern; the left nav is the block)
      '.cmp-level-two-navigation',
      // Newsletter sign-up card (e-mail form)
      '.cmp-news-letter-signup-from-model',
      // Print button (links to the ?p=1 print rendition)
      '.cmp-print-button',
      // Internal content ID (CON-...)
      '.cmp-poc-id',
      // Empty placeholders
      '#empty-dynamic-related-content',
      // In-article mobile ad slot and its separators
      '#cmp-mobile-advertisement__wrapped-content-container',
      '.cmp-mobile-advertisement',
      // Decorative separators inside the related-content and news lists
      '.cmp-dynamic-related-content .cmp-separator',
      '.cmp-dynamic-related-content hr',
      '.cmp-news-and-patient-stories .cmp-separator',
      '.cmp-news-and-patient-stories hr',
    ].forEach((sel) => {
      column.querySelectorAll(sel).forEach((el) => {
        if (!el.isConnected) return;
        const target = el.closest('.cmp-link') && sel === '.cmp-print-button' ? el.closest('.cmp-link') : el;
        removeWithEmptyWrappers(target, column);
      });
    });
  }

  // Decorative icons (inline SVG and data-URI chevrons/arrows/play icons) in the article and
  // blocks: removed before parsers run so they never read an icon as a thumbnail or image
  root.querySelectorAll('.cmp-icon, svg').forEach((el) => el.remove());

  // Lazy images: make sure src is the real image URL (data-src / srcset)
  root.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src') || '';
    const placeholder = !src || src.startsWith('data:') || /blank|placeholder|spacer/i.test(src);
    const lazy = img.getAttribute('data-src') || img.getAttribute('data-lazy-src') || img.getAttribute('data-original');
    const srcset = img.getAttribute('srcset') || img.getAttribute('data-srcset') || '';
    if (lazy && placeholder) {
      img.setAttribute('src', lazy);
    } else if (placeholder && srcset) {
      const first = srcset.split(',')[0].trim().split(/\s+/)[0];
      if (first) img.setAttribute('src', first);
    }
    ['data-src', 'data-lazy-src', 'data-original', 'data-srcset', 'srcset', 'sizes'].forEach((a) => img.removeAttribute(a));
  });

  // H1: "Atrial fibrillation<div class=second-title>Symptoms and causes</div>" -> "Atrial fibrillation<br>Symptoms and causes"
  root.querySelectorAll('.cmp-titlewithparent h1').forEach((h1) => {
    const second = h1.querySelector('.second-title');
    const secondText = second ? second.textContent.trim() : '';
    if (second) second.remove();
    const firstText = h1.textContent.replace(/\s+/g, ' ').trim();
    const heading = doc.createElement('h1');
    heading.append(doc.createTextNode(firstText));
    if (secondText) heading.append(doc.createElement('br'), doc.createTextNode(secondText));
    h1.replaceWith(heading);
  });
}

// Plain-text label of a Mayo button/link component (drops icon spans)
function linkText(a) {
  const label = a.querySelector('.cmp-button__text') || a;
  return label.textContent.replace(/\s+/g, ' ').trim();
}

function cleanLink(doc, a) {
  const link = doc.createElement('a');
  link.setAttribute('href', a.getAttribute('href'));
  link.textContent = linkText(a);
  return link;
}

function paragraph(doc, ...children) {
  const p = doc.createElement('p');
  p.append(...children);
  return p;
}

// Default content (not inside a block table) of the condition article
function isDefaultContent(el) {
  return !el.closest('table');
}

function cleanConditionAfter(root) {
  const doc = root.ownerDocument;
  const each = (sel, fn) => [...root.querySelectorAll(sel)].filter(isDefaultContent).forEach(fn);

  // Unwrap article markup wrappers (DITA-style conbodydiv / section)
  each('conbodydiv, section', (el) => el.replaceWith(...el.childNodes));

  // "On this page": label paragraph + list of anchor links. Anchors point at the heading slug
  // Edge Delivery generates (source ids like #when-to-seek-care differ from the heading text).
  each('.cmp-anchor-nav', (nav) => {
    const frag = doc.createDocumentFragment();
    const label = nav.querySelector('.cmp-title, h2');
    if (label && label.textContent.trim()) frag.append(paragraph(doc, doc.createTextNode(label.textContent.trim())));
    const ul = doc.createElement('ul');
    nav.querySelectorAll('a[href]').forEach((a) => {
      const link = cleanLink(doc, a);
      const href = a.getAttribute('href');
      if (href.startsWith('#')) {
        let target = null;
        try { target = root.querySelector(`[id="${href.slice(1).replace(/"/g, '\\"')}"]`); } catch (e) { /* keep href */ }
        if (target && target.textContent.trim()) link.setAttribute('href', `#${slugify(target.textContent)}`);
      }
      const li = doc.createElement('li');
      li.append(link);
      ul.append(li);
    });
    if (ul.children.length) frag.append(ul);
    nav.replaceWith(frag);
  });

  // "Top ranked" text card: heading, description, link
  each('.cmp-text-card', (card) => {
    const frag = doc.createDocumentFragment();
    const title = card.querySelector('.cmp-text-card__title, h2, h3');
    if (title && title.textContent.trim()) {
      const h = doc.createElement(title.tagName.toLowerCase().match(/^h[1-6]$/) ? title.tagName.toLowerCase() : 'h2');
      h.textContent = title.textContent.trim();
      frag.append(h);
    }
    const desc = card.querySelector('.cmp-text-card__description');
    if (desc) frag.append(...desc.childNodes);
    card.querySelectorAll('.cmp-text-card__buttons a[href]').forEach((a) => frag.append(paragraph(doc, cleanLink(doc, a))));
    card.replaceWith(frag);
  });

  // Illustrations: image, bold title paragraph, caption paragraph(s)
  each('.cmp-image-with-title', (fig) => {
    const frag = doc.createDocumentFragment();
    const img = fig.querySelector('picture') || fig.querySelector('img');
    if (img) frag.append(paragraph(doc, img));
    const title = fig.querySelector('.cmp-image-with-title__title-wrapper .cmp-title');
    if (title && title.textContent.trim()) {
      const strong = doc.createElement('strong');
      strong.textContent = title.textContent.trim();
      frag.append(paragraph(doc, strong));
    }
    const caption = fig.querySelector('.cmp-text__rich-content');
    if (caption) {
      const blocks = caption.querySelectorAll(':scope > p, :scope > ul, :scope > ol');
      if (blocks.length) frag.append(...blocks);
      else if (caption.textContent.trim()) frag.append(paragraph(doc, doc.createTextNode(caption.textContent.trim())));
    }
    fig.replaceWith(frag);
  });

  // Definition lists (e.g. "Symptoms in children and teenagers"): dt -> h3, dd -> its content
  each('dl', (dl) => {
    const frag = doc.createDocumentFragment();
    [...dl.children].forEach((child) => {
      if (child.tagName === 'DT') {
        const h3 = doc.createElement('h3');
        h3.textContent = child.textContent.trim();
        frag.append(h3);
      } else if (child.tagName === 'DD') {
        frag.append(...child.childNodes);
      }
    });
    dl.replaceWith(frag);
  });

  // Byline ("By Mayo Clinic Staff") and date
  each('a.cmp-health-information-topic__byline', (a) => (a.closest('.cmp-link') || a).replaceWith(paragraph(doc, cleanLink(doc, a))));
  each('.cmp-health-information-topic__date', (el) => el.replaceWith(paragraph(doc, doc.createTextNode(el.textContent.trim()))));

  // Button links ("Request an appointment" pills are primary buttons: <strong><a>)
  each('a.cmp-button', (a) => {
    if (!a.isConnected || !a.getAttribute('href')) return;
    const link = cleanLink(doc, a);
    const primary = a.matches('.cmp-request-appointment-button') || !!a.querySelector('.cmp-button__inner--type-pill');
    let content = link;
    if (primary) {
      content = doc.createElement('strong');
      content.append(link);
    }
    const wrapper = a.closest('.cmp-link') || a;
    if (wrapper.closest('li, p')) wrapper.replaceWith(content);
    else wrapper.replaceWith(paragraph(doc, content));
  });

  // Headings: plain text, no component classes or source ids
  each('h1, h2, h3, h4, h5, h6', (h) => {
    [...h.attributes].forEach((attr) => h.removeAttribute(attr.name));
  });

  // Links to pages that are not on this site point back to mayoclinic.org
  // (links already rewritten to /health-library/... stay relative)
  root.querySelectorAll('a[href^="/"]:not([href^="//"])').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === '/health-library' || href.startsWith('/health-library/')) return;
    const absolute = `${MAYO_ORIGIN}${href}`;
    a.setAttribute('href', absolute);
    if (a.textContent.trim() === href) a.textContent = absolute;
  });
}

// Images on www.mayoclinic.org can't be fetched by Edge Delivery (bot protection), so they are
// hosted in DA under media/mayoclinic/ (same file name, lower-cased) and referenced from there.
// New images found by an import must be downloaded and uploaded to that folder before publishing.
const DA_MEDIA = 'https://content.da.live/charronadobe/mayo-rdda/media/mayoclinic';

function daMediaUrl(src) {
  let url;
  try { url = new URL(src, 'https://www.mayoclinic.org'); } catch (e) { return null; }
  if (url.hostname !== 'www.mayoclinic.org') return null;
  const name = decodeURIComponent(url.pathname.split('/').pop() || '').toLowerCase().replace(/[^a-z0-9._-]/g, '-');
  return name ? `${DA_MEDIA}/${name}` : null;
}

export default function transform(hookName, element, payload) {
  if (hookName === 'beforeTransform') {
    // Share image in the page metadata (read from these tags by createMetadata)
    const head = element.ownerDocument && element.ownerDocument.head;
    if (head) {
      head.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"], meta[property="twitter:image"]').forEach((meta) => {
        const local = daMediaUrl(meta.getAttribute('content') || '');
        if (local) meta.setAttribute('content', local);
      });
    }

    // Condition pages: keep the YouTube URL before the iframe is removed below
    recordYoutubeVideos(element);

    // Elements that could interfere with block matching
    WebImporter.DOMUtils.remove(element, [
      // Global alert banners (empty ul in captured DOM)
      '.cmp-global-alerts',
      // Skip links (global and "Skip this Section" in alphabet facet)
      '.cmp-skip-to-main',
      // Feedback widget (Medallia/Kampyle)
      '#kampyleButtonContainer',
      '.kampyle_feedback-button',
      // Next.js route announcer
      'next-route-announcer',
      // Tracking / text-zoom iframes
      'iframe',
      // Decorative horizontal rule between sections (would create a stray section break)
      '.cmp-separator',
      // Decorative chevron icons (inline data-URI SVGs) inside A-Z letter links
      '.cmp-alphabet-facet .cmp-icon',
      // Breadcrumb: navigation chrome generated from the page path (diseases-conditions)
      '.cmp-breadcrumb',
      // Empty right-hand aside column (no text or media)
      '#main-content aside',
      // A-Z index pages: advertisement wrapper and the advertising disclaimer
      // ("Mayo Clinic does not endorse...", Advertising & Sponsorship links)
      // that sit next to the aside in the right-hand column
      '.cmp-advertisement__wrapper',
      '#advertising-disclaimer',
      // Some letter pages (e.g. O, S, X) render the disclaimer as a link list in its own container
      '.cmp-container--column-padding-3x:has(> .aem-GridColumn > .cmp-link-list-from-model a[href*="/about-this-site/advertising-sponsorship"])',
    ]);

    // A-Z index pages: "Back to top" links after each letter group
    element.querySelectorAll('.cmp-azresults a.cmp-back-to-top').forEach((a) => {
      const wrapper = a.closest('.cmp-link') || a;
      wrapper.remove();
    });

    // Condition pages: ad rail, duplicate nav, newsletter, print, content ID, lazy images, H1
    element.querySelectorAll(CONDITION_ROOT).forEach(cleanConditionBefore);
  }

  if (hookName === 'afterTransform') {
    WebImporter.DOMUtils.remove(element, [
      // Global header wrapper
      'div.aem-page.page > div:nth-child(1) > div:nth-child(2)',
      '#header__container',
      'header',
      // Footer
      '#cmp-footer',
      'footer',
      // Remaining nav and non-authorable elements
      'nav',
      'script',
      'style',
      'noscript',
      'link',
    ]);

    // The A-Z index and search results pages only exist on mayoclinic.org:
    // make links to them absolute (e.g. the homepage letter list)
    element.querySelectorAll('a[href^="/diseases-conditions/index"], a[href^="/diseases-conditions/search-results"]').forEach((a) => {
      const href = a.getAttribute('href');
      const absolute = `https://www.mayoclinic.org${href}`;
      a.setAttribute('href', absolute);
      if (a.textContent.trim() === href) a.textContent = absolute;
    });

    // A-Z letter links point to the migrated letter pages on this site
    // (/diseases-conditions/index?letter=A -> /health-library/diseases-conditions/a, '#' -> other)
    element.querySelectorAll('a[href*="/diseases-conditions/index?letter="]').forEach((a) => {
      const url = new URL(a.getAttribute('href'), 'https://www.mayoclinic.org');
      if (url.hostname !== 'www.mayoclinic.org' || url.pathname !== '/diseases-conditions/index') return;
      const letter = (url.searchParams.get('letter') || '').trim().toLowerCase();
      if (!letter) return;
      a.setAttribute('href', `/health-library/diseases-conditions/${/^[a-z]$/.test(letter) ? letter : 'other'}`);
    });

    // A-Z index pages: normalize the condition list (.cmp-azresults) into
    // clean default content: bare <h2> letter headings followed by <ul> lists.
    element.querySelectorAll('.cmp-azresults').forEach((az) => {
      const doc = az.ownerDocument;

      // Condition pages only exist on mayoclinic.org: absolutize root-relative links
      az.querySelectorAll('a[href^="/"]:not([href^="//"])').forEach((a) => {
        const href = a.getAttribute('href');
        const absolute = `https://www.mayoclinic.org${href}`;
        a.setAttribute('href', absolute);
        if (a.textContent.trim() === href) a.textContent = absolute;
      });

      // Condition pages already migrated to this site (tools/importer/migrated-pages.js)
      // link to the migrated copy; the rest stay on www.mayoclinic.org
      az.querySelectorAll('a[href^="https://www.mayoclinic.org/diseases-conditions/"]').forEach((a) => {
        const local = migratedConditionPath(a.getAttribute('href'));
        if (local) a.setAttribute('href', local);
      });

      // Letter headings: unwrap div.cmp-result-letters > h2
      az.querySelectorAll('.cmp-result-letters').forEach((wrap) => {
        const h2 = wrap.querySelector('h2');
        if (!h2) { wrap.remove(); return; }
        const heading = doc.createElement('h2');
        heading.textContent = h2.textContent.trim();
        wrap.replaceWith(heading);
      });

      az.querySelectorAll('ul > li').forEach((li) => {
        const cleanLink = (a) => {
          const link = doc.createElement('a');
          link.setAttribute('href', a.getAttribute('href'));
          link.textContent = a.textContent.trim();
          return link;
        };
        const alias = li.querySelector('.cmp-results-with-primary-name');
        if (alias) {
          // Alias item: label <br> See <a>
          const label = alias.querySelector('.cmp-results-with-primary-name__label');
          const a = alias.querySelector('a[href]');
          li.textContent = '';
          if (label) li.append(doc.createTextNode(label.textContent.trim()));
          if (a) {
            if (label) li.append(doc.createElement('br'));
            li.append(doc.createTextNode('See '), cleanLink(a));
          }
          return;
        }
        // Primary item: just the link to the condition
        const a = li.querySelector('a[href]');
        if (a) {
          li.textContent = '';
          li.append(cleanLink(a));
        }
      });

      // Strip list attributes
      az.querySelectorAll('ul, li').forEach((el) => {
        [...el.attributes].forEach((attr) => el.removeAttribute(attr.name));
      });
    });

    // Condition pages: article default content and absolute mayoclinic.org links
    element.querySelectorAll(CONDITION_ROOT).forEach(cleanConditionAfter);

    // www.mayoclinic.org images -> DA-hosted copies (see daMediaUrl)
    element.querySelectorAll('img[src]').forEach((img) => {
      const local = daMediaUrl(img.getAttribute('src'));
      if (local) img.setAttribute('src', local);
    });

    // Strip tracking / framework attributes
    element.querySelectorAll('[onclick], [data-track], [data-analytics], [data-cmp-data-layer]').forEach((el) => {
      el.removeAttribute('onclick');
      el.removeAttribute('data-track');
      el.removeAttribute('data-analytics');
      el.removeAttribute('data-cmp-data-layer');
    });
  }
}
