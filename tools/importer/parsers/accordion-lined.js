/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion-lined.
 * Source: ul.cmp-accordion (Appointments page, "Still want to schedule by phone?").
 * One row per li.cmp-accordion__item, two cells:
 *   label (plain text of .cmp-accordion__button-title, icon dropped) |
 *   panel (child nodes of the item's .cmp-text__rich-content, moved unchanged:
 *          H3s, paragraphs, tel:/mailto: links, strong, lists)
 * No third "open" cell: the block opens the first item by default, as on the source.
 * The H2 above the accordion is not part of the matched element and stays default content.
 */
export default function parse(element, { document, params }) {
  const clean = (text) => (text || '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
  const cells = [];

  const items = element.matches('li.cmp-accordion__item')
    ? [element]
    : [...element.querySelectorAll('li.cmp-accordion__item')];

  items.forEach((item) => {
    const titleEl = item.querySelector('.cmp-accordion__button-title');
    const label = clean(titleEl ? titleEl.textContent : '');

    const panel = [];
    const content = item.querySelector('.cmp-accordion__item-content');
    if (content) {
      content.querySelectorAll('.cmp-text__rich-content').forEach((rich) => {
        [...rich.childNodes].forEach((node) => {
          // skip whitespace-only text nodes between elements
          if (node.nodeType === 3 && !node.textContent.trim()) return;
          panel.push(node);
        });
      });
    }

    if (!label && !panel.length) return;
    cells.push([label, panel]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-lined', cells });
  element.replaceWith(block);
}
