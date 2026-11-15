/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-link-list.
 * Source: .cmp-link-list (two-column list of chevron links).
 * One row per link, single cell containing the link text-only (icons dropped).
 * Also: .cmp-link-list-robust (Appointments page): li.cmp-link-item-robust > a wrapping a
 * headline (h2/h3 .cmp-link-item-robust__headline) and p.cmp-link-item-robust__sub-header.
 * One row per item, single cell: <p><a>headline text</a></p> + <p>sub-header</p>
 * (the heading is not kept inside the link; the block keeps the extra paragraph
 * in the row cell as its short description).
 */
export default function parse(element, { document, params }) {
  const cells = [];
  const clean = (text) => (text || '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();

  const robustItems = element.querySelectorAll('li.cmp-link-item-robust');
  if (robustItems.length) {
    robustItems.forEach((item) => {
      const link = item.querySelector('a[href]');
      if (!link) return;
      const headline = item.querySelector('.cmp-link-item-robust__headline');
      const title = clean((headline || link).textContent);
      if (!title) return;
      const cell = [];
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.setAttribute('href', link.getAttribute('href'));
      a.textContent = title;
      p.append(a);
      cell.push(p);
      const sub = item.querySelector('.cmp-link-item-robust__sub-header');
      if (sub && clean(sub.textContent)) {
        const desc = document.createElement('p');
        desc.textContent = clean(sub.textContent);
        cell.push(desc);
      }
      cells.push([cell]);
    });
    const robustBlock = WebImporter.Blocks.createBlock(document, { name: 'cards-link-list', cells });
    element.replaceWith(robustBlock);
    return;
  }

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
