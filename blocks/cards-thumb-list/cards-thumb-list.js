import { createOptimizedPicture } from '../../scripts/aem.js';

function isImageCell(cell) {
  return !!cell.querySelector('picture, img') && cell.textContent.trim() === '';
}

/**
 * Stacked list of stories: small square thumbnail beside a linked title.
 * Each authored row has two cells: the image and the link (either order;
 * the image is optional). The whole item is clickable through the title link.
 * @param {Element} block
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (!cells.some((cell) => cell.textContent.trim() || cell.querySelector('img'))) return;

    const li = document.createElement('li');
    li.className = 'cards-thumb-list-item';
    const image = cells.find(isImageCell);
    if (image) {
      image.className = 'cards-thumb-list-image';
      li.append(image);
    }
    cells.filter((cell) => cell !== image && cell.textContent.trim()).forEach((cell) => {
      cell.className = 'cards-thumb-list-body';
      li.append(cell);
    });

    const link = li.querySelector('.cards-thumb-list-body a[href]');
    if (link) {
      link.classList.remove('button', 'primary', 'secondary', 'accent');
      link.classList.add('cards-thumb-list-link');
      link.closest('.button-wrapper, .button-container')?.classList.remove('button-wrapper', 'button-container');
    }
    // the thumbnail repeats the title, so hide it from assistive tech
    li.querySelectorAll('.cards-thumb-list-image img').forEach((img) => { img.alt = ''; });

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]));
  });

  block.replaceChildren(ul);
}
