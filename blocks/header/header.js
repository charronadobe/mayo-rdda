// desktop navigation (megamenu) at 1200px and up
const isDesktop = window.matchMedia('(width >= 1200px)');

/**
 * Fetches the nav fragment: /content first (local preview), then the site root (DA/EDS).
 * @returns {Promise<Element|null>} a container holding the fragment's section divs
 */
async function fetchNav() {
  // local preview pages live under /content; DA/EDS serves the fragment at the site root.
  // Asking for the right one first avoids a 404 in the console on every page.
  const local = window.location.pathname.startsWith('/content/');
  let resp = local ? await fetch('/content/nav.plain.html') : await fetch('/nav.plain.html');
  if (!resp.ok) resp = local ? await fetch('/nav.plain.html') : await fetch('/content/nav.plain.html');
  if (!resp.ok) return null;
  const html = await resp.text();
  const container = document.createElement('div');
  container.innerHTML = html;
  return container;
}

/**
 * Creates an element with optional class names and attributes.
 */
function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
  return node;
}

/**
 * Splits a label into two balanced lines (the source shows menu labels on two lines).
 * @param {string} text the label
 * @returns {string[]} one or two lines
 */
function balanceLines(text) {
  const words = text.trim().split(/\s+/);
  if (words.length < 2) return [text.trim()];
  let best = null;
  for (let i = 1; i < words.length; i += 1) {
    const first = words.slice(0, i).join(' ');
    const second = words.slice(i).join(' ');
    const score = Math.max(first.length, second.length);
    if (!best || score < best.score) best = { score, lines: [first, second] };
  }
  return best.lines;
}

function icon(name) {
  return el('span', `nav-icon nav-icon-${name}`, { 'aria-hidden': 'true' });
}

/**
 * Builds one megamenu panel from an authored list item.
 * Column items hold an optional bold heading and a list of links;
 * an item with an image becomes the featured card.
 */
function buildPanel(columns, id) {
  const panel = el('div', 'nav-panel', { id });
  const inner = el('div', 'nav-panel-inner');
  [...columns.children].forEach((col) => {
    const img = col.querySelector('img');
    if (img) {
      const links = [...col.querySelectorAll('a')];
      const imageLink = links.find((a) => a.contains(img)) || links[0];
      const titleLink = links.find((a) => !a.contains(img));
      const card = el('div', 'nav-card');
      const media = el('a', 'nav-card-media', { href: imageLink.getAttribute('href'), tabindex: '-1', 'aria-hidden': 'true' });
      img.loading = 'lazy';
      media.append(img);
      card.append(media);
      if (titleLink) {
        const title = el('a', 'nav-card-title', { href: titleLink.getAttribute('href') });
        title.append(el('span', '', {}), icon('chevron-right'));
        title.firstChild.textContent = titleLink.textContent.trim();
        card.append(title);
      }
      inner.append(card);
      return;
    }
    const column = el('div', 'nav-panel-column');
    const heading = col.querySelector(':scope > p > strong, :scope > strong');
    if (heading) {
      const h2 = el('h2', 'nav-panel-heading');
      h2.textContent = heading.textContent.trim();
      column.append(h2);
    }
    const list = col.querySelector('ul');
    if (list) {
      const ul = el('ul', 'nav-panel-links');
      [...list.querySelectorAll(':scope > li')].forEach((li) => {
        const a = li.querySelector('a');
        if (!a) return;
        const item = el('li');
        const link = el('a', '', { href: a.getAttribute('href') });
        link.textContent = a.textContent.trim();
        item.append(link);
        ul.append(item);
      });
      column.append(ul);
    }
    inner.append(column);
  });
  panel.append(inner);
  return panel;
}

// panel visibility follows the trigger's aria-expanded state (see header.css)
function closePanels(nav) {
  nav.querySelectorAll('.nav-drop-trigger[aria-expanded="true"]').forEach((btn) => {
    btn.setAttribute('aria-expanded', 'false');
  });
}

function openPanel(nav, btn) {
  closePanels(nav);
  btn.setAttribute('aria-expanded', 'true');
}

/**
 * Builds the menu triggers and panels from the authored sections list.
 */
