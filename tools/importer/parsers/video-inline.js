/* eslint-disable */
/* global WebImporter */

/**
 * Parser for video-inline.
 * Source: .cmp-video-from-model inside the condition article. The component holds
 * the player, an H3 video title and a "Show transcript" expando.
 * Output (replaces the whole component, because block claims can't overlap):
 *   1. video-inline block, one cell: optional poster image + video link
 *      - YouTube: link = data-youtube-src (https://www.youtube.com/watch?v=ID, recorded by
 *        the cleanup transformer before iframes are removed); no poster on the source
 *      - Mayo/Kaltura poster player: the stable Kaltura thumbnail as poster + a link to the
 *        page the video is on (params.originalURL), never a signed cfvod.kaltura.com URL
 *      Link text = the video title.
 *   2. the H3 video title as default content
 *   3. accordion-toggle block: "Show transcript" | transcript paragraphs
 */
const MAYO_ORIGIN = 'https://www.mayoclinic.org';

function clean(text) {
  return (text || '').replace(/\s+/g, ' ').trim();
}

function sourcePageUrl(document, params) {
  if (params && params.originalURL) return params.originalURL;
  const canonical = document.querySelector('link[rel="canonical"][href]');
  if (canonical) {
    try { return new URL(canonical.getAttribute('href'), MAYO_ORIGIN).href; } catch (e) { /* ignore */ }
  }
  const og = document.querySelector('meta[property="og:url"][content]');
  if (og) return og.getAttribute('content');
  return '';
}

function transcriptBody(document, container) {
  const body = [];
  if (!container) return body;
  // the transcript text sits in a custom <transcript> element: take its paragraphs / lists
  const root = container.querySelector('transcript') || container;
  [...root.children].forEach((child) => {
    if (!clean(child.textContent)) return;
    if (/^(P|UL|OL|H[1-6]|BLOCKQUOTE)$/.test(child.tagName)) {
      body.push(child);
    } else {
      const p = document.createElement('p');
      p.innerHTML = child.innerHTML;
      body.push(p);
    }
  });
  if (!body.length && clean(root.textContent)) {
    const p = document.createElement('p');
    p.textContent = clean(root.textContent);
    body.push(p);
  }
  return body;
}

export default function parse(element, { document, params }) {
  const titleEl = element.querySelector('.cmp-video__title, .cmp-title h3, h3');
  const title = clean(titleEl && titleEl.textContent);

  // Poster: Kaltura thumbnail (cdnsecakmi.kaltura.com/.../thumbnail/...) or any real image
  const posterImg = element.querySelector('.cmp-video__poster img, .cmp-poster__image img');
  const posterSrc = posterImg ? posterImg.getAttribute('src') || '' : '';

  const youtube = element.getAttribute('data-youtube-src') || '';
  const href = youtube || sourcePageUrl(document, params);

  const cell = [];
  if (posterImg && posterSrc && !posterSrc.startsWith('data:')) {
    const img = document.createElement('img');
    img.setAttribute('src', posterSrc);
    img.setAttribute('alt', clean(posterImg.getAttribute('alt')) || title);
    cell.push(img);
  }
  if (href) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.setAttribute('href', href);
    a.textContent = title || href;
    p.append(a);
    cell.push(p);
  }

  const out = [WebImporter.Blocks.createBlock(document, { name: 'video-inline', cells: [[cell]] })];

  if (title) {
    const h3 = document.createElement('h3');
    h3.textContent = title;
    out.push(h3);
  }

  // "Show transcript" expando -> accordion-toggle block right after the video
  const expando = element.querySelector('.cmp-video__expando');
  if (expando) {
    const labelEl = expando.querySelector('.cmp-expando__button-title');
    const label = clean(labelEl && labelEl.textContent) || 'Show transcript';
    const body = transcriptBody(document, expando.querySelector('.cmp-video__expando-transcript, .cmp-expando__content'));
    if (body.length) {
      out.push(WebImporter.Blocks.createBlock(document, { name: 'accordion-toggle', cells: [[label, body]] }));
    }
  }

  element.replaceWith(...out);
}
