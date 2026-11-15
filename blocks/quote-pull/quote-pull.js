import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Pull quote. Row 1: quotation. Row 2 (optional): attribution cell with an optional
 * avatar image, the name (first text paragraph), then a title paragraph and/or a link.
 * @param {Element} block
 */
export default function decorate(block) {
  const [quoteRow, attributionRow] = [...block.children];
  const figure = document.createElement('figure');
  figure.className = 'quote-pull-figure';

  const blockquote = document.createElement('blockquote');
  blockquote.className = 'quote-pull-quotation';
  const quoteCell = quoteRow?.querySelector(':scope > div') || quoteRow;
  if (quoteCell) {
    const hasBlocks = quoteCell.querySelector('p, h1, h2, h3, h4, h5, h6');
    if (hasBlocks) {
      blockquote.append(...quoteCell.childNodes);
    } else {
      const p = document.createElement('p');
      p.append(...quoteCell.childNodes);
      blockquote.append(p);
    }
  }
  figure.append(blockquote);

  const cells = attributionRow ? [...attributionRow.children] : [];
  const parts = cells.flatMap((cell) => {
    const kids = [...cell.children];
    if (kids.length) return kids;
    if (!cell.textContent.trim()) return [];
    const p = document.createElement('p');
    p.append(...cell.childNodes);
    return [p];
  });

  if (parts.length) {
    const caption = document.createElement('figcaption');
    caption.className = 'quote-pull-attribution';
    const details = document.createElement('div');
    details.className = 'quote-pull-details';
    let nameFound = false;

    parts.forEach((el) => {
      const media = el.matches('picture, img') ? el : el.querySelector('picture, img');
      if (media && !el.textContent.trim()) {
        const avatar = document.createElement('div');
        avatar.className = 'quote-pull-avatar';
        avatar.append(media.closest('picture') || media);
        caption.prepend(avatar);
        return;
      }
      if (!el.textContent.trim()) return;
      const links = el.querySelectorAll('a[href]');
      const linkOnly = links.length === 1 && el.textContent.trim() === links[0].textContent.trim();
      if (linkOnly) {
        el.className = 'quote-pull-link';
        links[0].classList.remove('button', 'primary', 'secondary', 'accent');
      } else if (!nameFound) {
        el.className = 'quote-pull-name';
        nameFound = true;
      } else {
        el.className = 'quote-pull-title';
      }
      details.append(el);
    });

    if (details.children.length) caption.append(details);
    if (caption.children.length) figure.append(caption);
  }

  figure.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '160' }]));
  });

  block.textContent = '';
  block.append(figure);
}
