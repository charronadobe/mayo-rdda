/**
 * Section nav for a set of sibling pages (condition tabs, a hub's subpages).
 * Authored rows, one cell each:
 * - first row without a link: the nav title (condition name)
 * - later rows without a link: the current page (marked aria-current)
 * - rows with a link: sibling pages (a link to the current URL is also marked current)
 * - a row with a link and a nested list is a group: the label link plus its sub-links,
 *   collapsible with a chevron button (expanded when the current page is inside it).
 *   Lists may nest further; each nested item with its own list is a group too.
 * On desktop the block sits in a sticky left rail of a "split" section.
 * Flat navs (condition pages) are repeated at the end of the section, as on the source;
 * navs with groups (or authored with the "grouped" option) are not, and use the
 * hub page layout (see CSS).
 * @param {Element} block
 */

function isCurrentUrl(href) {
  try {
    const url = new URL(href, window.location.href);
    const strip = (path) => path.replace(/\/$/, '');
    return url.origin === window.location.origin
      && strip(url.pathname) === strip(window.location.pathname);
  } catch {
    return false;
  }
}

function plainLink(a) {
  a.classList.remove('button', 'primary', 'secondary', 'accent');
  a.removeAttribute('title');
  a.className = 'cards-side-nav-link';
  return a;
}

let instance = 0;

function nextId(prefix) {
  instance += 1;
  return `${prefix}-${instance}`;
}

/** The nested list of a row cell or list item, if any. */
function nestedList(el) {
  return el.querySelector(':scope > ul, :scope > ol');
}

/** The item's own link and label, ignoring anything inside its nested list. */
function ownEntry(el, list) {
  const link = [...el.querySelectorAll('a[href]')].find((a) => !list || !list.contains(a));
  let text = '';
  if (link) {
    text = link.textContent.trim();
  } else {
    const copy = el.cloneNode(true);
    copy.querySelector(':scope > ul, :scope > ol')?.remove();
    text = copy.textContent.trim();
  }
  return { link, text };
}

function currentLabel(text) {
  const current = document.createElement('span');
  current.className = 'cards-side-nav-current';
  current.setAttribute('aria-current', 'page');
  current.textContent = text;
  return current;
}

/**
 * Builds one nav item (top level or nested).
 * @param {Element} el the row cell or authored list item
 * @param {boolean} top whether it is a top-level item
 * @returns {HTMLLIElement|null}
 */
function buildItem(el, top) {
  const list = nestedList(el);
  const { link, text } = ownEntry(el, list);
  if (!link && !text) return null;

  const li = document.createElement('li');
  li.className = top ? 'cards-side-nav-item' : 'cards-side-nav-subitem';
  const isCurrent = !link || isCurrentUrl(link.href);
  const label = isCurrent ? currentLabel(text) : plainLink(link);
  if (isCurrent) li.classList.add('cards-side-nav-item-current');

  const children = list
    ? [...list.children].map((child) => buildItem(child, false)).filter(Boolean)
    : [];
  if (!children.length) {
    li.append(label);
    return li;
  }

  // group: label + chevron toggle, then the nested list
  const sublist = document.createElement('ul');
  sublist.className = 'cards-side-nav-sublist';
  sublist.id = nextId('cards-side-nav-group');
  sublist.append(...children);

  const open = isCurrent || !!sublist.querySelector('[aria-current]');
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'cards-side-nav-group-toggle';
  button.setAttribute('aria-expanded', String(open));
  button.setAttribute('aria-controls', sublist.id);
  button.setAttribute('aria-label', `${text} pages`);
  sublist.hidden = !open;

  const row = document.createElement('div');
  row.className = 'cards-side-nav-group-label';
  row.append(label, button);
  li.classList.add('cards-side-nav-group');
  li.append(row, sublist);
  return li;
}

/**
 * Small screens (below the desktop rail): the nav collapses behind a button showing the title
 * and "Menu" (source: .cmp-level-two-navigation__menu-toggle). CSS hides the button on desktop.
 */
function addToggle(nav, title) {
  const ul = nav.querySelector(':scope > ul');
  if (!ul) return;
  ul.id = ul.id || nextId('cards-side-nav-list');
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'cards-side-nav-toggle';
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', ul.id);
  const label = document.createElement('span');
  label.className = 'cards-side-nav-toggle-title';
  label.textContent = title || 'Pages';
  const state = document.createElement('span');
  state.className = 'cards-side-nav-toggle-state';
  state.textContent = 'Menu';
  button.append(label, state);
  nav.prepend(button);
}

export default function decorate(block) {
  const rows = [...block.children];
  const nav = document.createElement('nav');
  const ul = document.createElement('ul');
  let title = '';

  rows.forEach((row, index) => {
    const cell = row.firstElementChild || row;
    const text = cell.textContent.trim();
    const hasLink = !!cell.querySelector('a[href]');
    if (!text && !hasLink) return;

    if (index === 0 && !hasLink) {
      title = text;
      const p = document.createElement('p');
      p.className = 'cards-side-nav-title';
      p.textContent = text;
      nav.append(p);
      return;
    }

    const li = buildItem(cell, true);
    if (li) ul.append(li);
  });

  if (ul.querySelector('.cards-side-nav-group')) block.classList.add('grouped');
  const grouped = block.classList.contains('grouped');

  nav.setAttribute('aria-label', title ? `${title} pages` : 'Section pages');
  nav.append(ul);
  block.replaceChildren(nav);

  // desktop: the nav spans every row of the split section (see CSS)
  const wrapper = block.parentElement;
  const section = block.closest('.section');
  if (section && wrapper && wrapper.parentElement === section) {
    section.style.setProperty('--cards-side-nav-rows', section.children.length + 1);

    // condition pages: the source repeats the nav, always expanded, at the end of the article
    if (!grouped) {
      const repeat = wrapper.cloneNode(true);
      repeat.classList.add('cards-side-nav-repeat');
      const repeatBlock = repeat.querySelector('.cards-side-nav');
      if (repeatBlock) repeatBlock.dataset.blockStatus = 'loaded';
      const repeatNav = repeat.querySelector('nav');
      repeatNav.setAttribute('aria-label', `${nav.getAttribute('aria-label')} (end of article)`);
      section.append(repeat);
    }
  }

  addToggle(nav, title);

  // one listener for the small-screen menu button and the group chevrons
  nav.addEventListener('click', (e) => {
    const button = e.target.closest('button[aria-controls]');
    if (!button || !nav.contains(button)) return;
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    if (button.classList.contains('cards-side-nav-toggle')) {
      button.querySelector('.cards-side-nav-toggle-state').textContent = open ? 'Close' : 'Menu';
      nav.classList.toggle('is-open', open);
    } else {
      const target = nav.querySelector(`#${button.getAttribute('aria-controls')}`);
      if (target) target.hidden = !open;
    }
  });
}
