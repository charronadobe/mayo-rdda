/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-action.
 * Source: .cmp-container--container-padding-8x:has(.cmp-action-card-robust)
 * One row per tile, two cells. Cell order sets the tile layout:
 *   .cmp-action-card-robust                 -> (empty) | H2, paragraph, CTA
 *   .cmp-action-card-robust-with-image      -> H2, paragraph, CTA | image
 *   .cmp-action-card-with-background-image  -> image | H2, paragraph, CTA
 * Notes on the source:
 *  - The decorative <mc-icon> pictograms and the chevron icon inside each CTA
 *    are dropped; only the CTA text is kept.
 *  - The four card classes are distinct tokens (no nesting), so the comma
 *    selector returns each tile once, in document order.
 * Care at Mayo Clinic pages (column-control containers of tiles):
 *   .cmp-action-card-simple                 -> (empty) | linked heading, paragraph
 *     The title itself is the link; its source level is kept (H3 on About /
 *     Patient-Centered Care, H4 on Contact). Icons are dropped.
 *   .cmp-action-card-robust on Billing      -> (empty) | H2, paragraph or bulleted
 *     link list, CTA (when present). Lists are kept as authored.
 * Find a Doctor page (legacy markup; the cleanup transformer merges the two tile columns):
 *   a.linkbox (the whole tile is the link)  -> (empty) | H2, paragraph, CTA
 *     The CTA text is the tile's span.action, its href the tile's href.
 */
export default function parse(element, { document, params }) {
  const TEXT_ONLY = 'cmp-action-card-robust';
  const IMAGE_RIGHT = 'cmp-action-card-robust-with-image';
  const IMAGE_BG = 'cmp-action-card-with-background-image';
  const SIMPLE = 'cmp-action-card-simple';
  const LINKBOX = 'linkbox';

  // Simple tile: the heading is the link (<h3><a>Title</a></h3>), then the text
  const buildSimpleBody = (card) => {
    const body = [];
    const heading = card.querySelector('.cmp-action-card-simple__title, .cmp-title h2, .cmp-title h3, .cmp-title h4, .cmp-title h5');
    if (heading) {
      const titleEl = heading.querySelector('.cmp-title__inner') || heading;
      const title = titleEl.textContent.replace(/\s+/g, ' ').trim();
      if (title) {
        const level = /^H[1-6]$/.test(heading.tagName) ? heading.tagName.toLowerCase() : 'h3';
        const h = document.createElement(level);
        const link = heading.querySelector('a[href]');
        if (link) {
          const a = document.createElement('a');
          a.setAttribute('href', link.getAttribute('href'));
          a.textContent = title;
          h.append(a);
        } else {
          h.textContent = title;
        }
        body.push(h);
      }
    }
    card.querySelectorAll('.cmp-text__rich-content').forEach((rich) => {
      [...rich.children].forEach((child) => {
        if (child.textContent.trim()) body.push(child);
      });
    });
    return body;
  };

  const buildBody = (card) => {
    const body = [];
    const title = card.querySelector('.cmp-title h2, .cmp-title h3, h2');
    if (title) {
      const h = document.createElement('h2');
      h.textContent = title.textContent.trim();
      body.push(h);
    }
    card.querySelectorAll('.cmp-text__rich-content').forEach((rich) => {
      [...rich.children].forEach((child) => {
        if (child.textContent.trim()) body.push(child);
      });
    });
    const link = card.querySelector('.cmp-link a[href]');
    if (link) {
      const textEl = link.querySelector('.cmp-button__text');
      const text = (textEl || link).textContent.trim();
      if (text) {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.setAttribute('href', link.getAttribute('href'));
        a.textContent = text;
        p.append(a);
        body.push(p);
      }
    }
    return body;
  };

  const buildImage = (card) => {
    const img = card.querySelector('.cmp-image img');
    if (!img || !img.getAttribute('src')) return '';
    const image = document.createElement('img');
    image.src = img.getAttribute('src');
    image.alt = img.getAttribute('alt') || '';
    return image;
  };

  // Link tile: <a class="linkbox" href><h2/><p/><span class="action">CTA</span></a>
  const buildLinkboxBody = (card) => {
    const clean = (text) => (text || '').replace(/\s+/g, ' ').trim();
    const body = [];
    const title = card.querySelector('h2, h3');
    if (title && clean(title.textContent)) {
      const h = document.createElement('h2');
      h.textContent = clean(title.textContent);
      body.push(h);
    }
    card.querySelectorAll(':scope > p').forEach((p) => {
      if (clean(p.textContent)) body.push(p);
    });
    const action = card.querySelector('.action');
    const text = action ? clean(action.textContent) : '';
    if (text && card.getAttribute('href')) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.setAttribute('href', card.getAttribute('href'));
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
      if (linkboxBody.length) cells.push(['', linkboxBody]);
      return;
    }
    if (card.classList.contains(SIMPLE)) {
      const simpleBody = buildSimpleBody(card);
      if (simpleBody.length) cells.push(['', simpleBody]);
      return;
    }
    const body = buildBody(card);
    if (card.classList.contains(IMAGE_RIGHT)) {
      cells.push([body, buildImage(card)]);
    } else if (card.classList.contains(IMAGE_BG)) {
      cells.push([buildImage(card), body]);
    } else {
      cells.push(['', body]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-action', cells });
  element.replaceWith(block);
}
