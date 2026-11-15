/* eslint-disable */
/* global WebImporter */

/**
 * Parser for quote-pull.
 * Source: .cmp-pull-quote (About Mayo Clinic, Patient-Centered Care).
 * Row 1: the quotation paragraph(s), curly quotes kept as in the source.
 * Row 2 (optional), one cell:
 *   optional <p><picture><img></picture></p> avatar, <p>name</p>,
 *   then <p>title</p> and/or <p><a>Read ... story</a></p>
 * Notes on the source:
 *  - The story link's chevron <svg> is decorative; only .cmp-button__text is kept.
 *  - Quotes without an avatar carry .cmp-pull-quote__no-avatar and no <img>.
 */
export default function parse(element, { document, params }) {
  const clean = (text) => (text || '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();

  const cells = [];

  // Row 1: quotation
  const quote = element.querySelector('blockquote, .cmp-pull-quote__quote');
  const quoteCell = [];
  if (quote) {
    const paragraphs = [...quote.querySelectorAll('p')].filter((p) => clean(p.textContent));
    if (paragraphs.length) {
      paragraphs.forEach((p) => {
        const para = document.createElement('p');
        para.textContent = clean(p.textContent);
        quoteCell.push(para);
      });
    } else if (clean(quote.textContent)) {
      const para = document.createElement('p');
      para.textContent = clean(quote.textContent);
      quoteCell.push(para);
    }
  }
  cells.push([quoteCell]);

  // Row 2: attribution
  const attribution = [];
  const avatar = element.querySelector('.cmp-avatar img, .cmp-pull-quote__avatar img');
  if (avatar && avatar.getAttribute('src')) {
    const p = document.createElement('p');
    const picture = document.createElement('picture');
    const img = document.createElement('img');
    img.setAttribute('src', avatar.getAttribute('src'));
    img.setAttribute('alt', clean(avatar.getAttribute('alt')));
    picture.append(img);
    p.append(picture);
    attribution.push(p);
  }

  const textOf = (el) => {
    if (!el) return '';
    const clone = el.cloneNode(true);
    clone.querySelectorAll('.cmp-link, a').forEach((a) => a.remove());
    return clean(clone.textContent);
  };
  const name = textOf(element.querySelector('.cmp-pull-quote__name'));
  if (name) {
    const p = document.createElement('p');
    p.textContent = name;
    attribution.push(p);
  }
  const title = textOf(element.querySelector('.cmp-pull-quote__title'));
  if (title) {
    const p = document.createElement('p');
    p.textContent = title;
    attribution.push(p);
  }
  const link = element.querySelector('.cmp-pull-quote__avatar-link-container a[href], .cmp-link a[href]');
  if (link) {
    const textEl = link.querySelector('.cmp-button__text');
    const text = clean((textEl || link).textContent);
    if (text) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.setAttribute('href', link.getAttribute('href'));
      a.textContent = text;
      p.append(a);
      attribution.push(p);
    }
  }
  if (attribution.length) cells.push([attribution]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'quote-pull', cells });
  element.replaceWith(block);
}
