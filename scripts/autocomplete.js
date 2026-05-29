// Inline autocomplete for path segments and query params

import { STORAGE_KEYS, MAX_SUGGESTIONS } from './constants.js';
import { isStorageAvailable } from './storage.js';
import { updatePreview } from './url-manager.js';

const MAX_VISIBLE = 8;

let pathSegments = [];
let paramKeys = [];
let paramValuesByKey = {};

let dropdown = null;
let activeInput = null;
let suggestions = [];
let highlightedIndex = -1;
let isOpen = false;

export async function refreshAutocompleteData() {
  if (!isStorageAvailable()) {
    pathSegments = [];
    paramKeys = [];
    paramValuesByKey = {};
    return;
  }

  try {
    const result = await chrome.storage.local.get([
      STORAGE_KEYS.PATH_SEGMENTS,
      STORAGE_KEYS.QUERY_PARAMS,
      STORAGE_KEYS.QUERY_PARAM_VALUES,
    ]);
    pathSegments = result[STORAGE_KEYS.PATH_SEGMENTS] || [];
    paramKeys = result[STORAGE_KEYS.QUERY_PARAMS] || [];
    paramValuesByKey = result[STORAGE_KEYS.QUERY_PARAM_VALUES] || {};
  } catch (error) {
    console.error('Error loading autocomplete data:', error);
  }
}

export function isAutocompleteOpen() {
  return isOpen;
}

function getInputType(input) {
  const pathContainer = document.getElementById('pathSegments');
  const queryContainer = document.getElementById('queryParams');

  if (pathContainer?.contains(input)) {
    const index = parseInt(input.dataset.index, 10);
    if (index === 0 || input.readOnly) {
      return null;
    }
    return 'path';
  }

  if (queryContainer?.contains(input)) {
    if (input.dataset.type === 'key') {
      return 'param-key';
    }
    if (input.dataset.type === 'value') {
      return 'param-value';
    }
  }

  return null;
}

function getSuggestionPool(input, type) {
  if (type === 'path') {
    return pathSegments;
  }

  if (type === 'param-key') {
    return paramKeys;
  }

  if (type === 'param-value') {
    const row = input.closest('.param-row');
    const keyInput = row?.querySelector('[data-type="key"]');
    const key = keyInput?.value.trim();
    return key ? (paramValuesByKey[key] || []) : [];
  }

  return [];
}

function filterSuggestions(pool, query) {
  const trimmed = query.trim();

  if (!trimmed) {
    return pool.slice(0, MAX_VISIBLE);
  }

  const lower = trimmed.toLowerCase();
  return pool
    .filter((item) => {
      const itemLower = item.toLowerCase();
      return itemLower.startsWith(lower) && itemLower !== lower;
    })
    .slice(0, MAX_VISIBLE);
}

function ensureDropdown() {
  if (!dropdown) {
    dropdown = document.createElement('div');
    dropdown.className = 'autocomplete-dropdown';
    dropdown.hidden = true;
    document.body.appendChild(dropdown);

    dropdown.addEventListener('mousedown', (e) => {
      e.preventDefault();
    });

    dropdown.addEventListener('click', (e) => {
      const item = e.target.closest('.autocomplete-item');
      if (item && activeInput) {
        const index = parseInt(item.dataset.index, 10);
        if (!Number.isNaN(index) && suggestions[index] !== undefined) {
          selectSuggestion(suggestions[index]);
        }
      }
    });
  }

  return dropdown;
}

function positionDropdown(input) {
  const rect = input.getBoundingClientRect();
  dropdown.style.top = `${rect.bottom + 2}px`;
  dropdown.style.left = `${rect.left}px`;
  dropdown.style.width = `${Math.max(rect.width, 120)}px`;
}

function updateHighlight() {
  if (!dropdown) {
    return;
  }

  dropdown.querySelectorAll('.autocomplete-item').forEach((el, i) => {
    el.classList.toggle('active', i === highlightedIndex);
  });

  dropdown.querySelector('.autocomplete-item.active')?.scrollIntoView({ block: 'nearest' });
}

function renderDropdown(items) {
  suggestions = items;
  highlightedIndex = items.length > 0 ? 0 : -1;

  if (items.length === 0) {
    closeDropdown();
    return;
  }

  ensureDropdown();
  dropdown.replaceChildren();

  items.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'autocomplete-item';
    if (i === highlightedIndex) {
      el.classList.add('active');
    }
    el.textContent = item;
    el.dataset.index = String(i);
    dropdown.appendChild(el);
  });

  positionDropdown(activeInput);
  dropdown.hidden = false;
  isOpen = true;
}

function selectSuggestion(value) {
  if (!activeInput) {
    return;
  }

  activeInput.value = value;
  activeInput.dispatchEvent(new Event('input', { bubbles: true }));
  closeDropdown();
  updatePreview();
}

function closeDropdown() {
  if (dropdown) {
    dropdown.hidden = true;
  }
  isOpen = false;
  highlightedIndex = -1;
  suggestions = [];
}

function showSuggestionsForInput(input) {
  const type = getInputType(input);
  if (!type) {
    closeDropdown();
    return;
  }

  activeInput = input;
  const items = filterSuggestions(getSuggestionPool(input, type), input.value);
  renderDropdown(items);
}

function handleAutocompleteKeydown(e) {
  if (!isOpen || !activeInput) {
    return;
  }

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    e.stopPropagation();
    highlightedIndex = Math.min(highlightedIndex + 1, suggestions.length - 1);
    updateHighlight();
    return;
  }

  if (e.key === 'ArrowUp') {
    e.preventDefault();
    e.stopPropagation();
    highlightedIndex = Math.max(highlightedIndex - 1, 0);
    updateHighlight();
    return;
  }

  if (e.key === 'Enter' && highlightedIndex >= 0) {
    e.preventDefault();
    e.stopPropagation();
    selectSuggestion(suggestions[highlightedIndex]);
    return;
  }

  if (e.key === 'Escape') {
    e.preventDefault();
    e.stopPropagation();
    closeDropdown();
    return;
  }

  if (e.key === 'Tab' && highlightedIndex >= 0) {
    selectSuggestion(suggestions[highlightedIndex]);
  }
}

export function initAutocomplete() {
  document.addEventListener(
    'keydown',
    handleAutocompleteKeydown,
    true
  );

  document.addEventListener('focusin', (e) => {
    if (e.target.tagName !== 'INPUT') {
      return;
    }
    showSuggestionsForInput(e.target);
  });

  document.addEventListener('input', (e) => {
    if (e.target.tagName !== 'INPUT') {
      return;
    }
    if (e.target === activeInput || getInputType(e.target)) {
      showSuggestionsForInput(e.target);
    }
  });

  document.addEventListener('focusout', (e) => {
    setTimeout(() => {
      if (e.target === activeInput && !dropdown?.matches(':hover')) {
        closeDropdown();
        if (document.activeElement !== activeInput) {
          activeInput = null;
        }
      }
    }, 150);
  });
}
