/**
 * Single text disclosure ("Show references", "Show transcript").
 * Each authored row has two cells: the label and the body.
 * Rendered as native details/summary, collapsed by default.
 * @param {Element} block
 */
export default function decorate(block) {
  const items = [...block.children].map((row) => {
    const [labelCell, bodyCell] = row.children;
    const label = labelCell?.textContent.trim();
    if (!label && !bodyCell?.textContent.trim()) return null;

    const details = document.createElement('details');
    details.className = 'accordion-toggle-item';

    const summary = document.createElement('summary');
    summary.className = 'accordion-toggle-label';
    const text = document.createElement('span');
    text.textContent = label || 'Show more';
    summary.append(text);

    const body = bodyCell || document.createElement('div');
    body.className = 'accordion-toggle-body';

    details.append(summary, body);
    return details;
  }).filter(Boolean);

  block.replaceChildren(...items);
}