function buildSections(section) {
  const wrapper = el('div', 'nav-sections');
  const list = section.querySelector('ul');
  if (!list) return wrapper;
  const ul = el('ul', 'nav-sections-list');
  [...list.querySelectorAll(':scope > li')].forEach((li, i) => {
    const labelNode = li.querySelector(':scope > p') || li.firstChild;
    const label = (labelNode?.textContent || '').trim();
    const columns = li.querySelector(':scope > ul');
    const item = el('li', 'nav-drop');
    if (!columns) {
      const a = li.querySelector('a');
      if (a) item.append(a);
      ul.append(item);
      return;
    }
    const id = `nav-panel-${i}`;
    const btn = el('button', 'nav-drop-trigger', { type: 'button', 'aria-expanded': 'false', 'aria-controls': id });
    const text = el('span', 'nav-drop-label');
    balanceLines(label).forEach((line, idx) => {
      if (idx) text.append(' ');
      const span = el('span', 'nav-drop-line');
      span.textContent = line;
      text.append(span);
    });
    btn.append(text, icon('chevron-down'));
    item.append(btn, buildPanel(columns, id));
    ul.append(item);
  });
  wrapper.append(ul);
  return wrapper;
}

/**
 * Builds utility links and the search control from the authored tools list.
 * The item whose link text is "Search" becomes the search toggle; its second
 * paragraph is the input placeholder and its link is the results page.
 */
function buildTools(section, nav) {
  const tools = el('div', 'nav-tools');
  const ul = el('ul', 'nav-tools-list');
  let search = null;
  [...(section?.querySelectorAll(':scope ul > li') || [])].forEach((li) => {
    const a = li.querySelector('a');
    if (!a) return;
    const item = el('li');
    const text = a.textContent.trim();
    if (/^search$/i.test(text)) {
      const placeholder = [...li.querySelectorAll('p')].map((p) => p.textContent.trim()).find((t) => t && t !== text) || text;
      const toggle = el('button', 'nav-search-toggle', {
        type: 'button', 'aria-label': text, 'aria-expanded': 'false', 'aria-controls': 'nav-search',
      });
      toggle.append(icon('magnifier'));
      item.append(toggle);
      search = {
        action: a.getAttribute('href'), label: text, placeholder, toggle,
      };
    } else {
      const link = el('a', '', { href: a.getAttribute('href') });
      if (/register|log in|account/i.test(text)) {
        link.classList.add('nav-account');
        link.append(icon('user'));
      }
      link.append(document.createTextNode(text));
      item.append(link);
    }
    ul.append(item);
  });
  tools.append(ul);

  if (search) {
    const box = el('div', 'nav-search', { id: 'nav-search' });
    box.hidden = true;
    const form = el('form', 'nav-search-form', { action: search.action, method: 'get', role: 'search' });
    const field = el('label', 'nav-search-field');
    const input = el('input', '', {
      type: 'search', name: 'q', placeholder: search.placeholder, 'aria-label': search.placeholder, autocomplete: 'off',
    });
    field.append(icon('magnifier'), input);
    form.append(field);
    const close = el('button', 'nav-search-close', { type: 'button', 'aria-label': `Close ${search.label.toLowerCase()}` });
    close.append(icon('close'));
    box.append(form, close);

    const setSearch = (open) => {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, false);
      nav.classList.toggle('search-open', open);
      box.hidden = !open;
      search.toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) input.focus();
      else search.toggle.focus();
    };
    search.toggle.addEventListener('click', () => setSearch(true));
    close.addEventListener('click', () => setSearch(false));
    nav.closeSearch = () => { if (nav.classList.contains('search-open')) setSearch(false); };
    return [tools, box];
  }
  return [tools];
}

/**
 * Builds the mobile-only quick links (icon tiles) from an authored list of
 * links that each contain an icon image.
 */
function buildQuickLinks(section) {
  const quick = el('div', 'nav-quick');
  const ul = el('ul', 'nav-quick-list');
  [...(section?.querySelectorAll('li') || [])].forEach((li) => {
    const a = li.querySelector('a');
    if (!a) return;
    const link = el('a', '', { href: a.getAttribute('href') });
    const img = a.querySelector('img');
    if (img) {
      img.setAttribute('aria-hidden', 'true');
      link.append(img);
    }
    const label = el('span', 'nav-quick-label');
    label.textContent = a.textContent.trim();
    link.append(label);
    const item = el('li');
    item.append(link);
    ul.append(item);
  });
  quick.append(ul);
  return quick;
}

