// add delayed functionality here
import { getMetadata, loadScript } from './aem.js';

// Adobe Target - start

window.targetGlobalSettings = {
  bodyHidingEnabled: false,
};

function loadAT() {
  loadScript(`${window.hlx.codeBasePath}/scripts/at-lsig.js`);
}
// Adobe Target - end

/**
 * Finds and embeds custom JS and css
 */
function embedCustomLibraries() {
  const externalLibs = getMetadata('js-files');
  // skip empty entries: getMetadata returns '' when the page has no js-files,
  // and loading an empty URL fails with an unhandled error
  const libsArray = (externalLibs || '').split(',').map((url) => url.trim()).filter(Boolean);

  libsArray.forEach((url) => {
    loadScript(`${url}`).catch(() => {});
  });
}

if (!window.location.hostname.includes('localhost')) {
  // Adobe Target is opt-in per page ("target" metadata = on): the bundled at.js points at a
  // demo client and its requests fail on this site until a real Target account is configured
  if (getMetadata('target').toLowerCase() === 'on') loadAT();
  embedCustomLibraries();
}
