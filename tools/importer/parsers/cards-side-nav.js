/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-side-nav.
 * Source: .cmp-level-two-navigation (left rail of a condition page): the condition
 * name (.cmp-level-two-navigation__heading) and one link per tab
 * (Symptoms and causes, Diagnosis and treatment, Doctors and departments, Care at Mayo Clinic).
 * Rows, one cell each:
 *   1. condition title (plain text, no link)
 *   2+. one row per tab: the current page (a.active) as plain text, the other tabs
 *       as absolute www.mayoclinic.org links (sibling pages are not migrated).
 * Also: section navs with expandable groups (International Patient Services): a top-level
 * li holding a <button> (group label) and a nested ul whose first entry "Overview" links to
 * the group's own page. Such a group is one row whose cell holds the label as a link to the
 * Overview page, then a nested ul of the other sub-links (sub-groups the same way, nested
 * deeper; a sub-group with only its Overview becomes a plain link). The "Overview" entries
 * are dropped as they duplicate the label link.
 */
const MAYO_ORIGIN = 'https://www.mayoclinic.org';

function absolute(href) {
  try {
    return new URL(href, MAYO_ORIGIN).href;
  } catch (e) {
    return href;
  }
}

function pathOf(href) {
  try {
    return new URL(href, MAYO_ORIGIN).pathname.replace(/\/$/, '');
  } catch (e) {
    return '';
  }
}

const clean = (text) => (text || '').replace(/\s+/g, ' ').trim();

function isCurrentLink(link, currentPath) {
  return link.classList.contains('active')
    || link.getAttribute('aria-current') === 'page'
    || (!!currentPath && pathOf(link.getAttribute('href')) === currentPath);
}

// Link (or plain text when it is the current page) with the given label
function navLink(document, text, href, current) {
  if (current || !href) return document.createTextNode(text);
  const a = document.createElement('a');
  a.setAttribute('href', absolute(href));
  a.textContent = text;
  return a;
}

// Grouped nav item: { label, href, current, children } (children: nested items, Overview dropped)
// or a plain item { label, href, current, children: [] }; null when it has no text
function navItem(li, currentPath) {
  const button = li.querySelector(':scope > button');
  if (!button) {
    const link = li.querySelector(':scope > .cmp-link > a[href], :scope > a[href]');
    const text = link ? clean(link.textContent) : '';
    if (!text) return null;
    return { label: text, href: link.getAttribute('href'), current: isCurrentLink(link, currentPath), children: [] };
  }
  const label = clean(button.textContent);
  if (!label) return null;
  let href = '';
  let current = false;
  const children = [];
  li.querySelectorAll(':scope > ul > li').forEach((sub) => {
    const item = navItem(sub, currentPath);
    if (!item) return;
    if (!href && !item.children.length && /^overview$/i.test(item.label)) {
      ({ href, current } = item);
      return;
    }
    children.push(item);
  });
  return { label, href, current, children };
}

function navList(document, items) {
  const ul = document.createElement('ul');
  items.forEach((item) => {
    const li = document.createElement('li');
    li.append(navLink(document, item.label, item.href, item.current));
    if (item.children.length) li.append(navList(document, item.children));
    ul.append(li);
  });
  return ul;
}

// Navs with expandable groups: one row per top-level item, a group's sub-links nested in its cell
function parseGrouped(element, document, currentPath, cells) {
  const menu = element.querySelector('nav > ul') || element.querySelector('ul');
  menu.querySelectorAll(':scope > li').forEach((li) => {
    const item = navItem(li, currentPath);
    if (!item) return;
    const p = document.createElement('p');
    p.append(navLink(document, item.label, item.href, item.current));
    cells.push(item.children.length ? [[p, navList(document, item.children)]] : [p]);
  });
}

export default function parse(element, { document, params }) {
  const cells = [];
  const currentPath = params && params.originalURL ? pathOf(params.originalURL) : '';

  // Title row: condition name
  const heading = element.querySelector('.cmp-level-two-navigation__heading');
  const title = heading ? heading.textContent.replace(/\s+/g, ' ').trim() : '';
  if (title) {
    const p = document.createElement('p');
    p.textContent = title;
    cells.push([p]);
  }

  if (element.querySelector('li > button')) {
    parseGrouped(element, document, currentPath, cells);
    const grouped = WebImporter.Blocks.createBlock(document, { name: 'cards-side-nav', cells });
    element.replaceWith(grouped);
    return;
  }

  // One row per tab
  element.querySelectorAll('li a[href]').forEach((link) => {
    const text = link.textContent.replace(/\s+/g, ' ').trim();
    if (!text) return;
    const href = link.getAttribute('href');
    const isCurrent = link.classList.contains('active')
      || link.getAttribute('aria-current') === 'page'
      || (currentPath && pathOf(href) === currentPath);
    const p = document.createElement('p');
    if (isCurrent) {
      p.textContent = text;
    } else {
      const a = document.createElement('a');
      a.setAttribute('href', absolute(href));
      a.textContent = text;
      p.append(a);
    }
    cells.push([p]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-side-nav', cells });
  element.replaceWith(block);
}
