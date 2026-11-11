/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-banner.
 * Source: #top-advertisement (navy donation band).
 * One row, three cells: heading | paragraph | CTA.
 * Notes on the source:
 *  - The decorative giving-charity.svg icon (alt="", hidden on small screens)
 *    is not authorable content and is dropped.
 *  - The "Advance Research" button is rendered twice (one per breakpoint);
 *    links are de-duplicated by href + text so only one CTA is kept.
 */
export default function parse(element, { document, params }) {
  // Heading cell
  const headingCell = [];
  const heading = element.querySelector('.cmp-title h1, .cmp-title h2, .cmp-title h3, h2');
  if (heading) {
    const h = document.createElement(heading.tagName.toLowerCase());
    h.textContent = heading.textContent.trim();
    headingCell.push(h);
  }

  // Text cell
  const textCell = [];
  element.querySelectorAll('.cmp-text__rich-content').forEach((rich) => {
    [...rich.children].forEach((child) => {
      if (child.textContent.trim()) textCell.push(child);
    });
  });

  // CTA cell (de-duplicated)
  const ctaCell = [];
  const seen = new Set();
  element.querySelectorAll('.cmp-link a[href]').forEach((link) => {
    const textEl = link.querySelector('.cmp-button__text');
    const text = (textEl || link).textContent.trim();
    const href = link.getAttribute('href');
    const key = `${href}|${text}`;
    if (!text || seen.has(key)) return;
    seen.add(key);
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    const a = document.createElement('a');
    a.href = href;
    a.textContent = text;
    strong.append(a);
    p.append(strong);
    ctaCell.push(p);
  });

  const cells = [[headingCell, textCell, ctaCell]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-banner', cells });
  element.replaceWith(block);
}
