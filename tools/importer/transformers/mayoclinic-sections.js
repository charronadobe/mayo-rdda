/* eslint-disable */
/* global WebImporter */

/**
 * Mayo Clinic sections transformer.
 * beforeTransform: inserts <hr> section breaks (while parser targets still exist)
 *   and marks breaks of styled sections with a temporary data-excat-section-id.
 * afterTransform: inserts Section Metadata blocks for styled sections and
 *   removes temporary markers.
 */
const MARKER_ATTR = 'data-excat-section-id';

function findSectionElement(root, section) {
  const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
  for (const sel of selectors) {
    if (!sel) continue;
    try {
      const el = root.querySelector(sel);
      if (el) return el;
    } catch (e) {
      // invalid selector in this environment; try next
    }
  }
  return null;
}

export default function transform(hookName, element, payload) {
  const template = payload && payload.template;
  const sections = template && template.sections;
  if (!sections || sections.length < 2) return;
  const doc = element.ownerDocument || document;

  if (hookName === 'beforeTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const el = findSectionElement(element, section);
      if (!el) continue;
      const isFirst = i === 0;
      if (isFirst && !section.style) continue;
      const hr = doc.createElement('hr');
      if (section.style) hr.setAttribute(MARKER_ATTR, section.id);
      if (isFirst) hr.setAttribute('data-excat-first-section', 'true');
      el.parentNode.insertBefore(hr, el);
    }
  }

  if (hookName === 'afterTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section.style) continue;
      const marker = element.querySelector(`hr[${MARKER_ATTR}="${section.id}"]`);
      if (!marker) continue;

      // Find the last node of this section: everything after the marker up to the next <hr>
      let last = marker;
      let next = marker.nextSibling;
      while (next && !(next.nodeType === 1 && next.tagName === 'HR')) {
        last = next;
        next = next.nextSibling;
      }

      const meta = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      if (last.nextSibling) {
        last.parentNode.insertBefore(meta, last.nextSibling);
      } else {
        last.parentNode.appendChild(meta);
      }

      if (marker.hasAttribute('data-excat-first-section')) {
        marker.remove();
      } else {
        marker.removeAttribute(MARKER_ATTR);
      }
    }
  }
}
