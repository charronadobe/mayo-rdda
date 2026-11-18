/*
 * Fragment Block
 * Include content on a page as a fragment.
 * https://www.aem.live/developer/block-collection/fragment
 */

// eslint-disable-next-line import/no-cycle
import {
  decorateMain,
} from '../../scripts/scripts.js';

import {
  loadSections,
} from '../../scripts/aem.js';

/**
 * Fetches a fragment's .plain.html. Local preview pages live under /content, where the fragment is
 * at /content<path>; DA/EDS serves it at <path>. The right one is asked for first.
 * @param {string} path The path to the fragment
 * @returns {Promise<Response|null>}
 */
async function fetchFragment(path) {
  const local = window.location.pathname.startsWith('/content/');
  const urls = local ? [`/content${path}`, path] : [path, `/content${path}`];
  // eslint-disable-next-line no-restricted-syntax
  for (const url of urls) {
    // eslint-disable-next-line no-await-in-loop
    const resp = await fetch(`${url}.plain.html`);
    if (resp.ok) return resp;
  }
  return null;
}

/**
 * Loads a fragment.
 * @param {string} path The path to the fragment
 * @returns {Promise<HTMLElement|null>} The root element of the fragment
 */
export async function loadFragment(path) {
  if (path && path.startsWith('/') && !path.startsWith('//')) {
    const resp = await fetchFragment(path);
    if (resp) {
      const main = document.createElement('main');
      main.innerHTML = await resp.text();

      // reset base path for media to fragment base
      const resetAttributeBase = (tag, attr) => {
        main.querySelectorAll(`${tag}[${attr}^="./media_"]`).forEach((elem) => {
          elem[attr] = new URL(elem.getAttribute(attr), new URL(path, window.location)).href;
        });
      };
      resetAttributeBase('img', 'src');
      resetAttributeBase('source', 'srcset');

      decorateMain(main);
      await loadSections(main);
      return main;
    }
  }
  return null;
}

/**
 * Decorates a fragment block. A fragment that is the only content of its section takes the place of
 * that section's content and passes on its section styles (e.g. a shared "dark" banner); otherwise
 * the fragment's sections are placed inside the block.
 * @param {Element} block The fragment block
 */
export default async function decorate(block) {
  const link = block.querySelector('a');
  const path = link ? link.getAttribute('href') : block.textContent.trim();
  const fragment = await loadFragment(path);
  if (!fragment) return;

  const wrapper = block.parentElement;
  const section = block.closest('.section');
  const sections = [...fragment.querySelectorAll(':scope > .section')];
  const alone = section && wrapper && wrapper.parentElement === section
    && section.children.length === 1 && sections.length === 1;
  if (alone) {
    const [fragmentSection] = sections;
    [...fragmentSection.classList]
      .filter((c) => c !== 'section')
      .forEach((c) => section.classList.add(c));
    wrapper.replaceWith(...fragmentSection.childNodes);
  } else {
    block.replaceChildren(...fragment.childNodes);
  }
}
