/**
 * Fetches the footer fragment: /content first (local preview), then the site root (DA/EDS).
 * @returns {Promise<Element|null>} a container holding the fragment's section divs
 */
async function fetchFooter() {
  // local preview pages live under /content; DA/EDS serves the fragment at the site root.
  // Asking for the right one first avoids a 404 in the console on every page.
  const local = window.location.pathname.startsWith('/content/');
  let resp = local ? await fetch('/content/footer.plain.html') : await fetch('/footer.plain.html');
  if (!resp.ok) resp = local ? await fetch('/footer.plain.html') : await fetch('/content/footer.plain.html');
  if (!resp.ok) return null;
  const container = document.createElement('div');
  container.innerHTML = await resp.text();
  return container;
}

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
  return node;
}

const isIconOnly = (a) => a.querySelector('img') && !a.textContent.trim();
const isIconText = (a) => a.querySelector('img') && a.textContent.trim();

/**
 * Splits a section into groups: each heading starts a new group and owns the
 * elements that follow it; content before the first heading forms its own group.
 */
function groupsOf(section) {
  const groups = [];
  let current = null;
  [...section.children].forEach((child) => {
    if (/^H[1-6]$/.test(child.tagName)) {
      current = { heading: child, items: [] };
      groups.push(current);
    } else {
      if (!current) {
        current = { heading: null, items: [] };
        groups.push(current);
      }
      current.items.push(child);
    }
  });
  return groups;
}

/**
 * Decorates a list: icon+text links become cards, icon-only links become an icon row.
 */
function decorateList(ul) {
  const links = [...ul.querySelectorAll('a')];
  if (links.length && links.every(isIconText)) {
    ul.className = 'footer-cards';
    links.forEach((a) => {
      const img = a.querySelector('img');
      img.setAttribute('aria-hidden', 'true');
      const label = el('span', 'footer-card-label');
      label.textContent = a.textContent.trim();
      a.textContent = '';
      a.append(img, label, el('span', 'footer-chevron', { 'aria-hidden': 'true' }));
    });
  } else if (links.length && links.every(isIconOnly)) {
    const badges = links.some((a) => a.querySelector('img').alt.length > 20);
    ul.className = badges ? 'footer-badges' : 'footer-icons';
    links.forEach((a) => {
      const img = a.querySelector('img');
      a.setAttribute('aria-label', img.alt);
      if (!badges) img.alt = '';
    });
  } else {
    ul.className = 'footer-links';
  }
  return ul;
}

function buildGroup({ heading, items }) {
  const group = el('div', 'footer-group');
  if (heading) {
    heading.classList.add('footer-heading');
    const link = heading.querySelector('a');
    if (link) link.append(el('span', 'footer-chevron', { 'aria-hidden': 'true' }));
    group.append(heading);
  }
  items.forEach((item) => group.append(item.tagName === 'UL' ? decorateList(item) : item));
  return group;
}

/**
 * Turns a "Label:" paragraph followed by a list of links into a dropdown selector.
 */
function buildSelector(labelP, list) {
  const wrap = el('div', 'footer-selector');
  const id = 'footer-selector-list';
  const label = el('span', 'footer-selector-label');
  label.textContent = labelP.textContent.trim();
  const links = [...list.querySelectorAll('a')];
  const current = links.find((a) => new URL(a.href).pathname === '/') || links[0];
  const btn = el('button', 'footer-selector-toggle', {
    type: 'button', 'aria-expanded': 'false', 'aria-controls': id, 'aria-label': `${label.textContent} ${current.textContent.trim()}`,
  });
  const value = el('span', 'footer-selector-value');
  value.textContent = current.textContent.trim();
  btn.append(value, el('span', 'footer-chevron footer-chevron-down', { 'aria-hidden': 'true' }));
  list.className = 'footer-selector-list';
  list.id = id;
  links.forEach((a) => {
    a.setAttribute('dir', 'auto');
    if (a === current) a.setAttribute('aria-current', 'true');
  });
  const toggle = (open) => btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  btn.addEventListener('click', () => toggle(btn.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('click', (e) => { if (!wrap.contains(e.target)) toggle(false); });
  wrap.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
      toggle(false);
      btn.focus();
    }
  });
  wrap.append(label, btn, list);
  return wrap;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const fragment = await fetchFooter();
  block.textContent = '';
  if (!fragment) return;

  const sections = [...fragment.querySelectorAll(':scope > div')];
  // the legal band holds the sections after the last section that has headings
  const lastHeadingIdx = sections.reduce((acc, s, i) => (s.querySelector('h1,h2,h3,h4,h5,h6') ? i : acc), -1);
  const mainSections = sections.slice(0, lastHeadingIdx + 1);
  const legalSections = sections.slice(lastHeadingIdx + 1);

  // main band: link columns (headings with links), then a row of plain-heading groups
  const main = el('div', 'footer-main');
  const mainInner = el('div', 'footer-inner');
  const columns = el('div', 'footer-columns');
  const follow = el('div', 'footer-follow');
  mainSections.forEach((section) => {
    const isColumn = section.querySelector('h1 a, h2 a, h3 a, h4 a');
    if (isColumn) {
      const column = el('div', 'footer-column');
      groupsOf(section).forEach((g) => column.append(buildGroup(g)));
      columns.append(column);
    } else {
      groupsOf(section).forEach((g) => follow.append(buildGroup(g)));
    }
  });
  mainInner.append(columns);
  if (follow.children.length) mainInner.append(el('hr', 'footer-divider'), follow);
  main.append(mainInner);

  // legal band: link row, divider, then copyright and selector
  const legal = el('div', 'footer-legal');
  const legalInner = el('div', 'footer-inner');
  const bottom = el('div', 'footer-bottom');
  legalSections.forEach((section) => {
    const kids = [...section.children];
    if (kids.length === 1 && kids[0].tagName === 'UL') {
      kids[0].className = 'footer-legal-links';
      legalInner.append(kids[0]);
      return;
    }
    kids.forEach((child, i) => {
      const next = kids[i + 1];
      if (child.tagName === 'P' && child.textContent.trim().endsWith(':') && next?.tagName === 'UL') return;
      if (child.tagName === 'UL' && kids[i - 1]?.textContent.trim().endsWith(':')) {
        bottom.append(buildSelector(kids[i - 1], child));
        return;
      }
      if (child.tagName === 'P') child.classList.add('footer-copyright');
      bottom.append(child);
    });
  });
  if (bottom.children.length) legalInner.append(el('hr', 'footer-divider'), bottom);
  legal.append(legalInner);

  block.append(main, legal);
}
