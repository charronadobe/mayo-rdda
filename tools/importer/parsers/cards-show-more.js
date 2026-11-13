/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-show-more.
 * Source: .cmp-dynamic-related-content ("Related content", "Associated procedures",
 * "Products & services"). All items are in one ul; the ones behind "Show N more"
 * are only hidden by script, so every li is taken.
 * Output: the list's H2 as default content, then the block with one row
 * (one cell) per link. Links stay absolute to www.mayoclinic.org.
 */
const MAYO_ORIGIN = 'https://www.mayoclinic.org';

function absolute(href) {
  try {
    return new URL(href, MAYO_ORIGIN).href;
  } catch (e) {
    return href;
  }
}

export default function parse(element, { document, params }) {
  const cells = [];

  element.querySelectorAll('li.cmp-dynamic-related-content__list-item').forEach((li) => {
    const link = li.querySelector('a[href]');
    if (!link) return;
    const label = link.querySelector('.cmp-button__text') || link;
    const text = label.textContent.replace(/\s+/g, ' ').trim();
    if (!text) return;
    const a = document.createElement('a');
    a.setAttribute('href', absolute(link.getAttribute('href')));
    a.textContent = text;
    cells.push([a]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-show-more', cells });

  const title = element.querySelector('.cmp-dynamic-related-content__title, h2');
  const titleText = title ? title.textContent.replace(/\s+/g, ' ').trim() : '';
  if (titleText) {
    const h2 = document.createElement('h2');
    h2.textContent = titleText;
    element.replaceWith(h2, block);
  } else {
    element.replaceWith(block);
  }
}
