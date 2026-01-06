// Constants and Configuration

// Storage keys
export const STORAGE_KEYS = {
  URL_HISTORY: 'urlHistory',
  PATH_SEGMENTS: 'pathSegments',
  QUERY_PARAMS: 'queryParams',
  THEME: 'selectedTheme'
};

// Maximum items to store
export const MAX_HISTORY_ITEMS = 20;
export const MAX_SUGGESTIONS = 30;

// Global state
export let currentUrl = '';
export let urlObj = null;

export function setCurrentUrl(url) {
  currentUrl = url;
}

export function setUrlObj(obj) {
  urlObj = obj;
}

export function getCurrentUrl() {
  return currentUrl;
}

export function getUrlObj() {
  return urlObj;
}

