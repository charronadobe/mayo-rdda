/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-thumb-list.
 * Source: .cmp-news-and-patient-stories ("News from Mayo Clinic").
 * Each li wraps one link around a square thumbnail and the story title.
 * Output: the list's H2 as default content, then the block with one row per
 * story: thumbnail image | linked title. Image URLs stay on the source host.
 */
const MAYO_ORIGIN = 'https://www.mayoclinic.org';

function absolute(href) {
  try {
    return new URL(href, MAYO_ORIGIN).href;
  } catch (e) {
    return href;
  }
}

export default function parse(element, { document, params }) {
  const cells = [];

  element.querySelectorAll('li.cmp-news-and-patient-stories__list-item').forEach((li) => {
    const link = li.querySelector('a[href]');
    if (!link) return;
    const label = link.querySelector('.cmp-button__text') || link.querySelector('.cmp-news-and-patient-stories__list-item-text');
    const text = (label ? label.textContent : '').replace(/\s+/g, ' ').trim();
    if (!text) return;

    const imageCell = [];
    const img = li.querySelector('.cmp-news-and-patient-stories__list-item-image img');
    const src = img ? img.getAttribute('src') || '' : '';
    if (img && src && !src.startsWith('data:')) {
      const image = document.createElement('img');
      image.setAttribute('src', src);
      image.setAttribute('alt', img.getAttribute('alt') || '');
      imageCell.push(image);
    }

    const a = document.createElement('a');
    a.setAttribute('href', absolute(link.getAttribute('href')));
    a.textContent = text;

    cells.push([imageCell, [a]]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-thumb-list', cells });

  const title = element.querySelector('.cmp-news-and-patient-stories__title, h2');
  const titleText = title ? title.textContent.replace(/\s+/g, ' ').trim() : '';
  if (titleText) {
    const h2 = document.createElement('h2');
    h2.textContent = titleText;
    element.replaceWith(h2, block);
  } else {
    element.replaceWith(block);
  }
}
