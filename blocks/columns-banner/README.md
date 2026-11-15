# columns-banner

Custom **columns** block. Purpose: a single row of columns side by side that stacks on mobile. The block JS picks one of three looks from the authored structure (no variant class needed). Text colour always comes from the section.

## Authoring (Document Authoring)

Model: `standalone`

Single block table, one row. The look depends on the cells:

- **Band** (`columns-banner-band`): H2 heading | Paragraph | CTA link (bold link, so it becomes a pill button). A cell holding only a link is what makes it a band. Pair with the `dark` section style for the navy donation band.
- **Split** (`columns-banner-split`): Optional eyebrow paragraph + H2 | Paragraph(s) + optional link paragraph. Used when one cell has no heading. Two equal columns, 80% of the page width, and the text column is vertically centred.
- **Cards** (`columns-banner-cards`): every cell is a text card with a heading (H3) + paragraph + one link per paragraph. Two equal columns, 10 of 12 page columns wide on large screens.

In split and cards, a paragraph that holds only a plain link is shown as a text link with a chevron.

## Supported variations

No variations. The look is chosen from the structure.

## Universal Editor fields

N/A (Document Authoring project)
