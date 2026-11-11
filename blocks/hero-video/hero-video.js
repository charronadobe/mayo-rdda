const VIDEO_EXT = /\.(mp4|webm|mov|m4v|ogg)(\?|#|$)/i;

function isVideoUrl(href) {
  if (!href) return false;
  try {
    const url = new URL(href, window.location.href);
    return VIDEO_EXT.test(url.pathname) || VIDEO_EXT.test(href);
  } catch (e) {
    return false;
  }
}

function videoType(href) {
  const match = href.match(/\.(mp4|webm|mov|m4v|ogg)(\?|#|$)/i);
  if (!match) return 'video/mp4';
  const ext = match[1].toLowerCase();
  if (ext === 'webm') return 'video/webm';
  if (ext === 'ogg') return 'video/ogg';
  return 'video/mp4';
}

function buildToggle(video) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'hero-video-toggle';

  const setState = () => {
    const playing = !video.paused;
    button.setAttribute('aria-label', playing ? 'Pause background video' : 'Play background video');
    button.setAttribute('aria-pressed', playing ? 'false' : 'true');
    button.classList.toggle('is-paused', !playing);
  };

  button.addEventListener('click', () => {
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  });
  video.addEventListener('play', setState);
  video.addEventListener('pause', setState);
  setState();
  return button;
}

function buildVideo(href, poster) {
  const video = document.createElement('video');
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.setAttribute('muted', '');
  video.setAttribute('loop', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('preload', 'metadata');
  video.setAttribute('aria-hidden', 'true');
  if (poster) video.poster = poster;

  const source = document.createElement('source');
  source.src = href;
  source.type = videoType(href);
  video.append(source);
  return video;
}

/**
 * Hero with a full-bleed background video (optional poster image) and overlaid
 * headline + CTAs. Rows: media (video link and/or picture), then content.
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.children];
  let videoHref = null;
  let picture = null;
  const mediaRows = [];

  rows.forEach((row) => {
    const links = [...row.querySelectorAll('a[href]')];
    const videoLink = links.find((a) => isVideoUrl(a.href));
    const hasHeading = row.querySelector('h1, h2, h3, h4, h5, h6');
    if (!hasHeading && (videoLink || row.querySelector('picture'))) {
      if (videoLink && !videoHref) videoHref = videoLink.href;
      if (!picture) picture = row.querySelector('picture');
      mediaRows.push(row);
    } else if (videoLink && !videoHref) {
      // video link authored inside the content cell
      videoHref = videoLink.href;
      const p = videoLink.closest('p');
      if (p && p.textContent.trim() === videoLink.textContent.trim()) p.remove();
      else videoLink.remove();
    }
  });

  const media = document.createElement('div');
  media.className = 'hero-video-media';

  if (picture) {
    picture.classList.add('hero-video-poster');
    media.append(picture);
  }

  let video = null;
  if (videoHref) {
    const posterImg = picture?.querySelector('img');
    video = buildVideo(videoHref, posterImg?.currentSrc || posterImg?.src);
    media.append(video);
    block.classList.add('has-video');
  }

  mediaRows.forEach((row) => row.remove());

  const content = document.createElement('div');
  content.className = 'hero-video-content';
  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      while (cell.firstChild) content.append(cell.firstChild);
    });
    row.remove();
  });

  block.textContent = '';
  block.append(media, content);

  if (video) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const toggle = buildToggle(video);
    block.append(toggle);
    if (!reduceMotion) {
      video.setAttribute('autoplay', '');
      video.play().catch(() => {});
    }
  }
}
