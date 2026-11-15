let instance = 0;

const cellsOf = (row) => [...row.children];
const textOf = (cell) => (cell ? cell.textContent.trim() : '');

/**
 * Photo band with a heading and a doctor search form (term + location + submit)
 * that sends a GET request to a results page.
 * Rows: background picture; heading; field label | placeholder;
 * location label | default option text; one row per location: shown text | query value;
 * results page link (form action); optional search tips link.
 * @param {Element} block
 */
export default function decorate(block) {
  instance += 1;
  const id = `search-doctor-${instance}`;

  let picture = null;
  let heading = null;
  const links = [];
  const pairs = [];

  [...block.children].forEach((row) => {
    const pic = row.querySelector('picture');
    const head = row.querySelector('h1, h2, h3, h4, h5, h6');
    const link = row.querySelector('a[href]');
    if (pic && !picture) picture = pic;
    else if (head && !heading) heading = head;
    else if (link) links.push(link);
    else {
      const cells = cellsOf(row).map(textOf);
      if (cells.some(Boolean)) pairs.push(cells);
    }
  });

  const [fieldRow = [], locationRow, ...optionRows] = pairs;
  const [fieldLabel, placeholder] = fieldRow;
  const [actionLink, tipsLink] = links;

  const content = document.createElement('div');
  content.className = 'search-doctor-content';

  if (heading) {
    heading.classList.add('search-doctor-title');
    content.append(heading);
  }

  const form = document.createElement('form');
  form.className = 'search-doctor-form';
  form.setAttribute('role', 'search');
  form.method = 'get';
  form.action = actionLink ? actionLink.href : 'https://www.mayoclinic.org/appointments/find-a-doctor/search-results';
  if (heading) {
    heading.id = heading.id || `${id}-title`;
    form.setAttribute('aria-labelledby', heading.id);
  }

  const field = (labelText, control, extraClass) => {
    const wrap = document.createElement('div');
    wrap.className = `search-doctor-field ${extraClass}`;
    const label = document.createElement('label');
    label.className = 'search-doctor-label';
    label.htmlFor = control.id;
    label.textContent = labelText;
    wrap.append(label, control);
    return wrap;
  };

  const input = document.createElement('input');
  input.type = 'text';
  input.name = 'searchterm';
  input.id = `${id}-term`;
  input.className = 'search-doctor-input';
  input.required = true;
  input.autocomplete = 'off';
  input.spellcheck = false;
  if (placeholder) input.placeholder = placeholder;
  form.append(field(fieldLabel || 'Search', input, 'search-doctor-field-term'));

  let select = null;
  if (locationRow) {
    select = document.createElement('select');
    select.name = 'locations';
    select.id = `${id}-location`;
    select.className = 'search-doctor-select';
    const all = document.createElement('option');
    all.value = '';
    all.textContent = locationRow[1] || 'All locations';
    select.append(all);
    optionRows.forEach(([shown, value]) => {
      if (!shown) return;
      const opt = document.createElement('option');
      opt.value = value || shown;
      opt.textContent = shown;
      select.append(opt);
    });
    form.append(field(locationRow[0] || 'Location', select, 'search-doctor-field-location'));
  }

  const actions = document.createElement('div');
  actions.className = 'search-doctor-field search-doctor-field-submit';
  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'search-doctor-button';
  button.textContent = 'Search';
  actions.append(button);
  form.append(actions);

  form.addEventListener('submit', (e) => {
    // `required` lets a whitespace-only term through; trim and show the native message
    input.value = input.value.trim();
    if (!input.value) {
      e.preventDefault();
      input.reportValidity();
      input.focus();
      return;
    }
    // omit locations when the default (all main locations) is chosen;
    // form data is collected right after this handler, so re-enable on the next task
    if (select && !select.value) {
      select.disabled = true;
      setTimeout(() => { select.disabled = false; });
    }
  });

  content.append(form);

  if (tipsLink) {
    tipsLink.className = 'search-doctor-tips';
    content.append(tipsLink);
  }

  block.textContent = '';
  if (picture) {
    const bg = document.createElement('div');
    bg.className = 'search-doctor-background';
    bg.setAttribute('aria-hidden', 'true');
    const img = picture.querySelector('img');
    if (img) img.alt = '';
    bg.append(picture);
    block.append(bg);
  } else {
    block.classList.add('no-image');
  }
  block.append(content);
}
