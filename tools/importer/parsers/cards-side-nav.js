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
