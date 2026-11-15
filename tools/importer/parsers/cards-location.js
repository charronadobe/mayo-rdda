/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-location.
 * Source: .cmp-locations-card-from-model (Locations page).
 * One row per location, two cells:
 *   image | <h2>Title</h2>, <p>subtitle</p>, <ul><li><a>link</a></li>...</ul>
 * Notes on the source:
 *  - The heading holds the title and a .cmp-title__subheader span
 *    ("Mayo Clinic in Arizona" + "Phoenix & Scottsdale"); they are split into the
 *    heading and a subtitle paragraph. The source heading level is kept
 *    (H2 for the campuses, H3 for London under "International locations").
 *  - Links keep only their .cmp-button__text (chevron icons dropped).
 *  - Each card is its own source component. Cards that follow each other with
 *    nothing in between (the three US campuses) become ONE block: the first card
 *    claims the following ones, appends their rows and removes them, so their own
 *    parser runs are skipped. London sits after the "International locations"
 *    default content and stays a block of its own.
 */
export default function parse(element, { document, params }) {
  const CARD = '.cmp-locations-card-from-model';
  const clean = (text) => (text || '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();

  const buildRow = (card) => {
    const imageCell = [];
    const img = card.querySelector('.cmp-locations-card__media img') || card.querySelector('picture img, img');
    if (img && img.getAttribute('src')) {
      const image = document.createElement('img');
      image.setAttribute('src', img.getAttribute('src'));
      image.setAttribute('alt', clean(img.getAttribute('alt')));
      imageCell.push(image);
    }

    const body = [];
    const heading = card.querySelector('.cmp-locations-card__heading, .cmp-title h1, .cmp-title h2, .cmp-title h3, .cmp-title h4');
    if (heading) {
      const clone = heading.cloneNode(true);
      const sub = clone.querySelector('.cmp-title__subheader');
      const subtitle = sub ? clean(sub.textContent) : '';
      if (sub) sub.remove();
      const title = clean(clone.textContent);
      if (title) {
        const level = /^H[1-6]$/.test(heading.tagName) ? heading.tagName.toLowerCase() : 'h2';
        const h = document.createElement(level);
        h.textContent = title;
        body.push(h);
      }
      if (subtitle) {
        const p = document.createElement('p');
        p.textContent = subtitle;
        body.push(p);
      }
    }

    const ul = document.createElement('ul');
    card.querySelectorAll('.cmp-locations-card__buttons a[href]').forEach((link) => {
      const textEl = link.querySelector('.cmp-button__text');
      const text = clean((textEl || link).textContent);
      if (!text) return;
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.setAttribute('href', link.getAttribute('href'));
      a.textContent = text;
      li.append(a);
      ul.append(li);
    });
    if (ul.children.length) body.push(ul);

    return [imageCell, body];
  };

  // Outermost wrapper that holds only this card (stops below a container with other content)
  const wrapperOf = (card) => {
    let node = card;
    while (node.parentElement && node.parentElement.children.length === 1
      && node.parentElement !== document.body && !node.parentElement.matches('main, #main-content')) {
      node = node.parentElement;
    }
    return node;
  };
  const isBlank = (el) => !clean(el.textContent) && !el.querySelector('img, picture, video, iframe');

  const cells = [buildRow(element)];

  // Merge the cards that directly follow this one
  let wrapper = wrapperOf(element);
  let next = wrapper.nextElementSibling;
  while (next) {
    if (isBlank(next)) { next = next.nextElementSibling; continue; }
    const cards = next.matches(CARD) ? [next] : [...next.querySelectorAll(CARD)];
    if (cards.length !== 1) break;
    const card = cards[0];
    // the sibling must hold nothing but the card
    if (clean(next.textContent) !== clean(card.textContent)) break;
    cells.push(buildRow(card));
    const after = next.nextElementSibling;
    next.remove();
    next = after;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-location', cells });
  element.replaceWith(block);
}
