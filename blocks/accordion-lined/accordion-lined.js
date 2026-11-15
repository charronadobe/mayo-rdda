/**
 * Accordion Lined: a list of expandable items, each with a dark label,
 * a chevron before the label and a thin rule under the item.
 *
 * Authoring: one row per item, cells: label | panel content.
 * An optional third cell reading "open" makes that item start open.
 * With no "open" cell the first item starts open; the "closed" option
 * (Accordion Lined (closed)) starts every item closed.
 *
 * Rendered as native details/summary: keyboard and screen-reader support
 * (Enter/Space to toggle, expanded state announced) come from the browser.
 * @param {Element} block
 */

const OPEN_MARKER = /^open$/i;

/** Label content without the wrapping paragraph or heading the editor adds. */
function labelNodes(cell) {
  const blocks = [...cell.children];
  if (blocks.length === 1 && /^(P|H[1-6])$/.test(blocks[0].tagName)) {
    return [...blocks[0].childNodes];
  }
  return [...cell.childNodes];
}

export default function decorate(block) {
  const rows = [...block.children].map((row) => {
    const [labelCell, bodyCell, stateCell] = row.children;
    const hasLabel = labelCell && labelCell.textContent.trim();
    const hasBody = bodyCell && bodyCell.textContent.trim();
    if (!hasLabel && !hasBody) return null;
    return {
      labelCell,
      bodyCell,
      markedOpen: OPEN_MARKER.test(stateCell?.textContent.trim() || ''),
    };
  }).filter(Boolean);

  const anyMarked = rows.some((r) => r.markedOpen);
  const allClosed = block.classList.contains('closed');

  const items = rows.map(({ labelCell, bodyCell, markedOpen }, i) => {
    const details = document.createElement('details');
    details.className = 'accordion-lined-item';
    if (anyMarked ? markedOpen : (!allClosed && i === 0)) details.open = true;

    const summary = document.createElement('summary');
    summary.className = 'accordion-lined-label';
    const title = document.createElement('span');
    title.className = 'accordion-lined-title';
    if (labelCell) title.append(...labelNodes(labelCell));
    summary.append(title);

    const body = bodyCell || document.createElement('div');
    body.className = 'accordion-lined-body';

    details.append(summary, body);
    return details;
  });

  block.replaceChildren(...items);
}
