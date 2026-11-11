/**
 * Text and media side by side. Each row holds one cell per column; a cell
 * containing only a picture becomes the media column. Authored cell order
 * decides which side the image sits on.
 * @param {Element} block
 */
export default function decorate(block) {
  const firstRow = block.firstElementChild;
  const cols = firstRow ? [...firstRow.children] : [];
  block.classList.add(`columns-media-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    row.classList.add('columns-media-row');
    [...row.children].forEach((col, index) => {
      const pic = col.querySelector('picture');
      const onlyMedia = pic && col.textContent.trim() === ''
        && col.querySelectorAll('picture').length === 1;
      if (onlyMedia) {
        col.classList.add('columns-media-img-col');
        if (index === 0) row.classList.add('columns-media-img-first');
      } else {
        col.classList.add('columns-media-text-col');
      }
    });
  });
}
