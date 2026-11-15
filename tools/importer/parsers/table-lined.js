/* eslint-disable */
/* global WebImporter */

/**
 * Parser for table-lined.
 * Source: <table> inside .cmp-text__rich-content (contact/phone tables on
 * /about-mayo-clinic/contact, one table per campus/region).
 * Row 1: header cells (Contact | Number), from the source <thead>.
 * Each later row: label (text or linked label, <br> kept) | one <p> per number
 * (phone link + note, e.g. <p><a href="tel:…">844-217-9591</a> (toll-free)</p>).
 * Notes on the source:
 *  - A contact with two numbers is a label cell with rowspan="2" and a second
 *    <tr> holding only the number; those rows are folded into one row whose
 *    number cell has one paragraph per number.
 *  - Only the table is replaced: text around it in the same rich-text component
 *    stays default content.
 */
export default function parse(element, { document, params }) {
  const table = element.tagName === 'TABLE' ? element : element.querySelector('table');
  if (!table) return;

  const isBlankNode = (node) => node.nodeType === 3 && !node.textContent.replace(/ /g, ' ').trim();

  // Content of a cell without the surrounding whitespace
  const cellNodes = (cell) => {
    const nodes = [...cell.childNodes];
    while (nodes.length && isBlankNode(nodes[0])) nodes.shift();
    while (nodes.length && isBlankNode(nodes[nodes.length - 1])) nodes.pop();
    if (nodes.length) {
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (first.nodeType === 3) first.textContent = first.textContent.replace(/^\s+/, '');
      if (last.nodeType === 3) last.textContent = last.textContent.replace(/\s+$/, '');
    }
    return nodes;
  };

  const toParagraphs = (cell) => {
    // a cell that already holds block elements keeps them; inline content -> one <p>
    const blocks = [...cell.children].filter((c) => /^(P|UL|OL|DIV)$/.test(c.tagName));
    if (blocks.length) return blocks.filter((b) => b.textContent.trim());
    const nodes = cellNodes(cell);
    if (!nodes.length) return [];
    const p = document.createElement('p');
    p.append(...nodes);
    return [p];
  };

  const allRows = [...table.querySelectorAll(':scope > thead > tr, :scope > tbody > tr, :scope > tfoot > tr, :scope > tr')];
  const cellsOf = (tr) => [...tr.children].filter((c) => /^T[DH]$/.test(c.tagName));

  // Header row: thead, else a first row made only of <th>
  let headerRow = table.querySelector(':scope > thead > tr');
  if (!headerRow && allRows.length && cellsOf(allRows[0]).every((c) => c.tagName === 'TH')) [headerRow] = allRows;
  const header = headerRow
    ? cellsOf(headerRow).map((c) => c.textContent.replace(/ /g, ' ').replace(/\s+/g, ' ').trim())
    : [];
  const width = Math.max(2, header.length, ...allRows.map((tr) => cellsOf(tr).length));
  while (header.length < width) header.push(header.length === 0 ? 'Contact' : (header.length === 1 ? 'Number' : ''));

  const rows = [];
  let open = null; // row still spanned by a rowspan label: { row, remaining }
  allRows.forEach((tr) => {
    if (tr === headerRow) return;
    const tds = cellsOf(tr);
    if (!tds.length) return;
    if (open && open.remaining > 0) {
      // continuation row: every cell holds another number for the spanned label
      open.remaining -= 1;
      const target = open.row[open.row.length - 1];
      tds.forEach((td) => target.push(...toParagraphs(td)));
      if (open.remaining === 0) open = null;
      return;
    }
    const [label, ...values] = tds;
    const row = [cellNodes(label), ...values.map((td) => toParagraphs(td))];
    while (row.length < width) row.push([]);
    rows.push(row);
    const span = parseInt(label.getAttribute('rowspan') || '1', 10);
    open = span > 1 ? { row, remaining: span - 1 } : null;
  });

  const cells = [header, ...rows];
  const block = WebImporter.Blocks.createBlock(document, { name: 'table-lined', cells });
  table.replaceWith(block);
}
