/**
 * Full-width single-row band: heading, text and call to action side by side.
 * Each authored cell becomes one column; cells are tagged by their content so
 * the CTA column can align to the end.
 * @param {Element} block
 */
export default function decorate(block) {
  const firstRow = block.firstElementChild;
  const cols = firstRow ? [...firstRow.children] : [];
  block.classList.add(`columns-banner-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    row.classList.add('columns-banner-row');
    [...row.children].forEach((col) => {
      col.classList.add('columns-banner-col');
      const links = col.querySelectorAll('a[href]');
      const text = col.textContent.trim();
      const linkText = [...links].map((a) => a.textContent.trim()).join('');
      if (col.querySelector('h1, h2, h3, h4, h5, h6')) {
        col.classList.add('columns-banner-heading');
      } else if (links.length && text === linkText) {
        col.classList.add('columns-banner-cta');
      } else {
        col.classList.add('columns-banner-text');
      }
    });
  });
}
