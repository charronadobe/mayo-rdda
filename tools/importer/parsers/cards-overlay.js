/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-overlay.
 * Source: .cmp-column-control__layoutType--ThreeColumn .cmp-column-control__container
 * The container holds an intro .cmp-text-card (H2, paragraph, CTA) which is kept
 * as default content before the block, followed by .cmp-image-video-card items
 * that become one row each: image | linked H3 title + subtitle.
 */
export default function parse(element, { document, params }) {
  // Intro text card -> default content placed before the block
  const intro = [];
  element.querySelectorAll('.cmp-text-card').forEach((card) => {
    if (card.closest('.cmp-image-video-card')) return;
    const heading = card.querySelector('.cmp-title h1, .cmp-title h2, .cmp-title h3');
    if (heading) {
      const h = document.createElement(heading.tagName.toLowerCase());
      h.textContent = heading.textContent.trim();
      intro.push(h);
    }
    const description = card.querySelector('.cmp-text-card__description');
    if (description) [...description.children].forEach((child) => intro.push(child));
    card.querySelectorAll('.cmp-text-card__buttons a[href]').forEach((link) => {
      const textEl = link.querySelector('.cmp-button__text');
      const text = (textEl || link).textContent.trim();
      if (!text) return;
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      const a = document.createElement('a');
      a.href = link.getAttribute('href');
      a.textContent = text;
      strong.append(a);
      p.append(strong);
      intro.push(p);
    });
  });

  // Cards
  const cells = [];
  element.querySelectorAll('.cmp-image-video-card').forEach((card) => {
    const imageCell = [];
    const img = card.querySelector('.cmp-media img');
    if (img) imageCell.push(img.closest('picture') || img);

    const bodyCell = [];
    const titleEl = card.querySelector('.cmp-image-video-card__content-container h3, .cmp-image-video-card__title-container');
    const link = titleEl ? titleEl.querySelector('a[href]') : card.querySelector('.cmp-image-video-card__content-container a[href]');
    const titleText = (titleEl || link) ? (titleEl || link).textContent.replace(/\s+/g, ' ').trim() : '';
    if (titleText) {
      const h3 = document.createElement('h3');
      if (link) {
        const a = document.createElement('a');
        a.href = link.getAttribute('href');
        a.textContent = titleText;
        h3.append(a);
      } else {
        h3.textContent = titleText;
      }
      bodyCell.push(h3);
    }
    const description = card.querySelector('.cmp-image-video-card__description');
    if (description && description.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      bodyCell.push(p);
    }

    cells.push([imageCell, bodyCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-overlay', cells });
  intro.forEach((node) => element.before(node));
  element.replaceWith(block);
}
