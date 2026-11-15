import { createOptimizedPicture } from '../../scripts/aem.js';

const ARROW_PATHS = {
  prev: 'M30 15L5.41 15 10.71 9.71 9.29 8.29 1.59 16 9.29 23.71 10.71 22.29 5.41 17 30 17 30 15z',
  next: 'M22.71 8.29L21.29 9.71 26.59 15 2 15 2 17 26.59 17 21.29 22.29 22.71 23.71 30.41 16 22.71 8.29z',
};

let instanceCount = 0;

function isImageCell(cell) {
  return !!cell.querySelector('picture, img') && cell.textContent.trim() === '';
}

function optimizeImages(root) {
  root.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [
      { media: '(min-width: 600px)', width: '2000' },
      { width: '750' },
    ]));
  });
}

function arrowButton(direction, label) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `carousel-story-arrow carousel-story-arrow-${direction}`;
  button.setAttribute('aria-label', label);
  button.innerHTML = `<svg width="24" height="24" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><path d="${ARROW_PATHS[direction]}" fill="currentColor"/></svg>`;
  return button;
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Story carousel: one row per slide (image cell, caption cell with a paragraph and a link).
 * Pagination and prev/next controls are generated here, never authored. No autoplay.
 * @param {Element} block
 */
export default function decorate(block) {
  instanceCount += 1;
  const id = `carousel-story-${instanceCount}`;

  const track = document.createElement('ul');
  track.className = 'carousel-story-slides';
  track.id = `${id}-slides`;

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (!cells.some((cell) => cell.textContent.trim() || cell.querySelector('picture, img'))) return;
    const li = document.createElement('li');
    li.className = 'carousel-story-slide';

    const imageCell = cells.find(isImageCell);
    if (imageCell) {
      imageCell.className = 'carousel-story-slide-image';
      li.append(imageCell);
    }
    const content = cells.find((cell) => cell !== imageCell && cell.textContent.trim() !== '');
    if (content) {
      content.className = 'carousel-story-slide-content';
      content.querySelectorAll('a').forEach((a) => {
        a.classList.remove('button', 'primary', 'secondary', 'accent');
        a.closest('p')?.classList.remove('button-wrapper', 'button-container');
      });
      const links = content.querySelectorAll('a[href]');
      if (links.length) links[links.length - 1].classList.add('carousel-story-slide-link');
      li.append(content);
    }
    track.append(li);
  });

  const slides = [...track.children];
  optimizeImages(track);

  block.textContent = '';
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'carousel');
  if (!block.hasAttribute('aria-label')) block.setAttribute('aria-label', 'Stories');

  const viewport = document.createElement('div');
  viewport.className = 'carousel-story-viewport';
  viewport.append(track);
  block.append(viewport);

  slides.forEach((slide, i) => {
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${i + 1} of ${slides.length}`);
    slide.dataset.index = i;
  });

  if (slides.length < 2) {
    block.classList.add('carousel-story-single');
    return;
  }

  const controls = document.createElement('div');
  controls.className = 'carousel-story-controls';

  const dots = document.createElement('div');
  dots.className = 'carousel-story-dots';
  const dotButtons = slides.map((slide, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-story-dot';
    dot.setAttribute('aria-label', `Show slide ${i + 1} of ${slides.length}`);
    dot.setAttribute('aria-controls', track.id);
    dots.append(dot);
    return dot;
  });

  const nav = document.createElement('div');
  nav.className = 'carousel-story-nav';
  const prev = arrowButton('prev', 'Previous slide');
  const next = arrowButton('next', 'Next slide');
  prev.setAttribute('aria-controls', track.id);
  next.setAttribute('aria-controls', track.id);
  nav.append(prev, next);

  controls.append(dots, nav);
  block.append(controls);

  let current = 0;

  function setActive(index) {
    current = index;
    slides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle('active', active);
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');
      slide.inert = !active;
    });
    dotButtons.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
      if (i === index) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  }

  function goTo(index) {
    const target = (index + slides.length) % slides.length;
    const inset = parseFloat(getComputedStyle(track).scrollPaddingInlineStart) || 0;
    track.scrollTo({
      // the track is position: relative, so offsetLeft is measured from its padding edge
      left: slides[target].offsetLeft - inset,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
    setActive(target);
  }

  prev.addEventListener('click', () => goTo(current - 1));
  next.addEventListener('click', () => goTo(current + 1));
  dotButtons.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  block.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo(current - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo(current + 1);
    }
  });

  // keep state in sync when the user swipes or scrolls the track
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(Number(entry.target.dataset.index));
    });
  }, { root: track, threshold: 0.6 });
  slides.forEach((slide) => observer.observe(slide));

  setActive(0);
}
