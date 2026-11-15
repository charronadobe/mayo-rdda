/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-media.
 * Source: .cmp-story-card (text card beside a tall portrait image).
 * One row, two cells: text | image. The source renders the image twice
 * (responsive duplicates) and sets the text side with the
 * cmp-story-card__text-card-container--left / --right modifier:
 *   --left  -> [text, image]  (image on the right)
 *   --right -> [image, text]  (image on the left)
 */
export default function parse(element, { document, params }) {
  const textContainer = element.querySelector('.cmp-story-card__text-card-container');
  const textCard = textContainer ? textContainer.querySelector('.cmp-text-card') : null;

  // Text cell
  const textCell = [];
  if (textCard) {
    // Eyebrow above the heading (care pages, e.g. Locations "Regional network")
    const eyebrow = textCard.querySelector('.cmp-title__pretitle');
    if (eyebrow && eyebrow.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = eyebrow.textContent.replace(/\s+/g, ' ').trim();
      textCell.push(p);
    }
    const heading = textCard.querySelector('.cmp-title h1, .cmp-title h2, .cmp-title h3, .cmp-title h4');
    if (heading) {
      const h = document.createElement(heading.tagName.toLowerCase());
      h.textContent = heading.textContent.trim();
      textCell.push(h);
    }
    const description = textCard.querySelector('.cmp-text-card__description');
    if (description) {
      [...description.children].forEach((child) => textCell.push(child));
    }
    // Second text group shown in full on desktop (About Mayo Clinic, e.g. "Innovating for new
    // solutions"); on mobile the same text sits in the "Read more about ..." expando, which the
    // cleanup removes, so this copy is the only one kept
    const collapsible = textCard.querySelector('.cmp-text-card__collapsible-description');
    if (collapsible) {
      [...collapsible.children].forEach((child) => textCell.push(child));
    }
    textCard.querySelectorAll('.cmp-text-card__buttons a[href]').forEach((link) => {
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
      textCell.push(p);
    });
  }

  // Image cell: the card renders its image twice (one .cmp-story-card__media per screen
  // layout, same file); only the first copy is kept, the rest goes with the replaced card.
  const imageCell = [];
  const img = element.querySelector('.cmp-story-card__media img');
  if (img) {
    const picture = img.closest('picture');
    imageCell.push(picture || img);
  }

  const imageLeft = !!(textContainer && textContainer.classList.contains('cmp-story-card__text-card-container--right'));
  const row = imageLeft ? [imageCell, textCell] : [textCell, imageCell];

  const cells = [row];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-media', cells });
  element.replaceWith(block);
}
