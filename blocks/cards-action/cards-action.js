import { createOptimizedPicture } from '../../scripts/aem.js';

function isImageCell(cell) {
  return !!cell.querySelector('picture, img') && cell.textContent.trim() === '';
}

/**
 * The tile's CTA: the last link that stands alone in its own paragraph.
 * Links inside lists or headings are not CTAs.
 * @param {Element} body
 * @returns {Element|undefined}
 */
function findCta(body) {
  const links = [...body.querySelectorAll(':scope > p a[href]')]
    .filter((a) => a.closest('p').textContent.trim() === a.textContent.trim());
  return links[links.length - 1];
}

/**
 * Action tiles: title, text and one CTA link, with an optional image.
 * Each row is one tile with two cells (image and body, either order):
 * - empty image cell (or only a body cell): text-only half-width tile
 * - body | image: full-width tile, image on the right
 * - image | body: full-width tile, image fills the tile behind the text
 * A block with no images at all renders as a grid of shadowed tiles
 * (the CTA is a link paragraph, or a linked heading; bodies may hold link
 * lists), or as plain link boxes when it sits in a split section.
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
    const cta = body ? findCta(body) : undefined;
    // no CTA paragraph: the linked heading is the tile's call to action
    const titleLink = !cta && body
      ? body.querySelector(':scope > :is(h2, h3, h4, h5, h6) a[href]') : null;
    if (titleLink) {
      li.classList.add('cards-action-card-linked-title');
      titleLink.classList.add('cards-action-card-title-link');
    }
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

  // blocks without images are tile grids; in a split section (beside default content)
  // they are link boxes
  if (!ul.querySelector('.cards-action-card-image')) {
    block.classList.add(block.closest('.section.split') ? 'cards-action-linkbox' : 'cards-action-tiles');
  }

  block.textContent = '';
  block.append(ul);
}
