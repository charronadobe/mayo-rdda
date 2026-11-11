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
    ]);
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

    // Strip tracking / framework attributes
    element.querySelectorAll('[onclick], [data-track], [data-analytics], [data-cmp-data-layer]').forEach((el) => {
      el.removeAttribute('onclick');
      el.removeAttribute('data-track');
      el.removeAttribute('data-analytics');
      el.removeAttribute('data-cmp-data-layer');
    });
  }
}
