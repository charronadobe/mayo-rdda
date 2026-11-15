/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-stat.
 * Source: column-control container holding .cmp-fact-card tiles (About Mayo Clinic).
 * One row per fact card, two cells:
 *   image | <h3>label</h3>, <p>stat</p>, <p>description</p>
 * Notes on the source:
 *  - The decorative <mc-icon> next to the label is not content (dropped; the
 *    cleanup transformer removes it as well).
 *  - The stat ("$100M", "50%") stays a paragraph, not a heading.
 */
export default function parse(element, { document, params }) {
  const clean = (text) => (text || '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();

  const cells = [];
  element.querySelectorAll('.cmp-fact-card').forEach((card) => {
    // Image cell
    const imageCell = [];
    const img = card.querySelector('.cmp-fact-card__media img') || card.querySelector('picture img');
    if (img && img.getAttribute('src')) {
      const image = document.createElement('img');
      image.setAttribute('src', img.getAttribute('src'));
      image.setAttribute('alt', clean(img.getAttribute('alt')));
      imageCell.push(image);
    }

    // Body cell
    const body = [];
    const label = card.querySelector('.cmp-fact-card__pretitle, .cmp-fact-card__iconTitle h1, .cmp-fact-card__iconTitle h2, .cmp-fact-card__iconTitle h3, .cmp-fact-card__iconTitle h4');
    if (label && clean(label.textContent)) {
      const h3 = document.createElement('h3');
      h3.textContent = clean(label.textContent);
      body.push(h3);
    }
    const stat = card.querySelector('.cmp-fact-card__statistic');
    if (stat && clean(stat.textContent)) {
      const p = document.createElement('p');
      p.textContent = clean(stat.textContent);
      body.push(p);
    }
    const description = card.querySelector('.cmp-fact-card__description');
    if (description) {
      const blocks = [...description.children].filter((child) => clean(child.textContent));
      if (blocks.length) {
        blocks.forEach((child) => body.push(child));
      } else if (clean(description.textContent)) {
        const p = document.createElement('p');
        p.textContent = clean(description.textContent);
        body.push(p);
      }
    }

    if (!imageCell.length && !body.length) return;
    cells.push([imageCell, body]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-stat', cells });
  element.replaceWith(block);
}
