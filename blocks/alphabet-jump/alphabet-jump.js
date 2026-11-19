/**
 * Alphabet jump: a row of letter buttons that jump to the letter headings of its section.
 *
 * Authored content: one cell with a list of letters (A, B, C ... Z) as plain text. Letters are
 * linked here, at render time, to the section heading (h2/h3) with the same text, so the document
 * holds no #anchor links; letters without a heading are shown greyed out.
 *
 * The block also tidies the letter lists that follow it in the section: alias entries
 * ("Name<br>See <a>Target</a>") get their "See" line wrapped for styling, and each letter group
 * ends with a "Back to top" link to the jump list.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const section = block.closest('.section') || block.closest('main') || document.body;
  const headings = [...section.querySelectorAll('h2, h3')].filter((h) => !block.contains(h));
  const letters = [...block.querySelectorAll('li')]
    .map((li) => li.textContent.trim())
    .filter(Boolean);

  // the heading just before the block ("Jump to a letter") names the list and is the
  // "Back to top" target
  const wrapper = block.parentElement;
  const before = wrapper && wrapper.previousElementSibling;
  const title = before && before.lastElementChild && /^H[1-6]$/.test(before.lastElementChild.tagName)
    ? before.lastElementChild : null;

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', title ? title.textContent.trim() : 'Jump to a letter');
  const ul = document.createElement('ul');
  const groups = [];
  letters.forEach((letter) => {
    const li = document.createElement('li');
    const target = headings
      .find((h) => h.id && h.textContent.trim().toUpperCase() === letter.toUpperCase());
    if (target) {
      const a = document.createElement('a');
      a.href = `#${target.id}`;
      a.textContent = letter;
      li.append(a);
      groups.push(target);
    } else {
      const span = document.createElement('span');
      span.textContent = letter;
      span.setAttribute('aria-disabled', 'true');
      li.append(span);
      li.classList.add('inactive');
    }
    ul.append(li);
  });
  nav.append(ul);
  block.replaceChildren(nav);

  if (!block.id) block.id = 'alphabet-jump';
  const topId = title && title.id ? title.id : block.id;

  groups.forEach((heading) => {
    const list = heading.nextElementSibling;
    if (!list || !/^(UL|OL)$/.test(list.tagName)) return;
    list.classList.add('alphabet-jump-list');
    // alias entries: everything after the <br> is the "See <a>Target</a>" line
    list.querySelectorAll(':scope > li').forEach((li) => {
      const br = li.querySelector(':scope > br');
      if (!br) return;
      const see = document.createElement('span');
      see.className = 'alphabet-jump-see';
      while (br.nextSibling) see.append(br.nextSibling);
      br.replaceWith(see);
      const label = document.createElement('span');
      label.className = 'alphabet-jump-alias';
      while (li.firstChild && li.firstChild !== see) label.append(li.firstChild);
      li.prepend(label);
    });
    const back = document.createElement('p');
    back.className = 'alphabet-jump-top';
    const a = document.createElement('a');
    a.href = `#${topId}`;
    a.textContent = 'Back to top';
    back.append(a);
    list.after(back);
  });
}
