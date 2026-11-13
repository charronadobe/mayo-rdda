import { loadCSS } from '../../scripts/aem.js';

let instance = 0;

/**
 * Turns a paragraph holding only a link to a search page into the same search
 * field as the search-conditions block (label = link text, form submits to the link).
 * @param {Element} cell the intro cell
 */
async function decorateSearch(cell) {
  const link = [...cell.querySelectorAll('a[href]')].find((a) => {
    const p = a.closest('p');
    try {
      return p && p.textContent.trim() === a.textContent.trim()
        && /\/search/i.test(new URL(a.href).pathname);
    } catch (e) {
      return false;
    }
  });
  if (!link) return;
  const search = document.createElement('div');
  search.className = 'search-conditions columns-intro-index-search';
  const labelRow = document.createElement('div');
  labelRow.append(document.createElement('div'));
  labelRow.firstChild.textContent = link.textContent.trim();
  const linkRow = document.createElement('div');
  const linkCell = document.createElement('div');
  const a = document.createElement('a');
  a.href = link.href;
  a.textContent = link.href;
  linkCell.append(a);
  linkRow.append(linkCell);
  // placeholder text inside the field (source: "Search")
  const placeholderRow = document.createElement('div');
  placeholderRow.append(document.createElement('div'));
  placeholderRow.firstChild.textContent = 'Search';
  search.append(labelRow, linkRow, placeholderRow);
  link.closest('p').replaceWith(search);
  const [{ default: decorateSearchBlock }] = await Promise.all([
    import('../search-conditions/search-conditions.js'),
    loadCSS(`${window.hlx.codeBasePath}/blocks/search-conditions/search-conditions.css`),
  ]);
  await decorateSearchBlock(search);
}

/**
 * Page intro beside an A-Z index.
 * One row, two cells: intro (H1 + paragraph) | index (H2 label + list of letter links).
 * The index label stays a real heading (visually hidden); a toggle button
 * shows or hides the letter list on small screens.
 * @param {Element} block
 */
export default async function decorate(block) {
  instance += 1;
  const row = block.firstElementChild;
  if (!row) return;
  row.classList.add('columns-intro-index-row');

  const cells = [...row.children];
  cells.forEach((cell) => cell.classList.add('columns-intro-index-col'));

  const indexCell = cells.find((cell) => cell.querySelector('ul, ol')) || cells[1];
  const introCell = cells.find((cell) => cell !== indexCell);
  introCell?.classList.add('columns-intro-index-intro');
  if (introCell) {
    try {
      await decorateSearch(introCell);
    } catch (e) {
      // the letter index still works without the search field
    }
  }
  if (!indexCell) return;
  indexCell.classList.add('columns-intro-index-index');

  const list = indexCell.querySelector('ul, ol');
  if (!list) return;
  list.classList.add('columns-intro-index-letters');
  list.id = list.id || `columns-intro-index-letters-${instance}`;
  // the letter of the page being viewed is marked as current (local previews add a path prefix)
  const pagePath = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '');
  list.querySelectorAll('a[href]').forEach((a) => {
    a.classList.add('columns-intro-index-letter');
    a.classList.remove('button');
    const url = new URL(a.href, window.location.href);
    const linkPath = url.pathname.replace(/\.html$/, '').replace(/\/$/, '');
    if (url.origin === window.location.origin && linkPath && pagePath.endsWith(linkPath)) {
      a.setAttribute('aria-current', 'page');
    }
  });

  const label = indexCell.querySelector('h1, h2, h3, h4, h5, h6');
  if (label) label.classList.add('columns-intro-index-label');

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'columns-intro-index-toggle';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', list.id);
  toggle.textContent = label?.textContent.trim() || 'Browse by letter';
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    indexCell.classList.toggle('is-open', open);
  });
  list.before(toggle);
}
