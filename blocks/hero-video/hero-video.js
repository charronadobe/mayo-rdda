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
    if (video.paused) {
      // eslint-disable-next-line no-use-before-define
      attachSource(video);
      video.play().catch(() => {});
    } else video.pause();
  });
  video.addEventListener('play', setState);
  video.addEventListener('pause', setState);
  setState();
  return button;
}

/**
 * Adds the video source on first use, so the video only downloads when it is needed.
 */
function attachSource(video) {
  if (video.querySelector('source')) return;
  const source = document.createElement('source');
  source.src = video.dataset.src;
  source.type = videoType(video.dataset.src);
  video.append(source);
  video.load();
}

/**
 * Builds the background video without a source or poster: the poster picture underneath is
 * the LCP image, and the video fades in over it once it is actually playing.
 */
function buildVideo(href) {
  const video = document.createElement('video');
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.setAttribute('muted', '');
  video.setAttribute('loop', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('preload', 'none');
  video.setAttribute('aria-hidden', 'true');
  video.dataset.src = href;
  video.addEventListener('playing', () => video.classList.add('is-ready'), { once: true });
  return video;
}

/**
 * Starts the video after the page has loaded (outside the LCP window), unless the
 * visitor prefers reduced motion or has data saver on.
 */
function autoplayAllowed() {
  const saveData = navigator.connection && navigator.connection.saveData;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return !saveData && !reduceMotion;
}

function startWhenIdle(video) {
  if (!autoplayAllowed()) return;
  const start = () => setTimeout(() => {
    if (video.dataset.userPaused) return;
    attachSource(video);
    video.setAttribute('autoplay', '');
    video.play().catch(() => {});
  }, 3000);
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
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
    const img = picture.querySelector('img');
    if (img) {
      // the poster is the largest paint: fetch it first
      img.loading = 'eager';
      img.fetchPriority = 'high';
    }
    media.append(picture);
  }

  let video = null;
  if (videoHref) {
    video = buildVideo(videoHref);
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
    const toggle = buildToggle(video);
    toggle.addEventListener('click', () => {
      if (video.paused) video.dataset.userPaused = 'true';
      else delete video.dataset.userPaused;
    });
    // without autoplay the visitor gets a Play button; otherwise the control appears
    // once the video is actually playing (a missing or expired video keeps the poster)
    toggle.hidden = autoplayAllowed();
    video.addEventListener('playing', () => { toggle.hidden = false; }, { once: true });
    block.append(toggle);
    startWhenIdle(video);
  }
}
