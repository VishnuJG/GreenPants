// Query Parameter Operations

import { getUrlObj } from './constants.js';
import { buildUrl, updatePreview } from './url-manager.js';
import {
  loadParamEditorState,
  mergeParamsForEditor,
  saveParamEditorState,
} from './param-state-storage.js';

export function collectParamState(container = document.getElementById('queryParams')) {
  if (!container) {
    return [];
  }

  const rows = [];
  container.querySelectorAll('.param-row').forEach((row) => {
    const toggle = row.querySelector('.param-toggle');
    const keyInput = row.querySelector('[data-type="key"]');
    const valueInput = row.querySelector('[data-type="value"]');
    rows.push({
      key: keyInput?.value.trim() ?? '',
      value: valueInput?.value.trim() ?? '',
      enabled: toggle ? toggle.checked : true,
    });
  });
  return rows;
}

export async function persistParamEditorState() {
  const container = document.getElementById('queryParams');
  if (!container) {
    return;
  }

  const params = collectParamState(container);

  try {
    const urlForKey = new URL(buildUrl());
    await saveParamEditorState(urlForKey, params);
    return;
  } catch {
    // Fall back to the loaded tab URL if the editor URL is incomplete.
  }

  const urlObj = getUrlObj();
  if (urlObj) {
    await saveParamEditorState(urlObj, params);
  }
}

let persistTimer = null;

function schedulePersistParamEditorState() {
  clearTimeout(persistTimer);
  persistTimer = setTimeout(() => {
    persistParamEditorState();
  }, 250);
}

function attachParamRowListeners(row) {
  row.querySelector('.param-toggle')?.addEventListener('change', schedulePersistParamEditorState);
  row.querySelector('[data-type="key"]')?.addEventListener('input', schedulePersistParamEditorState);
  row.querySelector('[data-type="value"]')?.addEventListener('input', schedulePersistParamEditorState);
}

function createRemoveHandler(container, row, key) {
  if (key) {
    return async () => {
      removeQueryParam(key);
      await persistParamEditorState();
    };
  }

  return async () => {
    row.remove();
    showEmptyStateIfNeeded(container);
    updatePreview();
    await persistParamEditorState();
  };
}

function createParamRow({ key = '', value = '', enabled = true }) {
  const div = document.createElement('div');
  div.className = 'param-row';
  if (!enabled) {
    div.classList.add('param-disabled');
  }

  const toggle = document.createElement('input');
  toggle.type = 'checkbox';
  toggle.className = 'param-toggle';
  toggle.checked = enabled;
  toggle.title = 'Include in URL';
  toggle.addEventListener('change', async () => {
    div.classList.toggle('param-disabled', !toggle.checked);
    updatePreview();
    await persistParamEditorState();
  });

  const keyInput = document.createElement('input');
  keyInput.type = 'text';
  keyInput.value = key;
  keyInput.placeholder = 'key';
  keyInput.dataset.type = 'key';

  const valueInput = document.createElement('input');
  valueInput.type = 'text';
  valueInput.value = value;
  valueInput.placeholder = 'value';
  valueInput.dataset.type = 'value';

  const removeBtn = document.createElement('button');
  removeBtn.className = 'btn btn-remove';
  removeBtn.textContent = '🗑️';
  removeBtn.title = 'Remove parameter';

  div.appendChild(toggle);
  div.appendChild(keyInput);
  div.appendChild(valueInput);
  div.appendChild(removeBtn);

  attachParamRowListeners(div);
  return div;
}

function showEmptyStateIfNeeded(container) {
  if (container.children.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.textContent = 'No query parameters';
    container.appendChild(emptyState);
  }
}

function renderParamRows(container, params) {
  container.innerHTML = '';

  params.forEach(({ key, value, enabled }) => {
    const row = createParamRow({ key, value, enabled });
    row.querySelector('.btn-remove').onclick = createRemoveHandler(
      container,
      row,
      enabled ? key : ''
    );
    container.appendChild(row);
  });

  if (!container.querySelector('.param-row')) {
    showEmptyStateIfNeeded(container);
  }
}

// Render query parameters
export async function renderQueryParams({ preserveDom = false } = {}) {
  const urlObj = getUrlObj();
  const container = document.getElementById('queryParams');
  if (!container || !urlObj) {
    return;
  }

  let params;

  if (preserveDom) {
    const existingRows = collectParamState(container);
    const stored = await loadParamEditorState(urlObj);
    const merged = mergeParamsForEditor(urlObj, stored);
    const seen = new Set();

    params = [];

    existingRows.forEach((row) => {
      if (!row.key) {
        return;
      }
      seen.add(row.key);
      params.push(row);
    });

    merged.forEach((row) => {
      if (!row.key || seen.has(row.key)) {
        return;
      }
      params.push(row);
      seen.add(row.key);
    });
  } else {
    const stored = await loadParamEditorState(urlObj);
    params = mergeParamsForEditor(urlObj, stored);
  }

  renderParamRows(container, params);
  updatePreview();
}

// Add a new query parameter
export function addQueryParam() {
  const container = document.getElementById('queryParams');

  const emptyState = container.querySelector('.empty-state');
  if (emptyState) {
    emptyState.remove();
  }

  const row = createParamRow({});
  row.querySelector('.btn-remove').onclick = createRemoveHandler(container, row, '');

  container.appendChild(row);
  row.querySelector('[data-type="key"]').focus();
  updatePreview();
  schedulePersistParamEditorState();
}

// Remove a query parameter
export function removeQueryParam(key) {
  const urlObj = getUrlObj();
  urlObj.searchParams.delete(key);

  const container = document.getElementById('queryParams');
  container.querySelectorAll('.param-row').forEach((row) => {
    const keyInput = row.querySelector('[data-type="key"]');
    if (keyInput?.value.trim() === key) {
      row.remove();
    }
  });

  showEmptyStateIfNeeded(container);
  updatePreview();
}

// Add query param with a specific key
export function addQueryParamWithKey(key) {
  const container = document.getElementById('queryParams');

  const emptyState = container.querySelector('.empty-state');
  if (emptyState) {
    emptyState.remove();
  }

  const row = createParamRow({ key });
  row.querySelector('.btn-remove').onclick = createRemoveHandler(container, row, '');

  container.appendChild(row);
  row.querySelector('[data-type="value"]').focus();
  updatePreview();
  schedulePersistParamEditorState();
}
