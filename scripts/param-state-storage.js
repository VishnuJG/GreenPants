// Persist query param rows (including disabled) per URL path

import { STORAGE_KEYS } from './constants.js';

const MAX_STORED_PATHS = 100;

function isStorageAvailable() {
  return typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local;
}

export function getParamEditorKey(urlObj) {
  return `${urlObj.origin}${urlObj.pathname}`;
}

export function mergeParamsForEditor(urlObj, storedParams = []) {
  const urlValues = new Map();
  for (const [key, value] of urlObj.searchParams.entries()) {
    urlValues.set(key, value);
  }

  const merged = [];
  const seen = new Set();

  for (const stored of storedParams) {
    if (!stored.key) {
      continue;
    }

    seen.add(stored.key);

    if (stored.enabled === false) {
      merged.push({
        key: stored.key,
        value: stored.value ?? '',
        enabled: false,
      });
      continue;
    }

    merged.push({
      key: stored.key,
      value: urlValues.has(stored.key) ? urlValues.get(stored.key) : (stored.value ?? ''),
      enabled: true,
    });
  }

  for (const [key, value] of urlObj.searchParams.entries()) {
    if (seen.has(key)) {
      continue;
    }

    merged.push({ key, value, enabled: true });
    seen.add(key);
  }

  return merged;
}

export async function loadParamEditorState(urlObj) {
  if (!isStorageAvailable()) {
    return [];
  }

  try {
    const result = await chrome.storage.local.get(STORAGE_KEYS.PARAM_EDITOR_STATE);
    const allStates = result[STORAGE_KEYS.PARAM_EDITOR_STATE] || {};
    const entry = allStates[getParamEditorKey(urlObj)];
    return entry?.params || [];
  } catch (error) {
    console.error('Error loading param editor state:', error);
    return [];
  }
}

export async function saveParamEditorState(urlObj, params) {
  if (!isStorageAvailable() || !urlObj) {
    return;
  }

  const cleaned = params
    .filter((param) => param.key)
    .map((param) => ({
      key: param.key,
      value: param.value ?? '',
      enabled: param.enabled !== false,
    }));

  if (cleaned.length === 0) {
    try {
      const result = await chrome.storage.local.get(STORAGE_KEYS.PARAM_EDITOR_STATE);
      const allStates = result[STORAGE_KEYS.PARAM_EDITOR_STATE] || {};
      delete allStates[getParamEditorKey(urlObj)];
      await chrome.storage.local.set({ [STORAGE_KEYS.PARAM_EDITOR_STATE]: allStates });
    } catch (error) {
      console.error('Error clearing param editor state:', error);
    }
    return;
  }

  try {
    const result = await chrome.storage.local.get(STORAGE_KEYS.PARAM_EDITOR_STATE);
    const allStates = result[STORAGE_KEYS.PARAM_EDITOR_STATE] || {};
    const pathKey = getParamEditorKey(urlObj);

    allStates[pathKey] = {
      params: cleaned,
      updatedAt: Date.now(),
    };

    const entries = Object.entries(allStates)
      .sort(([, a], [, b]) => (b.updatedAt || 0) - (a.updatedAt || 0))
      .slice(0, MAX_STORED_PATHS);

    await chrome.storage.local.set({
      [STORAGE_KEYS.PARAM_EDITOR_STATE]: Object.fromEntries(entries),
    });
  } catch (error) {
    console.error('Error saving param editor state:', error);
  }
}
