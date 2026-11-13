import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * In-article 16:9 video. One cell: an optional poster image and a video link.
 * - YouTube link: plays inline. With a poster the iframe loads on click;
 *   without one it loads when the block nears the viewport.
 * - .mp4/.webm link: native <video> with the poster, preload none.
 * - Any other link (Mayo-hosted Kaltura video page): the poster links out to
 *   the video on mayoclinic.org, because signed player links expire.
 * @param {Element} block
 */

function getYoutubeId(url) {
  const host = url.hostname.replace(/^www\.|^m\./, '');
  if (host === 'youtu.be') return url.pathname.split('/')[1] || '';
  if (!['youtube.com', 'youtube-nocookie.com'].includes(host)) return '';
  if (url.searchParams.get('v')) return url.searchParams.get('v');
  const [, kind, id] = url.pathname.split('/');
  return ['embed', 'shorts', 'live', 'v'].includes(kind) ? id || '' : '';
}

function createYoutubeIframe(id, title, autoplay) {
  const params = new URLSearchParams({ rel: '0' });
  if (autoplay) params.set('autoplay', '1');
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?${params}`;
  iframe.title = title;
  iframe.loading = 'lazy';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
  iframe.allowFullscreen = true;
  iframe.className = 'video-inline-frame';
  return iframe;
}

function createPlayIcon() {
  const icon = document.createElement('span');
  icon.className = 'video-inline-play';
  icon.setAttribute('aria-hidden', 'true');
  return icon;
}

function getLabel(link, picture) {
  const text = link?.textContent.trim() || '';
  const isUrl = /^https?:\/\//i.test(text);
  return (!isUrl && text) || picture?.querySelector('img')?.alt?.trim() || 'video';
}

export default function decorate(block) {
  let picture = block.querySelector('picture');
  const link = block.querySelector('a[href]');
  const label = getLabel(link, picture);

  if (picture) {
    const img = picture.querySelector('img');
    const imgUrl = img && new URL(img.src, window.location.href);
    if (imgUrl && imgUrl.origin === window.location.origin && !/\.svg$/i.test(imgUrl.pathname)) {
      picture = createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 600px)', width: '1200' }, { width: '750' }]);
    }
  }

  const media = document.createElement('div');
  media.className = 'video-inline-media';
  block.replaceChildren(media);

  if (!link) {
    if (picture) media.append(picture);
    return;
  }

  let url;
  try {
    url = new URL(link.href, window.location.href);
  } catch {
    url = null;
  }
  const youtubeId = url ? getYoutubeId(url) : '';

  if (youtubeId) {
    block.classList.add('video-inline-youtube');
    const title = `YouTube video: ${label}`;
    if (picture) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'video-inline-poster';
      button.setAttribute('aria-label', `Play video: ${label}`);
      picture.querySelector('img')?.setAttribute('alt', '');
      button.append(picture, createPlayIcon());
      button.addEventListener('click', () => {
        const iframe = createYoutubeIframe(youtubeId, title, true);
        button.replaceWith(iframe);
        iframe.focus();
      }, { once: true });
      media.append(button);
    } else {
      const observer = new IntersectionObserver((entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        media.append(createYoutubeIframe(youtubeId, title, false));
      }, { rootMargin: '200px' });
      observer.observe(block);
    }
    return;
  }

  if (url && /\.(mp4|webm)$/i.test(url.pathname)) {
    block.classList.add('video-inline-file');
    const video = document.createElement('video');
    video.controls = true;
    video.preload = 'none';
    video.playsInline = true;
    video.setAttribute('aria-label', label);
    const posterImg = picture?.querySelector('img');
    if (posterImg) video.poster = posterImg.currentSrc || posterImg.src;
    const source = document.createElement('source');
    source.src = url.href;
    source.type = `video/${url.pathname.split('.').pop().toLowerCase()}`;
    video.append(source);
    media.append(video);
    return;
  }

  // link out: the video plays on its source page
  block.classList.add('video-inline-link');
  const a = document.createElement('a');
  a.href = link.href;
  a.className = 'video-inline-poster';
  const host = url ? url.hostname.replace(/^www\./, '') : '';
  a.setAttribute('aria-label', `Watch video${host ? ` on ${host}` : ''}: ${label}`);
  if (picture) {
    picture.querySelector('img')?.setAttribute('alt', '');
    a.append(picture, createPlayIcon());
    media.append(a);
  } else {
    block.classList.add('video-inline-text');
    a.removeAttribute('aria-label');
    a.textContent = link.textContent.trim() || link.href;
    media.append(a);
  }
}
