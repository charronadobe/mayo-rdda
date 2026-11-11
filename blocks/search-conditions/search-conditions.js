import { decorateIcons } from '../../scripts/aem.js';

const MIN_CHARS = 3;
const MAX_SUGGESTIONS = 8;
const JSON_LINK = /\.json(\?|$)/i;
let instance = 0;

async function fetchIndex(source) {
  try {
    const resp = await fetch(source);
    if (!resp.ok) return [];
    const json = await resp.json();
    return Array.isArray(json?.data) ? json.data : [];
  } catch (e) {
    return [];
  }
}

function suggestionLabel(item) {
  return item.title || item.name || item.header || '';
}

/**
 * Labelled search input that submits to a results page and, when a JSON index
 * is authored, offers type-ahead suggestions after three characters.
 * Rows (all optional): label text; results page link; JSON index link; placeholder text.
 * @param {Element} block
 */
export default function decorate(block) {
  instance += 1;
  const id = `search-conditions-${instance}`;

  const links = [...block.querySelectorAll('a[href]')];
  const indexLink = links.find((a) => JSON_LINK.test(a.getAttribute('href')));
  const actionLink = links.find((a) => a !== indexLink);

  const texts = [...block.children]
    .filter((row) => !row.querySelector('a[href]'))
    .map((row) => row.textContent.trim())
    .filter(Boolean);
  const labelText = texts[0] || 'Search';
  const placeholder = texts[1] || '';

  const form = document.createElement('form');
  form.className = 'search-conditions-form';
  form.setAttribute('role', 'search');
  form.action = actionLink ? actionLink.href : '/search';
  form.method = 'get';

  const label = document.createElement('label');
  label.className = 'search-conditions-label';
  label.htmlFor = `${id}-input`;
  label.textContent = labelText;
  const hint = document.createElement('span');
  hint.className = 'search-conditions-hint';
  hint.id = `${id}-hint`;
  hint.textContent = indexLink ? ` Type ${MIN_CHARS} or more letters to display suggested search options.` : '';
  label.append(hint);

  const box = document.createElement('div');
  box.className = 'search-conditions-box';

  const icon = document.createElement('span');
  icon.className = 'icon icon-search';
  icon.setAttribute('aria-hidden', 'true');

  const input = document.createElement('input');
  input.type = 'search';
  input.name = 'q';
  input.id = `${id}-input`;
  input.className = 'search-conditions-input';
  input.autocomplete = 'off';
  if (placeholder) input.placeholder = placeholder;

  box.append(icon, input);
  form.append(label, box);

  if (indexLink) {
    const list = document.createElement('ul');
    list.className = 'search-conditions-suggestions';
    list.id = `${id}-list`;
    list.setAttribute('role', 'listbox');
    list.setAttribute('aria-label', labelText);
    list.hidden = true;
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-controls', list.id);
    box.append(list);

    let data = null;
    let active = -1;

    const close = () => {
      list.hidden = true;
      list.textContent = '';
      active = -1;
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
    };

    const setActive = (idx) => {
      const items = [...list.children];
      if (!items.length) return;
      active = (idx + items.length) % items.length;
      items.forEach((li, i) => li.setAttribute('aria-selected', i === active ? 'true' : 'false'));
      input.setAttribute('aria-activedescendant', items[active].id);
    };

    input.addEventListener('input', async () => {
      const term = input.value.trim().toLowerCase();
      if (term.length < MIN_CHARS) {
        close();
        return;
      }
      if (!data) data = await fetchIndex(indexLink.href);
      const matches = data
        .filter((item) => suggestionLabel(item).toLowerCase().includes(term))
        .slice(0, MAX_SUGGESTIONS);
      list.textContent = '';
      active = -1;
      matches.forEach((item, i) => {
        const li = document.createElement('li');
        li.id = `${id}-opt-${i}`;
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', 'false');
        const a = document.createElement('a');
        a.href = item.path || `${form.action}?q=${encodeURIComponent(suggestionLabel(item))}`;
        a.textContent = suggestionLabel(item);
        a.tabIndex = -1;
        li.append(a);
        list.append(li);
      });
      list.hidden = !matches.length;
      input.setAttribute('aria-expanded', matches.length ? 'true' : 'false');
    });

    input.addEventListener('keydown', (e) => {
      if (list.hidden) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive(active + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive(active - 1);
      } else if (e.key === 'Escape') {
        close();
      } else if (e.key === 'Enter' && active >= 0) {
        e.preventDefault();
        list.children[active].querySelector('a').click();
      }
    });

    document.addEventListener('click', (e) => {
      if (!block.contains(e.target)) close();
    });
  }

  block.textContent = '';
  block.append(form);
  decorateIcons(block);
}
