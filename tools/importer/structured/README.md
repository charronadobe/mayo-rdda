# Medical-condition structured content

Condition pages ("Symptoms and causes" on mayoclinic.org) are migrated as **structured-content
documents** in DA, one per condition:
`health-library/diseases-conditions/medical-condition/<slug>`, following the schema
`medical-condition` (`.da/forms/schemas/medical-condition` in DA, `medical-condition.schema.json` here).
Authors edit them in da.live's form editor. The site renders them as condition pages with
`scripts/structured-content.js`.

## Importing conditions

1. **Save the source pages.** Save each condition page from mayoclinic.org as a snapshot, laid out as
   `<dir>/www.mayoclinic.org/diseases-conditions/<slug>/symptoms-causes/<id>.html`. The first 257
   were in `migration-work/cond-snapshots`; the 15 in Mayo's older layout
   (`tools/importer/urls-condition-skipped.txt`) are in `migration-work/cond-snapshots-skipped`.
   Both layouts go through the same pipeline: the cleanup transformer
   (`rebuildLegacyCondition` in `transformers/mayoclinic-cleanup.js`) rewrites an older-layout page
   into the content the current layout imports to.
2. **Run the pipeline** with a file of their URLs (one
   `https://www.mayoclinic.org/diseases-conditions/<slug>/symptoms-causes/<id>` per line):

   ```bash
   bash tools/importer/structured/import-medical-conditions.sh <urls-file> <snapshots-dir>
   ```

   It does three things:
   - runs the condition importer (`tools/importer/import-condition.js`) into a staging folder,
     `migration-work/condition-staging`, so no symptoms-causes page lands in `content/`;
   - builds one structured document per page with `build-medical-condition.mjs`:
     - the article sections, illustrations, videos with transcripts, references and links come from
       the imported page;
     - the names, symptoms, tests, body systems, codes and review date come from the source page's
       schema.org data;
     - each document is validated against the schema and read back before it is written to
       `content/health-library/diseases-conditions/medical-condition/<slug>.plain.html`;
   - registers the conditions with `register-conditions.mjs`, by adding them to
     `tools/importer/urls-condition.txt` and to the importer's list of migrated conditions. Other
     imported pages, including the A–Z letter pages, then link to the new documents.
3. **Host new images in DA.** Upload new images from www.mayoclinic.org to `media/mayoclinic`, and
   new video thumbnails to `media/thumbnails` as `kaltura-<entry>.jpg`. Thumbnail names have no
   underscores, because Edge Delivery can't preview a file whose name has one. Preview and publish
   the images.
4. **Upload and publish.** Upload the new documents to DA, preview and publish them, then re-import
   the A–Z letter pages so they list the new conditions.

## Checking the builder

`--check` compares what the builder would write with the documents already in `content/`, without
writing anything:

```bash
node tools/importer/structured/build-medical-condition.mjs --pages migration-work/backup-symptoms-causes/local --check
```

On the 257 existing conditions, the only expected differences are:
- the video thumbnails of 14 documents, which use Edge Delivery media copies;
- the share image's alt text on 54 documents, which now matches the page title.
