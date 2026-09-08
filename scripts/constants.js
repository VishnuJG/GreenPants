// Constants and Configuration

// Storage keys
export const STORAGE_KEYS = {
  URL_HISTORY: 'urlHistory',
  PATH_SEGMENTS: 'pathSegments',
  QUERY_PARAMS: 'queryParams',
  QUERY_PARAM_VALUES: 'queryParamValues',
  THEME: 'selectedTheme',
  HISTORY_LIMIT: 'historyLimit',
  SUGGESTIONS_LIMIT: 'suggestionsLimit',
  PARAM_EDITOR_STATE: 'paramEditorState',
  JSON_DIFF_HISTORY: 'jsonDiffHistory',
  YAML_DIFF_HISTORY: 'yamlDiffHistory',
};

// Default maximum items to store
export const DEFAULT_HISTORY_ITEMS = 20;
export const DEFAULT_SUGGESTIONS = 30;

// Backward-compatible exports
export const MAX_HISTORY_ITEMS = DEFAULT_HISTORY_ITEMS;
export const MAX_SUGGESTIONS = DEFAULT_SUGGESTIONS;

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

