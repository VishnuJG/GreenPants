import { SEED_STORAGE_KEY } from './yaml-diff-storage.js';

export async function openYamlDiff(seedLeftYaml = '') {
  const trimmed = seedLeftYaml.trim();
  if (trimmed && chrome?.storage?.local) {
    await chrome.storage.local.set({ [SEED_STORAGE_KEY]: trimmed });
  }

  await chrome.tabs.create({
    url: chrome.runtime.getURL('yaml-diff.html'),
    active: true,
  });
}
