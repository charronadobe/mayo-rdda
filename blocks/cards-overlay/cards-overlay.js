import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Photo cards with title and subtitle overlaid at the bottom of the image.
 * Rows: image cell, then body cell (linked heading + subtitle).
 * The heading link is stretched to make the whole card clickable.
 * @param {Element} block
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-overlay-card';
    while (row.firstElementChild) li.append(row.firstElementChild);

    [...li.children].forEach((div) => {
      const imageOnly = div.querySelector('picture') && div.textContent.trim() === '';
      div.className = imageOnly ? 'cards-overlay-card-image' : 'cards-overlay-card-body';
    });

    const body = li.querySelector('.cards-overlay-card-body');
    const link = body?.querySelector('h1 a, h2 a, h3 a, h4 a, h5 a, h6 a') || body?.querySelector('a[href]');
    if (link) {
      link.classList.add('cards-overlay-card-link');
      link.classList.remove('button');
      link.closest('.button-container')?.classList.remove('button-container');
    }

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });

  block.textContent = '';
  block.append(ul);
}
