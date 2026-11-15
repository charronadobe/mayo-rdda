# cards-link-list

Custom **cards** block. Purpose: Text-only list of link rows with a rule and chevron between rows.

## Authoring (Document Authoring)

Model: `standalone`

Single block table, one row per link. Each row has one cell holding a link to a detail page, optionally followed by a short description paragraph.

## Looks (picked from the content, no variant name needed)

- **Plain rows** (link only): 61px rows. Seven or more rows flow into two columns on desktop; up to six rows stay in one column.
- **Title + description** (any row has a description): the JS adds the `described` class. 24px titles, a grey description under each, the chevron centred on the row, and the whole row is clickable. Always one column.
- **On a dark band** (`blue-gradient` or `dark` section style): rules, text and chevrons turn white.
- **In a `split` section** where the section text sits beside the list: the columns are about half and half. A two-column list gets 404 / 856 instead (homepage "Featured care areas"). When the rows have descriptions, the text is centred against the list.

## Universal Editor fields

N/A (Document Authoring project)
