/**
 * Section nav for a set of sibling pages (condition tabs).
 * Authored rows, one cell each:
 * - first row without a link: the nav title (condition name)
 * - later rows without a link: the current page (marked aria-current)
 * - rows with a link: sibling pages (a link to the current URL is also marked current)
 * On desktop the block sits in a sticky left rail of a "split" section;
 * on mobile a copy is repeated at the end of the section, as on the source.
 * @param {Element} block
 */

function isCurrentUrl(href) {
  try {
    const url = new URL(href, window.location.href);
    const strip = (path) => path.replace(/\/$/, '');
    return url.origin === window.location.origin
      && strip(url.pathname) === strip(window.location.pathname);
  } catch {
    return false;
  }
}

function plainLink(a) {
  a.classList.remove('button', 'primary', 'secondary', 'accent');
  a.removeAttribute('title');
  a.className = 'cards-side-nav-link';
  return a;
}

export default function decorate(block) {
  const rows = [...block.children];
  const nav = document.createElement('nav');
  const ul = document.createElement('ul');
  let title = '';

  rows.forEach((row, index) => {
    const text = row.textContent.trim();
    const link = row.querySelector('a[href]');
    if (!text && !link) return;

    if (index === 0 && !link) {
      title = text;
      const p = document.createElement('p');
      p.className = 'cards-side-nav-title';
      p.textContent = text;
      nav.append(p);
      return;
    }

    const li = document.createElement('li');
    li.className = 'cards-side-nav-item';
    if (link && !isCurrentUrl(link.href)) {
      li.append(plainLink(link));
    } else {
      const current = document.createElement('span');
      current.className = 'cards-side-nav-current';
      current.setAttribute('aria-current', 'page');
      current.textContent = link ? link.textContent.trim() : text;
      li.classList.add('cards-side-nav-item-current');
      li.append(current);
    }
    ul.append(li);
  });

  nav.setAttribute('aria-label', title ? `${title} pages` : 'Section pages');
  nav.append(ul);
  block.replaceChildren(nav);

  // desktop: the nav spans every row of the split section (see CSS)
  const wrapper = block.parentElement;
  const section = block.closest('.section');
  if (!section || !wrapper || wrapper.parentElement !== section) return;
  section.style.setProperty('--cards-side-nav-rows', section.children.length + 1);

  // mobile: repeat the nav after the article (hidden on desktop)
  const repeat = wrapper.cloneNode(true);
  repeat.classList.add('cards-side-nav-repeat');
  const repeatNav = repeat.querySelector('nav');
  repeatNav.setAttribute('aria-label', `${nav.getAttribute('aria-label')} (end of article)`);
  section.append(repeat);
}
