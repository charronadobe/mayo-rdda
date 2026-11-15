/* eslint-disable */
/* global WebImporter */

/**
 * Parser for search-doctor.
 * Source: #main-content > .bio-find (Find a Doctor page, legacy ASP.NET markup).
 * Custom search variant: the row structure follows blocks/search-doctor/README.md (and the
 * block code), not the library Search block's single query-index row.
 * Rows:
 *   1. background <picture> (the source sets the photo in CSS on .bio-find, so the known
 *      image URL is used unless the element carries an inline background-image; the cleanup
 *      transformer maps www.mayoclinic.org images to the DA-hosted copy)
 *   2. <h2> heading ("Find a doctor")
 *   3. field label | placeholder
 *   4. location label | first #SearchLocation option text (all main locations)
 *   5+ one row per remaining option: shown text | query value
 *   then the results page link (form action, absolute: the results only exist on mayoclinic.org)
 *   then the Search Tips link (absolute).
 * Dropped: the Azure type-ahead attributes of the input, the ASP.NET submit button
 * (the block renders its own SEARCH button) and the decorative magnifier (CSS only).
 */
const SOURCE_ORIGIN = 'https://www.mayoclinic.org';
const BACKGROUND = 'https://www.mayoclinic.org/styles/img/_bio-search-bkg.png';
const RESULTS_PATH = '/appointments/find-a-doctor/search-results';

export default function parse(element, { document, params }) {
  const clean = (text) => (text || '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
  const absolute = (href) => {
    try { return new URL(href, SOURCE_ORIGIN).href; } catch (e) { return href; }
  };
  const para = (text) => {
    const p = document.createElement('p');
    p.textContent = text;
    return p;
  };
  const linkPara = (href, text) => {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.setAttribute('href', href);
    a.textContent = text;
    p.append(a);
    return p;
  };
  const labelFor = (control) => {
    if (!control) return '';
    const wrap = control.closest('.find-inputs');
    const label = (control.id && element.querySelector(`label[for="${control.id}"]`))
      || control.closest('label')
      || (wrap && wrap.querySelector('label'));
    return label ? clean(label.textContent) : '';
  };

  const cells = [];

  // 1. Background photo
  const inline = (element.getAttribute('style') || '').match(/background(?:-image)?\s*:[^;]*url\((['"]?)([^'")]+)\1\)/i);
  const picture = document.createElement('picture');
  const img = document.createElement('img');
  img.setAttribute('src', absolute(inline ? inline[2] : BACKGROUND));
  img.setAttribute('alt', '');
  picture.append(img);
  cells.push([picture]);

  // 2. Heading
  const heading = element.querySelector('h1, h2, h3');
  if (heading && clean(heading.textContent)) {
    const h2 = document.createElement('h2');
    h2.textContent = clean(heading.textContent);
    cells.push([h2]);
  }

  // 3. Search field: label | placeholder
  const input = element.querySelector('#azureSearchTerm, input[type="text"], input[type="search"]');
  if (input) cells.push([para(labelFor(input)), para(clean(input.getAttribute('placeholder')))]);

  // 4. Location select: label | first option text, then one row per remaining option
  const select = element.querySelector('#SearchLocation, select');
  if (select) {
    const [first, ...rest] = [...select.querySelectorAll('option')];
    cells.push([para(labelFor(select) || 'Location'), para(first ? clean(first.textContent) : '')]);
    rest.forEach((option) => {
      const text = clean(option.textContent);
      if (!text) return;
      const value = option.hasAttribute('value') ? clean(option.getAttribute('value')) : '';
      cells.push([para(text), para(value || text)]);
    });
  }

  // Results page (form action): the source posts back to itself and redirects here
  const results = absolute(RESULTS_PATH);
  cells.push([linkPara(results, results)]);

  // Search Tips (and any other helper link in the band)
  element.querySelectorAll('a[href]').forEach((a) => {
    const text = clean(a.textContent);
    if (text) cells.push([linkPara(absolute(a.getAttribute('href')), text)]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'search-doctor', cells });
  element.replaceWith(block);
}
