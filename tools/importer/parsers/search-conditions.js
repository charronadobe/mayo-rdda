/* eslint-disable */
/* global WebImporter */

/**
 * Parser for search-conditions.
 * Source: #main-content .cmp-search (mc-search web component).
 * Rows (one cell each): label text; link to the search results page; placeholder text.
 * The source component does not expose its action URL in the DOM, so the
 * diseases & conditions search results page is used.
 */
const RESULTS_PATH = '/diseases-conditions/search-results';

export default function parse(element, { document, params }) {
  const cells = [];

  // Label: visible label text without the visually-hidden assistive hint
  const labelEl = element.querySelector('.search-label label, label');
  let labelText = '';
  if (labelEl) {
    const clone = labelEl.cloneNode(true);
    clone.querySelectorAll('.u-visuallyhidden').forEach((el) => el.remove());
    labelText = clone.textContent.replace(/\s+/g, ' ').trim();
  }
  if (labelText) {
    const p = document.createElement('p');
    p.textContent = labelText;
    cells.push([p]);
  }

  // Results page link (form action / data attribute if present, else known results page)
  const form = element.querySelector('form[action]');
  const host = element.querySelector('mc-search');
  const action = (form && form.getAttribute('action'))
    || (host && (host.getAttribute('action') || host.getAttribute('data-action')))
    || RESULTS_PATH;
  const linkP = document.createElement('p');
  const a = document.createElement('a');
  a.href = action;
  a.textContent = action;
  linkP.append(a);
  cells.push([linkP]);

  // Placeholder
  const input = element.querySelector('input.search-input, input');
  const placeholderEl = element.querySelector('.search-placeholder');
  const placeholder = (input && input.getAttribute('placeholder'))
    || (placeholderEl && placeholderEl.textContent.trim())
    || '';
  if (placeholder) {
    const p = document.createElement('p');
    p.textContent = placeholder;
    cells.push([p]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'search-conditions', cells });
  element.replaceWith(block);
}
