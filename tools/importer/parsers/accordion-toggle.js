/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion-toggle.
 * Source: .cmp-hil-article-references (collapsed "Show references" expando).
 * One row, two cells: label | body.
 *   label: the full visible button text ("Show references")
 *   body:  the reference list (ol), which is in the static HTML even while hidden
 */
export default function parse(element, { document, params }) {
  const labelEl = element.querySelector('.cmp-expando__button-title');
  const label = (labelEl ? labelEl.textContent : 'Show references').replace(/\s+/g, ' ').trim();

  const bodyCell = [];
  const content = element.querySelector('.cmp-expando__content');
  if (content) {
    const blocks = [...content.querySelectorAll(':scope > ol, :scope > ul, :scope > p')];
    if (blocks.length) {
      bodyCell.push(...blocks);
    } else {
      // fallback: any list or paragraph nested deeper
      const nested = [...content.querySelectorAll('ol, ul, p')].filter((el) => !el.parentElement.closest('ol, ul, p'));
      if (nested.length) bodyCell.push(...nested);
      else if (content.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = content.textContent.replace(/\s+/g, ' ').trim();
        bodyCell.push(p);
      }
    }
  }

  const cells = [[label, bodyCell]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-toggle', cells });
  element.replaceWith(block);
}
