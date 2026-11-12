import { createOptimizedPicture } from '../../scripts/aem.js';

function isImageCell(cell) {
  return !!cell.querySelector('picture, img') && cell.textContent.trim() === '';
}

/**
 * Action tiles: title, text and one CTA link, with an optional image.
 * Each row is one tile with two cells (image and body, either order):
 * - empty image cell (or only a body cell): text-only half-width tile
 * - body | image: full-width tile, image on the right
 * - image | body: full-width tile, image fills the tile behind the text
 * @param {Element} block
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-action-card';
    const cells = [...row.children];

    const imageIndex = cells.findIndex(isImageCell);
    cells.forEach((cell, i) => {
      if (i === imageIndex) {
        cell.className = 'cards-action-card-image';
        li.append(cell);
      } else if (cell.textContent.trim() !== '' || cell.querySelector('a[href]')) {
        cell.className = 'cards-action-card-body';
        li.append(cell);
      }
    });

    if (imageIndex === -1) {
      li.classList.add('cards-action-card-text');
    } else {
      const bodyIndex = cells.findIndex((cell, i) => i !== imageIndex && cell.textContent.trim() !== '');
      li.classList.add(imageIndex < bodyIndex ? 'cards-action-card-background' : 'cards-action-card-media');
    }

    const body = li.querySelector('.cards-action-card-body');
    const links = body ? [...body.querySelectorAll('a[href]')] : [];
    const cta = links[links.length - 1];
    if (cta) {
      cta.classList.add('cards-action-card-cta');
      cta.classList.remove('button', 'primary', 'secondary', 'accent');
      const wrapper = cta.closest('p');
      if (wrapper) {
        wrapper.classList.remove('button-wrapper', 'button-container');
        wrapper.classList.add('cards-action-card-cta-wrapper');
      }
    }

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '900' }]));
  });

  block.textContent = '';
  block.append(ul);
}
