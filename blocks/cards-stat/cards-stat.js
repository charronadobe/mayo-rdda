import { createOptimizedPicture } from '../../scripts/aem.js';

function isImageCell(cell) {
  return !!cell.querySelector('picture, img') && cell.textContent.trim() === '';
}

/**
 * Fact cards: one row per card, an image cell and a body cell (either order).
 * Body: heading label, stat paragraph (the first paragraph after the heading), description.
 * The image always renders after the text.
 * @param {Element} block
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const li = document.createElement('li');
    li.className = 'cards-stat-card';

    const imageCell = cells.find(isImageCell);
    const body = cells.find((cell) => cell !== imageCell && cell.textContent.trim() !== '');
    if (!body && !imageCell) return;

    if (body) {
      body.className = 'cards-stat-card-body';
      const heading = body.querySelector('h1, h2, h3, h4, h5, h6');
      heading?.classList.add('cards-stat-card-label');
      const paragraphs = [...body.querySelectorAll(':scope > p')];
      const children = [...body.children];
      const start = heading ? children.indexOf(heading) + 1 : 0;
      const stat = children.slice(start).find((el) => el.tagName === 'P' && el.textContent.trim());
      if (stat) stat.classList.add('cards-stat-card-value');
      paragraphs.filter((p) => p !== stat).forEach((p) => p.classList.add('cards-stat-card-text'));
      li.append(body);
    }

    if (imageCell) {
      imageCell.className = 'cards-stat-card-image';
      li.append(imageCell);
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
