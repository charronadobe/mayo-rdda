/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-banner.
 * Source: #top-advertisement (navy donation band).
 * One row, three cells: heading | paragraph | CTA.
 * Notes on the source:
 *  - The decorative giving-charity.svg icon (alt="", hidden on small screens)
 *    is not authorable content and is dropped.
 *  - The "Advance Research" button is rendered twice (one per breakpoint);
 *    links are de-duplicated by href + text so only one CTA is kept.
 * Also: .cmp-column-control__container.cmp-text-card__care (Patient-Centered Care),
 * a white two-column text card -> one row, two cells:
 *   eyebrow paragraph + H2 | paragraph(s) + link paragraph
 * Also: any other column container of .cmp-text-card (Patient & Visitor Guide,
 * "Online access..." | "Confidentiality..."): one row, one cell per card:
 *   H3, paragraph(s), one paragraph per link
 */
// Appends one .cmp-text-card's content to target: eyebrow paragraph, heading,
// description block(s), then one paragraph per link (button text only)
function appendCard(card, target, document) {
  const clean = (text) => (text || '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
  const eyebrow = card.querySelector('.cmp-title__pretitle');
  if (eyebrow && clean(eyebrow.textContent)) {
    const p = document.createElement('p');
    p.textContent = clean(eyebrow.textContent);
    target.push(p);
  }
  const heading = card.querySelector('.cmp-title h1, .cmp-title h2, .cmp-title h3');
  if (heading && clean(heading.textContent)) {
    const h = document.createElement(heading.tagName.toLowerCase());
    h.textContent = clean(heading.textContent);
    target.push(h);
  }
  card.querySelectorAll('.cmp-text-card__description').forEach((description) => {
    const blocks = [...description.children].filter((child) => clean(child.textContent));
    if (blocks.length) {
      blocks.forEach((child) => target.push(child));
    } else if (clean(description.textContent)) {
      const p = document.createElement('p');
      p.textContent = clean(description.textContent);
      target.push(p);
    }
  });
  card.querySelectorAll('.cmp-text-card__buttons a[href], .cmp-link a[href]').forEach((link) => {
    const textEl = link.querySelector('.cmp-button__text');
    const text = clean((textEl || link).textContent);
    if (!text) return;
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.setAttribute('href', link.getAttribute('href'));
    a.textContent = text;
    p.append(a);
    target.push(p);
  });
}

function parseTextCard(element, document) {
  const cards = [...element.querySelectorAll('.cmp-text-card')];

  const left = [];
  const right = [];
  cards.forEach((card) => {
    const target = card.querySelector('.cmp-title h1, .cmp-title h2, .cmp-title h3') ? left : right;
    appendCard(card, target, document);
  });

  return [[left, right]];
}

export default function parse(element, { document, params }) {
  if (element.classList.contains('cmp-text-card__care')) {
    const textCardBlock = WebImporter.Blocks.createBlock(document, { name: 'columns-banner', cells: parseTextCard(element, document) });
    element.replaceWith(textCardBlock);
    return;
  }

  // Column container of text cards (not the donation band): one cell per card
  const textCards = [...element.querySelectorAll('.cmp-text-card')]
    .filter((card) => !card.parentElement.closest('.cmp-text-card'));
  if (textCards.length && !element.matches('#top-advertisement')) {
    const row = textCards.map((card) => {
      const cell = [];
      appendCard(card, cell, document);
      return cell;
    });
    const cardsBlock = WebImporter.Blocks.createBlock(document, { name: 'columns-banner', cells: [row] });
    element.replaceWith(cardsBlock);
    return;
  }

  // Heading cell
  const headingCell = [];
  const heading = element.querySelector('.cmp-title h1, .cmp-title h2, .cmp-title h3, h2');
  if (heading) {
    const h = document.createElement(heading.tagName.toLowerCase());
    h.textContent = heading.textContent.trim();
    headingCell.push(h);
  }

  // Text cell
  const textCell = [];
  element.querySelectorAll('.cmp-text__rich-content').forEach((rich) => {
    [...rich.children].forEach((child) => {
      if (child.textContent.trim()) textCell.push(child);
    });
  });

  // CTA cell (de-duplicated)
  const ctaCell = [];
  const seen = new Set();
  element.querySelectorAll('.cmp-link a[href]').forEach((link) => {
    const textEl = link.querySelector('.cmp-button__text');
    const text = (textEl || link).textContent.trim();
    const href = link.getAttribute('href');
    const key = `${href}|${text}`;
    if (!text || seen.has(key)) return;
    seen.add(key);
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    const a = document.createElement('a');
    a.href = href;
    a.textContent = text;
    strong.append(a);
    p.append(strong);
    ctaCell.push(p);
  });

  const cells = [[headingCell, textCell, ctaCell]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-banner', cells });
  element.replaceWith(block);
}
