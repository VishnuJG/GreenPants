// Open JSON diff in a new tab

import { SEED_STORAGE_KEY } from './json-diff-storage.js';

export async function openJsonDiff(seedLeftJson = '') {
  const trimmed = seedLeftJson.trim();
  if (trimmed && chrome?.storage?.local) {
    await chrome.storage.local.set({ [SEED_STORAGE_KEY]: trimmed });
  }

  await chrome.tabs.create({
    url: chrome.runtime.getURL('json-diff.html'),
    active: true,
  });
}
