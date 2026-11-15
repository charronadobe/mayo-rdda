/**
 * Lined table (source: contact/phone tables on /about-mayo-clinic/contact).
 * Row 1 is the header row; every later row is a body row whose first cell is the row header.
 * A cell may hold several paragraphs (e.g. a contact with two numbers); they stack in the cell.
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.children].filter((row) => row.children.length);
  if (!rows.length) return;

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  table.append(thead, tbody);

  rows.forEach((row, rowIndex) => {
    const tr = document.createElement('tr');
    [...row.children].forEach((col, colIndex) => {
      let cell;
      if (rowIndex === 0) {
        cell = document.createElement('th');
        cell.scope = 'col';
      } else if (colIndex === 0) {
        cell = document.createElement('th');
        cell.scope = 'row';
      } else {
        cell = document.createElement('td');
      }
      cell.append(...col.childNodes);
      cell.querySelectorAll('a').forEach((a) => {
        a.classList.remove('button', 'primary', 'secondary', 'accent');
        a.closest('p')?.classList.remove('button-wrapper', 'button-container');
      });
      if (cell.querySelectorAll(':scope > p').length > 1) cell.classList.add('table-lined-stack');
      tr.append(cell);
    });
    (rowIndex === 0 ? thead : tbody).append(tr);
  });

  // horizontal scroll fallback on narrow screens; keyboard users can focus and scroll it
  const scroller = document.createElement('div');
  scroller.className = 'table-lined-scroll';
  scroller.tabIndex = 0;
  scroller.setAttribute('role', 'region');
  const headers = [...thead.querySelectorAll('th')].map((th) => th.textContent.trim()).filter(Boolean);
  scroller.setAttribute('aria-label', headers.length ? headers.join(', ') : 'Table');
  scroller.append(table);

  block.textContent = '';
  block.append(scroller);
}
