/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-intro-index.
 * Source: #cmp-dc-banner .cmp-container--centered (blue intro band).
 * One row, two cells:
 *   cell 1 = H1 page title + intro paragraph
 *   cell 2 = H2 label + bulleted list of A-Z letter links
 * Notes on the source:
 *  - The breadcrumb and "Skip this Section" link are removed by the cleanup
 *    transformer; they are also ignored here if still present.
 *  - The search box (.cmp-search, filled in by script on the live page) is
 *    authored as a link to the results page; the block turns it into a search field.
 *  - Letter links contain a decorative chevron icon; only the letter text is
 *    kept. Letter links point to the migrated letter pages on this site:
 *    /diseases-conditions/index?letter=A -> /health-library/diseases-conditions/a
 *    ('#' -> /health-library/diseases-conditions/other).
 *  - The search results page only exists on mayoclinic.org, so that link is absolute.
 */
const SOURCE_ORIGIN = 'https://www.mayoclinic.org';
const LETTER_PAGES = '/health-library/diseases-conditions';

function letterPagePath(href) {
  const url = new URL(href, SOURCE_ORIGIN);
  const letter = (url.searchParams.get('letter') || '').trim().toLowerCase();
  if (!/\/diseases-conditions\/index$/.test(url.pathname) || !letter) return url.href;
  return `${LETTER_PAGES}/${/^[a-z]$/.test(letter) ? letter : 'other'}`;
}

export default function parse(element, { document, params }) {
  // Cell 1: title + intro text
  const introCell = [];
  const h1 = element.querySelector('.cmp-title h1');
  if (h1) {
    const h = document.createElement('h1');
    h.textContent = h1.textContent.trim();
    introCell.push(h);
  }
  element.querySelectorAll('.cmp-text__rich-content').forEach((rich) => {
    [...rich.children].forEach((child) => {
      if (child.textContent.trim()) introCell.push(child);
    });
  });

  // Search box below the intro text: authored as a link to the results page
  if (element.querySelector('.cmp-search')) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.setAttribute('href', `${SOURCE_ORIGIN}/diseases-conditions/search-results`);
    a.textContent = 'Search diseases & conditions';
    p.append(a);
    introCell.push(p);
  }

  // Cell 2: index label + letter list
  const indexCell = [];
  const facet = element.querySelector('.cmp-alphabet-facet') || element;
  const label = facet.querySelector('h2.cmp-alphabet-facet--label') || facet.querySelector('h2');
  if (label) {
    const h = document.createElement('h2');
    h.textContent = label.textContent.trim();
    indexCell.push(h);
  }
  const ul = document.createElement('ul');
  facet.querySelectorAll('li.cmp-alphabet-facet--letter a[href]').forEach((link) => {
    const textEl = link.querySelector('.cmp-button__text');
    const text = (textEl || link).textContent.trim();
    if (!text) return;
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.setAttribute('href', letterPagePath(link.getAttribute('href')));
    a.textContent = text;
    li.append(a);
    ul.append(li);
  });
  if (ul.children.length) indexCell.push(ul);

  const cells = [[introCell, indexCell]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-intro-index', cells });
  element.replaceWith(block);
}