/**
 * Opens or closes the mobile menu.
 */
function toggleMenu(nav, force) {
  const btn = nav.querySelector('.nav-hamburger');
  const open = typeof force === 'boolean' ? force : nav.getAttribute('aria-expanded') !== 'true';
  nav.setAttribute('aria-expanded', open ? 'true' : 'false');
  if (btn) {
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
  }
  if (!open) closePanels(nav);
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const fragment = await fetchNav();
  block.textContent = '';
  if (!fragment) return;

  const [brandSection, menuSection, toolsSection, quickSection] = fragment.querySelectorAll(':scope > div');
  const nav = el('nav', '', { id: 'nav', 'aria-label': 'Primary', 'aria-expanded': 'false' });

  // brand section: the link with an image is the logo; a text-only link is the skip link
  // (Document Authoring may rewrite its #anchor href, so it always targets the main content)
  const brandLinks = [...(brandSection?.querySelectorAll('a') || [])];
  const skip = brandLinks.find((a) => !a.querySelector('img'));
  if (skip) {
    const main = document.querySelector('main');
    const href = skip.getAttribute('href') || '';
    const target = href.startsWith('#') && href.length > 1 ? href.slice(1) : 'main';
    if (main && !document.getElementById(target)) main.id = target;
    const skipLink = el('a', 'nav-skip', { href: `#${target}` });
    skipLink.textContent = skip.textContent.trim();
    block.before(skipLink);
  }

  const brand = el('div', 'nav-brand');
  const logoLink = brandLinks.find((a) => a.querySelector('img'));
  if (logoLink) {
    const link = el('a', '', { href: logoLink.getAttribute('href') || '/', 'aria-label': logoLink.querySelector('img')?.alt || 'Home' });
    link.append(...logoLink.childNodes);
    brand.append(link);
  }

  const sections = menuSection ? buildSections(menuSection) : el('div', 'nav-sections');
  // mobile menu: quick links above the sections; on desktop it only holds the sections
  const menu = el('div', 'nav-menu', { id: 'nav-menu' });
  if (quickSection) menu.append(buildQuickLinks(quickSection));
  menu.append(sections);

  const hamburger = el('button', 'nav-hamburger', {
    type: 'button', 'aria-controls': 'nav-menu', 'aria-expanded': 'false', 'aria-label': 'Menu',
  });
  hamburger.append(icon('menu'), icon('close'));
  hamburger.addEventListener('click', () => toggleMenu(nav));

  const row = el('div', 'nav-row');
  row.append(brand, menu, ...buildTools(toolsSection, nav), hamburger);
  nav.append(row);

  // menu triggers: desktop shows one panel at a time; mobile sections expand independently
  nav.querySelectorAll('.nav-drop-trigger').forEach((btn) => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      if (!isDesktop.matches) btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      else if (expanded) closePanels(nav);
      else openPanel(nav, btn);
    });
  });

  const overlay = el('div', 'nav-overlay', { 'aria-hidden': 'true' });
  overlay.addEventListener('click', () => closePanels(nav));

  const navWrapper = el('div', 'nav-wrapper');
  navWrapper.append(nav);
  block.append(navWrapper, overlay);

  document.addEventListener('click', (e) => {
    if (isDesktop.matches && !block.contains(e.target)) closePanels(nav);
  });
  window.addEventListener('keydown', (e) => {
    if (e.code !== 'Escape') return;
    const open = nav.querySelector('.nav-drop-trigger[aria-expanded="true"]');
    if (isDesktop.matches && open) {
      closePanels(nav);
      open.focus();
    } else if (!isDesktop.matches && nav.getAttribute('aria-expanded') === 'true') {
      toggleMenu(nav, false);
      hamburger.focus();
    } else if (nav.closeSearch) {
      nav.closeSearch();
    }
  });
  // reset open state when crossing the desktop breakpoint
  isDesktop.addEventListener('change', () => {
    toggleMenu(nav, false);
    if (nav.closeSearch) nav.closeSearch();
  });
}
