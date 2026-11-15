# accordion-lined

Custom **accordion** block. Purpose: Stacked expandable items holding contact details (phone numbers, opening hours, links) by audience.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: One row per item: label | panel content (H3s, paragraphs, phone/email links, lists) | optional "open".

| Accordion Lined | | |
| --- | --- | --- |
| U.S. patients | Rochester (H3), paragraphs with phone links, ... | open |
| International patients | Paragraphs, H3, bulleted list, links | |

- **Label** (cell 1): plain text, shown as the clickable item label.
- **Panel** (cell 2): any rich content (headings, paragraphs, phone/email links, lists). Everything in the cell is kept.
- **Open on load** (cell 3, optional): type `open` to make that item start open. Several items can be marked.

### Which item starts open

1. If any row has `open` in its third cell, exactly those items start open.
2. Otherwise the **first item** starts open (as on the source page).
3. To start with every item closed, use the `closed` option: `Accordion Lined (closed)`. An `open` cell still wins over this option.

Readers can open and close any item independently, with mouse or keyboard (Tab to a label, Enter or Space to toggle).

## Supported variations

| Variation | Option class |
| --- | --- |
| All closed | `closed` |

## Universal Editor fields

N/A (Document Authoring project)
