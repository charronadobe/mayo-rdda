/* eslint-disable */
/* global WebImporter */

/**
 * Mayo Clinic cleanup transformer.
 * Removes non-authorable chrome: global header, footer, alerts, skip links,
 * feedback/tracking widgets, iframes and framework artifacts.
 * Selectors are taken from migration-work/cleaned.html.
 */
export default function transform(hookName, element, payload) {
  if (hookName === 'beforeTransform') {
    // Elements that could interfere with block matching
    WebImporter.DOMUtils.remove(element, [
      // Global alert banners (empty ul in captured DOM)
      '.cmp-global-alerts',
      // Skip links (global and "Skip this Section" in alphabet facet)
      '.cmp-skip-to-main',
      // Feedback widget (Medallia/Kampyle)
      '#kampyleButtonContainer',
      '.kampyle_feedback-button',
      // Next.js route announcer
      'next-route-announcer',
      // Tracking / text-zoom iframes
      'iframe',
      // Decorative horizontal rule between sections (would create a stray section break)
      '.cmp-separator',
      // Decorative chevron icons (inline data-URI SVGs) inside A-Z letter links
      '.cmp-alphabet-facet .cmp-icon',
      // Breadcrumb: navigation chrome generated from the page path (diseases-conditions)
      '.cmp-breadcrumb',
      // Empty right-hand aside column (no text or media)
      '#main-content aside',
      // A-Z index pages: advertisement wrapper and the advertising disclaimer
      // ("Mayo Clinic does not endorse...", Advertising & Sponsorship links)
      // that sit next to the aside in the right-hand column
      '.cmp-advertisement__wrapper',
      '#advertising-disclaimer',
      // Some letter pages (e.g. O, S, X) render the disclaimer as a link list in its own container
      '.cmp-container--column-padding-3x:has(> .aem-GridColumn > .cmp-link-list-from-model a[href*="/about-this-site/advertising-sponsorship"])',
    ]);

    // A-Z index pages: "Back to top" links after each letter group
    element.querySelectorAll('.cmp-azresults a.cmp-back-to-top').forEach((a) => {
      const wrapper = a.closest('.cmp-link') || a;
      wrapper.remove();
    });
  }

  if (hookName === 'afterTransform') {
    WebImporter.DOMUtils.remove(element, [
      // Global header wrapper
      'div.aem-page.page > div:nth-child(1) > div:nth-child(2)',
      '#header__container',
      'header',
      // Footer
      '#cmp-footer',
      'footer',
      // Remaining nav and non-authorable elements
      'nav',
      'script',
      'style',
      'noscript',
      'link',
    ]);

    // The A-Z index and search results pages only exist on mayoclinic.org:
    // make links to them absolute (e.g. the homepage letter list)
    element.querySelectorAll('a[href^="/diseases-conditions/index"], a[href^="/diseases-conditions/search-results"]').forEach((a) => {
      const href = a.getAttribute('href');
      const absolute = `https://www.mayoclinic.org${href}`;
      a.setAttribute('href', absolute);
      if (a.textContent.trim() === href) a.textContent = absolute;
    });

    // A-Z letter links point to the migrated letter pages on this site
    // (/diseases-conditions/index?letter=A -> /health-library/diseases-conditions/a, '#' -> other)
    element.querySelectorAll('a[href*="/diseases-conditions/index?letter="]').forEach((a) => {
      const url = new URL(a.getAttribute('href'), 'https://www.mayoclinic.org');
      if (url.hostname !== 'www.mayoclinic.org' || url.pathname !== '/diseases-conditions/index') return;
      const letter = (url.searchParams.get('letter') || '').trim().toLowerCase();
      if (!letter) return;
      a.setAttribute('href', `/health-library/diseases-conditions/${/^[a-z]$/.test(letter) ? letter : 'other'}`);
    });

    // A-Z index pages: normalize the condition list (.cmp-azresults) into
    // clean default content: bare <h2> letter headings followed by <ul> lists.
    element.querySelectorAll('.cmp-azresults').forEach((az) => {
      const doc = az.ownerDocument;

      // Condition pages only exist on mayoclinic.org: absolutize root-relative links
      az.querySelectorAll('a[href^="/"]:not([href^="//"])').forEach((a) => {
        const href = a.getAttribute('href');
        const absolute = `https://www.mayoclinic.org${href}`;
        a.setAttribute('href', absolute);
        if (a.textContent.trim() === href) a.textContent = absolute;
      });

      // Letter headings: unwrap div.cmp-result-letters > h2
      az.querySelectorAll('.cmp-result-letters').forEach((wrap) => {
        const h2 = wrap.querySelector('h2');
        if (!h2) { wrap.remove(); return; }
        const heading = doc.createElement('h2');
        heading.textContent = h2.textContent.trim();
        wrap.replaceWith(heading);
      });

      az.querySelectorAll('ul > li').forEach((li) => {
        const cleanLink = (a) => {
          const link = doc.createElement('a');
          link.setAttribute('href', a.getAttribute('href'));
          link.textContent = a.textContent.trim();
          return link;
        };
        const alias = li.querySelector('.cmp-results-with-primary-name');
        if (alias) {
          // Alias item: label <br> See <a>
          const label = alias.querySelector('.cmp-results-with-primary-name__label');
          const a = alias.querySelector('a[href]');
          li.textContent = '';
          if (label) li.append(doc.createTextNode(label.textContent.trim()));
          if (a) {
            if (label) li.append(doc.createElement('br'));
            li.append(doc.createTextNode('See '), cleanLink(a));
          }
          return;
        }
        // Primary item: just the link to the condition
        const a = li.querySelector('a[href]');
        if (a) {
          li.textContent = '';
          li.append(cleanLink(a));
        }
      });

      // Strip list attributes
      az.querySelectorAll('ul, li').forEach((el) => {
        [...el.attributes].forEach((attr) => el.removeAttribute(attr.name));
      });
    });

    // Strip tracking / framework attributes
    element.querySelectorAll('[onclick], [data-track], [data-analytics], [data-cmp-data-layer]').forEach((el) => {
      el.removeAttribute('onclick');
      el.removeAttribute('data-track');
      el.removeAttribute('data-analytics');
      el.removeAttribute('data-cmp-data-layer');
    });
  }
}
