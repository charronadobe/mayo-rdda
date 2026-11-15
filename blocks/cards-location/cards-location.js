import { createOptimizedPicture } from '../../scripts/aem.js';

function isImageCell(cell) {
  return !!cell.querySelector('picture, img') && cell.textContent.trim() === '';
}

/**
 * Location cards: one row per location, an image cell and a body cell
 * (H2 title, subtitle paragraph, list of links). The photo always sits first: left of the
 * text on desktop, or above it in the stacked look (cards side by side).
 * @param {Element} block
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const imageCell = cells.find(isImageCell);
    const body = cells.find((cell) => cell !== imageCell && cell.textContent.trim() !== '');
    if (!body && !imageCell) return;

    const li = document.createElement('li');
    li.className = 'cards-location-card';

    if (imageCell) {
      imageCell.className = 'cards-location-card-image';
      li.append(imageCell);
    }

    if (body) {
      body.className = 'cards-location-card-body';
      const heading = body.querySelector('h1, h2, h3, h4, h5, h6');
      heading?.classList.add('cards-location-card-title');
      const subtitle = heading?.nextElementSibling;
      if (subtitle?.tagName === 'P' && !subtitle.querySelector('a')) {
        subtitle.classList.add('cards-location-card-subtitle');
      }

      // the link list: an authored list, or (fallback) paragraphs holding only a link
      let list = body.querySelector('ul, ol');
      if (!list) {
        const linkParagraphs = [...body.querySelectorAll(':scope > p')].filter((p) => {
          const a = p.querySelector('a[href]');
          return a && p.textContent.trim() === a.textContent.trim();
        });
        if (linkParagraphs.length) {
          list = document.createElement('ul');
          linkParagraphs[0].before(list);
          linkParagraphs.forEach((p) => {
            const item = document.createElement('li');
            item.append(...p.childNodes);
            list.append(item);
            p.remove();
          });
        }
      }
      if (list) {
        list.classList.add('cards-location-card-links');
        list.querySelectorAll('a').forEach((a) => a.classList.remove('button', 'primary', 'secondary', 'accent'));
      }
      li.append(body);
    }

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '900' }]));
  });

  // stacked look (photo above text, cards in a row): several cards with a single link each,
  // or authored as the "stacked" variant; "horizontal" keeps the photo-beside-text look.
  const cards = [...ul.children];
  const singleLink = cards.length > 1
    && cards.every((card) => card.querySelectorAll('.cards-location-card-links a[href]').length <= 1);
  if (!block.classList.contains('horizontal') && singleLink) block.classList.add('stacked');

  block.textContent = '';
  block.append(ul);
}
