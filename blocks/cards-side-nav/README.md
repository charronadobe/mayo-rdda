# cards-side-nav

Custom **cards** block. Purpose: Section nav (left rail) for a set of sibling pages: the pages of a condition (Symptoms & causes, Diagnosis & treatment, Doctors & departments, Care at Mayo Clinic), or the subpages of a hub page such as International Patient Services.

## Authoring (Document Authoring)

Model: `standalone`

Single block table, one cell per row. Put the block first in a section whose Section Metadata style is `split`; the default content and blocks that follow form the article column.

- First row, plain text: the nav title.
- A row with plain text (no link): the current page (shown bold with an arrow, `aria-current="page"`). A link to the current URL is treated the same way.
- A row with one link: a sibling page.
- A row with a link followed by a bulleted list of links (in the same cell): a **group**. The link is the group's label; the list holds its sub-pages. Lists can nest further: a list item with its own nested list is a group too.

## Flat vs grouped navs

The block picks its look from the content structure:

- **Flat** (no row has a nested list), as on condition pages: below 1200px the nav collapses behind a "Menu" button; the nav is repeated, always expanded, at the end of the article (as on the source); the section uses the condition layout (16.67% rail | 8% gap | 41.67% article from 1200px).
- **Grouped** (at least one row has a nested list), as on `/international`: the block gets the `grouped` class. Each group shows its label link and a chevron button (`aria-expanded`/`aria-controls`) that shows or hides its sub-links; groups are collapsed unless the current page is inside them. Separators are dotted. Below 900px the nav collapses behind the "Menu" button; from 900px it sits in the rail. There is **no** repeat at the end of the article (the source has none). The section uses the hub layout: full-width article below 900px, and 30% rail | 5% gap | 60% article from 900px.

Authors can also force the grouped behaviour on a flat nav with the block option: `Cards Side Nav (grouped)`.

## Supported variations

- `grouped`: set automatically when the nav has groups; can also be authored as a block option (see above).

## Universal Editor fields

N/A (Document Authoring project)
