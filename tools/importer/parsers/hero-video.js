/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-video.
 * Source: .cmp-hero-card (mayoclinic.org home).
 * Row 1: video link (.mp4) + optional poster image.
 * Row 2: H1 heading + CTA links.
 */
export default function parse(element, { document, params }) {
  const cells = [];

  // Row 1: media (video link + poster)
  const mediaCell = [];
  const source = element.querySelector('video source[src], video[src]');
  const videoSrc = source ? source.getAttribute('src') : '';
  // Mayo's Kaltura video links are signed and expire within days (and the workspace Sync can't
  // upload pages that reference them), so they are left out; the poster image is kept.
  const expiring = /cfvod\.kaltura\.com/.test(videoSrc) && /[?&](Policy|Signature)=/.test(videoSrc);
  if (videoSrc && !expiring) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = videoSrc;
    a.textContent = videoSrc;
    p.append(a);
    mediaCell.push(p);
  }
  const posterImg = element.querySelector('.cmp-media__poster > img, .cmp-media__poster picture img');
  if (posterImg && posterImg.getAttribute('src') && !posterImg.getAttribute('src').startsWith('data:')) {
    const img = document.createElement('img');
    img.src = posterImg.getAttribute('src');
    img.alt = posterImg.getAttribute('alt') || '';
    mediaCell.push(img);
  }
  if (mediaCell.length) cells.push([mediaCell]);

  // Row 2: heading + CTAs
  const contentCell = [];
  const heading = element.querySelector('.cmp-hero-card__headline h1, .cmp-hero-card__content h1, h1');
  if (heading) {
    const h1 = document.createElement('h1');
    h1.textContent = heading.textContent.trim();
    contentCell.push(h1);
  }
  element.querySelectorAll('.cmp-hero-card__buttons a[href]').forEach((link) => {
    const textEl = link.querySelector('.cmp-button__text');
    const text = (textEl || link).textContent.trim();
    if (!text) return;
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = link.getAttribute('href');
    a.textContent = text;
    p.append(a);
    contentCell.push(p);
  });
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-video', cells });
  element.replaceWith(block);
}
