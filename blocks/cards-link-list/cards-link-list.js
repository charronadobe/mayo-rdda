/**
 * Text-only link rows. Each authored row holds one cell with a link
 * (optionally a short description); rows render as a list that flows into
 * two columns on wider screens.
 * @param {Element} block
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-link-list-item';
    [...row.children].forEach((cell) => {
      cell.className = 'cards-link-list-body';
      li.append(cell);
    });

    const link = li.querySelector('a[href]');
    if (link) {
      link.classList.add('cards-link-list-link');
      link.classList.remove('button', 'primary', 'secondary');
      link.closest('.button-container')?.classList.remove('button-container');
    }

    if (li.textContent.trim()) ul.append(li);
  });

  block.textContent = '';
  block.append(ul);
}
