/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-link-list.
 * Source: .cmp-link-list (two-column list of chevron links).
 * One row per link, single cell containing the link text-only (icons dropped).
 */
export default function parse(element, { document, params }) {
  const cells = [];

  element.querySelectorAll('li.cmp-link-list__item').forEach((item) => {
    const link = item.querySelector('a[href]');
    if (!link) return;
    const textEl = link.querySelector('.cmp-link-list__item-text');
    const text = (textEl || link).textContent.replace(/\s+/g, ' ').trim();
    if (!text) return;
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = link.getAttribute('href');
    a.textContent = text;
    p.append(a);
    cells.push([[p]]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-link-list', cells });
  element.replaceWith(block);
}
