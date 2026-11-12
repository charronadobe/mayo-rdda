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
 *  - The three card classes are distinct tokens (no nesting), so the comma
 *    selector returns each tile once, in document order.
 */
export default function parse(element, { document, params }) {
  const TEXT_ONLY = 'cmp-action-card-robust';
  const IMAGE_RIGHT = 'cmp-action-card-robust-with-image';
  const IMAGE_BG = 'cmp-action-card-with-background-image';

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

  const cells = [];
  element.querySelectorAll(`.${IMAGE_RIGHT}, .${TEXT_ONLY}, .${IMAGE_BG}`).forEach((card) => {
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
