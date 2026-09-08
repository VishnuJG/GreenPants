// Storage limit settings

import {
  STORAGE_KEYS,
  DEFAULT_HISTORY_ITEMS,
  DEFAULT_SUGGESTIONS,
} from './constants.js';

function isStorageAvailable() {
  return typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local;
}

function clamp(value, min, max, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, parsed));
}

export async function getHistoryLimit() {
  if (!isStorageAvailable()) {
    return DEFAULT_HISTORY_ITEMS;
  }

  const result = await chrome.storage.local.get(STORAGE_KEYS.HISTORY_LIMIT);
  return clamp(result[STORAGE_KEYS.HISTORY_LIMIT], 5, 200, DEFAULT_HISTORY_ITEMS);
}

export async function getSuggestionsLimit() {
  if (!isStorageAvailable()) {
    return DEFAULT_SUGGESTIONS;
  }

  const result = await chrome.storage.local.get(STORAGE_KEYS.SUGGESTIONS_LIMIT);
  return clamp(result[STORAGE_KEYS.SUGGESTIONS_LIMIT], 10, 500, DEFAULT_SUGGESTIONS);
}

export async function loadStorageLimitSettings() {
  const historyLimit = await getHistoryLimit();
  const suggestionsLimit = await getSuggestionsLimit();

  const historyInput = document.getElementById('historyLimit');
  const suggestionsInput = document.getElementById('suggestionsLimit');

  if (historyInput) {
    historyInput.value = String(historyLimit);
  }
  if (suggestionsInput) {
    suggestionsInput.value = String(suggestionsLimit);
  }
}

export async function saveStorageLimitSettings() {
  if (!isStorageAvailable()) {
    alert('Storage API not available. Please reload the extension.');
    return;
  }

  const historyInput = document.getElementById('historyLimit');
  const suggestionsInput = document.getElementById('suggestionsLimit');
  const status = document.getElementById('storageLimitsStatus');

  const historyLimit = clamp(historyInput?.value, 5, 200, DEFAULT_HISTORY_ITEMS);
  const suggestionsLimit = clamp(suggestionsInput?.value, 10, 500, DEFAULT_SUGGESTIONS);

  if (historyInput) {
    historyInput.value = String(historyLimit);
  }
  if (suggestionsInput) {
    suggestionsInput.value = String(suggestionsLimit);
  }

  await chrome.storage.local.set({
    [STORAGE_KEYS.HISTORY_LIMIT]: historyLimit,
    [STORAGE_KEYS.SUGGESTIONS_LIMIT]: suggestionsLimit,
  });

  const result = await chrome.storage.local.get([
    STORAGE_KEYS.URL_HISTORY,
    STORAGE_KEYS.PATH_SEGMENTS,
    STORAGE_KEYS.QUERY_PARAMS,
    STORAGE_KEYS.QUERY_PARAM_VALUES,
  ]);

  const history = (result[STORAGE_KEYS.URL_HISTORY] || []).slice(0, historyLimit);
  const paths = (result[STORAGE_KEYS.PATH_SEGMENTS] || []).slice(0, suggestionsLimit);
  const params = (result[STORAGE_KEYS.QUERY_PARAMS] || []).slice(0, suggestionsLimit);

  const paramValues = result[STORAGE_KEYS.QUERY_PARAM_VALUES] || {};
  Object.keys(paramValues).forEach((key) => {
    paramValues[key] = (paramValues[key] || []).slice(0, suggestionsLimit);
  });

  await chrome.storage.local.set({
    [STORAGE_KEYS.URL_HISTORY]: history,
    [STORAGE_KEYS.PATH_SEGMENTS]: paths,
    [STORAGE_KEYS.QUERY_PARAMS]: params,
    [STORAGE_KEYS.QUERY_PARAM_VALUES]: paramValues,
  });

  if (status) {
    status.textContent = `Saved. History: ${historyLimit}, suggestions: ${suggestionsLimit}.`;
    setTimeout(() => {
      status.textContent = '';
    }, 3000);
  }
}

export function setupStorageLimitListeners() {
  const saveButton = document.getElementById('saveStorageLimits');
  if (saveButton) {
    saveButton.addEventListener('click', saveStorageLimitSettings);
  }
}
