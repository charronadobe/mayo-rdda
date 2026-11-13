const VISIBLE_COUNT = 6;
let instance = 0;

/**
 * Single column of related links, collapsed after 6 items with a
 * "Show N more" toggle. Each authored row holds one cell with a link.
 * @param {Element} block
 */
export default function decorate(block) {
  instance += 1;
  const ul = document.createElement('ul');
  ul.id = `cards-show-more-list-${instance}`;

  [...block.children].forEach((row) => {
    if (!row.textContent.trim()) return;
    const li = document.createElement('li');
    li.className = 'cards-show-more-item';
    const cells = [...row.children];
    cells.forEach((cell) => {
      cell.className = 'cards-show-more-body';
      li.append(cell);
    });
    li.querySelectorAll('a[href]').forEach((a) => {
      a.classList.remove('button', 'primary', 'secondary', 'accent');
      a.classList.add('cards-show-more-link');
      a.closest('.button-wrapper, .button-container')?.classList.remove('button-wrapper', 'button-container');
    });
    ul.append(li);
  });

  block.replaceChildren(ul);

  const extra = [...ul.children].slice(VISIBLE_COUNT);
  if (!extra.length) return;

  const showLabel = `Show ${extra.length} more`;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'cards-show-more-toggle';
  button.setAttribute('aria-controls', ul.id);

  const setExpanded = (expanded) => {
    button.setAttribute('aria-expanded', String(expanded));
    button.textContent = expanded ? 'Show less' : showLabel;
    extra.forEach((li) => { li.hidden = !expanded; });
  };

  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') !== 'true';
    setExpanded(expanded);
    if (expanded) extra[0].querySelector('a[href]')?.focus();
  });

  setExpanded(false);
  block.append(button);
}
