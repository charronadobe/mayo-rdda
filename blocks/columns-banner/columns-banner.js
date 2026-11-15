/**
 * Single-row columns block with three looks, chosen from the authored structure:
 * - band: a cell holds only a call-to-action link (heading | text | CTA side by side)
 * - split: a title cell (optional eyebrow + heading) beside a text cell
 * - cards: every cell is a text card (heading, text, list of links)
 * Each authored cell becomes one column; cells are tagged by their content.
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

  if (block.querySelector('.columns-banner-cta')) {
    block.classList.add('columns-banner-band');
    return;
  }

  block.classList.add(block.querySelector('.columns-banner-text') ? 'columns-banner-split' : 'columns-banner-cards');

  // text before the heading is an eyebrow; a paragraph holding only a link is a link row
  block.querySelectorAll('.columns-banner-heading').forEach((col) => {
    const heading = col.querySelector(':scope > :is(h1, h2, h3, h4, h5, h6)');
    let prev = heading?.previousElementSibling;
    while (prev) {
      if (prev.tagName === 'P') prev.classList.add('columns-banner-eyebrow');
      prev = prev.previousElementSibling;
    }
  });
  block.querySelectorAll('.columns-banner-col > p').forEach((p) => {
    const a = p.querySelector('a[href]');
    if (a && p.textContent.trim() === a.textContent.trim()) p.classList.add('columns-banner-link');
  });
}
