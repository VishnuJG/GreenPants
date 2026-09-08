// JSON Diff viewer

import {
  SEED_STORAGE_KEY,
  loadComparisonHistory,
  saveNamedComparison,
  deleteComparison,
  renameComparison,
  createShareLink,
  parseShareLink,
  exportComparisonFile,
  importComparisonFile,
  formatHistoryDate,
} from './json-diff-storage.js';

const leftInput = document.getElementById('leftInput');
const rightInput = document.getElementById('rightInput');
const leftDiff = document.getElementById('leftDiff');
const rightDiff = document.getElementById('rightDiff');
const results = document.getElementById('results');
const summary = document.getElementById('summary');
const errorBanner = document.getElementById('errorBanner');
const historyList = document.getElementById('historyList');
const historyCount = document.getElementById('historyCount');
const toast = document.getElementById('toast');
const importFile = document.getElementById('importFile');

let activeComparisonId = null;
let activeComparisonName = '';
let toastTimer = null;

function showError(message) {
  errorBanner.textContent = message;
  errorBanner.style.display = 'block';
}

function hideError() {
  errorBanner.style.display = 'none';
  errorBanner.textContent = '';
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('visible');
  }, 2400);
}

function parseJson(text, side) {
  const trimmed = text.trim();
  if (!trimmed) {
    return null;
  }

  try {
    return JSON.parse(trimmed);
  } catch (error) {
    throw new Error(`${side} JSON is invalid: ${error.message}`);
  }
}

function formatJson(value) {
  return JSON.stringify(value, null, 2);
}

function formatInput(textarea) {
  hideError();
  const parsed = parseJson(textarea.value, textarea === leftInput ? 'Left' : 'Right');
  if (parsed === null) {
    return;
  }
  textarea.value = formatJson(parsed);
}

async function pasteInto(textarea) {
  try {
    textarea.value = await navigator.clipboard.readText();
  } catch {
    showError('Could not read from clipboard.');
  }
}

function buildLineDiff(leftLines, rightLines) {
  const rows = [];
  const m = leftLines.length;
  const n = rightLines.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = m - 1; i >= 0; i -= 1) {
    for (let j = n - 1; j >= 0; j -= 1) {
      dp[i][j] = leftLines[i] === rightLines[j]
        ? dp[i + 1][j + 1] + 1
        : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (leftLines[i] === rightLines[j]) {
      rows.push({ type: 'same', left: leftLines[i], right: rightLines[j], leftNo: i + 1, rightNo: j + 1 });
      i += 1;
      j += 1;
      continue;
    }

    if (dp[i + 1][j] >= dp[i][j + 1]) {
      rows.push({ type: 'removed', left: leftLines[i], right: '', leftNo: i + 1, rightNo: null });
      i += 1;
    } else {
      rows.push({ type: 'added', left: '', right: rightLines[j], leftNo: null, rightNo: j + 1 });
      j += 1;
    }
  }

  while (i < m) {
    rows.push({ type: 'removed', left: leftLines[i], right: '', leftNo: i + 1, rightNo: null });
    i += 1;
  }

  while (j < n) {
    rows.push({ type: 'added', left: '', right: rightLines[j], leftNo: null, rightNo: j + 1 });
    j += 1;
  }

  for (let index = 0; index < rows.length - 1; index += 1) {
    const current = rows[index];
    const next = rows[index + 1];
    if (current.type === 'removed' && next.type === 'added') {
      rows[index] = {
        type: 'changed',
        left: current.left,
        right: next.right,
        leftNo: current.leftNo,
        rightNo: next.rightNo,
      };
      rows.splice(index + 1, 1);
    }
  }

  return rows;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderDiffPanel(container, side) {
  container.innerHTML = '';
  const fragment = document.createDocumentFragment();

  container._rows.forEach((row) => {
    const line = document.createElement('div');
    const text = side === 'left' ? row.left : row.right;
    const lineNo = side === 'left' ? row.leftNo : row.rightNo;

    line.className = 'diff-line';
    if (row.type === 'same') {
      line.classList.add('same');
    } else if (row.type === 'removed' && side === 'left') {
      line.classList.add('removed');
    } else if (row.type === 'added' && side === 'right') {
      line.classList.add('added');
    } else if (row.type === 'changed') {
      line.classList.add(side === 'left' ? 'changed-left' : 'changed-right');
    } else if (!text) {
      line.classList.add('empty');
    }

    line.innerHTML = `
      <span class="line-no">${lineNo ?? ''}</span>
      <span class="line-text">${escapeHtml(text)}</span>
    `;
    fragment.appendChild(line);
  });

  container.appendChild(fragment);
}

function getCurrentComparisonPayload() {
  return {
    name: activeComparisonName,
    left: leftInput.value,
    right: rightInput.value,
  };
}

function loadComparisonIntoEditor(entry, runCompare = true) {
  activeComparisonId = entry.id || null;
  activeComparisonName = entry.name || '';
  leftInput.value = entry.left || '';
  rightInput.value = entry.right || '';
  hideError();
  renderHistory();

  if (runCompare && (entry.left?.trim() || entry.right?.trim())) {
    compareJson(false);
  } else {
    results.hidden = true;
    summary.textContent = entry.name || 'Ready';
  }
}

function compareJson(updateSummary = true) {
  hideError();

  try {
    const leftParsed = parseJson(leftInput.value, 'Left');
    const rightParsed = parseJson(rightInput.value, 'Right');

    if (leftParsed === null && rightParsed === null) {
      showError('Paste JSON into at least one side to compare.');
      results.hidden = true;
      if (updateSummary) {
        summary.textContent = activeComparisonName || 'Ready';
      }
      return;
    }

    const leftFormatted = leftParsed === null ? '' : formatJson(leftParsed);
    const rightFormatted = rightParsed === null ? '' : formatJson(rightParsed);

    leftInput.value = leftFormatted;
    rightInput.value = rightFormatted;

    const rows = buildLineDiff(
      leftFormatted ? leftFormatted.split('\n') : [],
      rightFormatted ? rightFormatted.split('\n') : []
    );

    leftDiff._rows = rows;
    rightDiff._rows = rows;

    renderDiffPanel(leftDiff, 'left');
    renderDiffPanel(rightDiff, 'right');

    const added = rows.filter((row) => row.type === 'added').length;
    const removed = rows.filter((row) => row.type === 'removed').length;
    const changed = rows.filter((row) => row.type === 'changed').length;
    const same = rows.filter((row) => row.type === 'same').length;

    if (updateSummary) {
      const prefix = activeComparisonName ? `${activeComparisonName} · ` : '';
      if (added === 0 && removed === 0 && changed === 0) {
        summary.textContent = `${prefix}Identical JSON`;
      } else {
        summary.textContent = `${prefix}${added} added · ${removed} removed · ${changed} changed · ${same} unchanged lines`;
      }
    }

    results.hidden = false;
  } catch (error) {
    showError(error.message);
    results.hidden = true;
    summary.textContent = 'Compare failed';
  }
}

function swapInputs() {
  const temp = leftInput.value;
  leftInput.value = rightInput.value;
  rightInput.value = temp;
  hideError();
  results.hidden = true;
  summary.textContent = activeComparisonName || 'Ready';
}

function clearAll() {
  activeComparisonId = null;
  activeComparisonName = '';
  leftInput.value = '';
  rightInput.value = '';
  leftDiff.innerHTML = '';
  rightDiff.innerHTML = '';
  results.hidden = true;
  hideError();
  summary.textContent = 'Ready';
  renderHistory();
}

async function renderHistory() {
  const history = await loadComparisonHistory();
  historyCount.textContent = String(history.length);
  historyList.innerHTML = '';

  if (history.length === 0) {
    historyList.innerHTML = '<div class="history-empty">Save a comparison with a name to build your history.</div>';
    return;
  }

  history.forEach((entry) => {
    const item = document.createElement('div');
    item.className = 'history-item';
    if (entry.id === activeComparisonId) {
      item.classList.add('active');
    }

    item.innerHTML = `
      <div class="history-item-name">${escapeHtml(entry.name)}</div>
      <div class="history-item-meta">${formatHistoryDate(entry.updatedAt || entry.createdAt)}</div>
      <div class="history-item-actions">
        <button type="button" data-action="load">Open</button>
        <button type="button" data-action="share">Share</button>
        <button type="button" data-action="export">Export</button>
        <button type="button" data-action="rename">Rename</button>
        <button type="button" class="danger" data-action="delete">Delete</button>
      </div>
    `;

    item.addEventListener('click', (event) => {
      if (event.target.closest('button')) {
        return;
      }
      loadComparisonIntoEditor(entry);
    });

    item.querySelector('[data-action="load"]').addEventListener('click', (event) => {
      event.stopPropagation();
      loadComparisonIntoEditor(entry);
    });

    item.querySelector('[data-action="share"]').addEventListener('click', async (event) => {
      event.stopPropagation();
      await shareComparison(entry);
    });

    item.querySelector('[data-action="export"]').addEventListener('click', (event) => {
      event.stopPropagation();
      exportComparisonFile(entry);
      showToast('Comparison exported.');
    });

    item.querySelector('[data-action="rename"]').addEventListener('click', async (event) => {
      event.stopPropagation();
      const nextName = prompt('Rename comparison', entry.name);
      if (nextName === null) {
        return;
      }
      try {
        const updated = await renameComparison(entry.id, nextName);
        if (entry.id === activeComparisonId) {
          activeComparisonName = updated.name;
          summary.textContent = updated.name;
        }
        await renderHistory();
        showToast('Comparison renamed.');
      } catch (error) {
        showError(error.message);
      }
    });

    item.querySelector('[data-action="delete"]').addEventListener('click', async (event) => {
      event.stopPropagation();
      if (!confirm(`Delete "${entry.name}"?`)) {
        return;
      }
      await deleteComparison(entry.id);
      if (entry.id === activeComparisonId) {
        activeComparisonId = null;
        activeComparisonName = '';
      }
      await renderHistory();
      showToast('Comparison deleted.');
    });

    historyList.appendChild(item);
  });
}

async function saveCurrentComparison() {
  hideError();

  try {
    compareJson(false);
    const suggestedName = activeComparisonName || `Comparison ${new Date().toLocaleDateString()}`;
    const name = prompt('Name this comparison', suggestedName);
    if (name === null) {
      return;
    }

    const saved = await saveNamedComparison({
      id: activeComparisonId,
      name,
      left: leftInput.value,
      right: rightInput.value,
    });

    activeComparisonId = saved.id;
    activeComparisonName = saved.name;
    await renderHistory();
    compareJson(true);
    showToast('Comparison saved.');
  } catch (error) {
    showError(error.message);
  }
}

async function shareComparison(payload = getCurrentComparisonPayload()) {
  hideError();

  try {
    const link = await createShareLink(payload);
    await navigator.clipboard.writeText(link);
    showToast('Share link copied. Recipient needs URL Editor Pro installed.');
  } catch (error) {
    showError(error.message);
  }
}

function exportCurrentComparison() {
  hideError();

  try {
    const payload = getCurrentComparisonPayload();
    if (!payload.left.trim() && !payload.right.trim()) {
      showError('Add JSON before exporting.');
      return;
    }

    exportComparisonFile({
      name: payload.name || `Comparison ${new Date().toLocaleDateString()}`,
      left: payload.left,
      right: payload.right,
    });
    showToast('Comparison exported.');
  } catch (error) {
    showError(error.message);
  }
}

async function handleImportFile(event) {
  const file = event.target.files?.[0];
  event.target.value = '';
  if (!file) {
    return;
  }

  hideError();

  try {
    const imported = await importComparisonFile(file);
    activeComparisonId = null;
    activeComparisonName = imported.name;
    loadComparisonIntoEditor(imported);
    showToast('Comparison imported.');
  } catch (error) {
    showError(error.message);
  }
}

async function loadInitialContent() {
  if (location.hash.startsWith('#s=')) {
    try {
      const shared = await parseShareLink(location.hash);
      if (shared) {
        activeComparisonId = null;
        activeComparisonName = shared.name;
        loadComparisonIntoEditor(shared);
        history.replaceState(null, '', location.pathname + location.search);
        return;
      }
    } catch (error) {
      showError(`Could not open shared comparison: ${error.message}`);
    }
  }

  if (!chrome?.storage?.local) {
    return;
  }

  try {
    const result = await chrome.storage.local.get(SEED_STORAGE_KEY);
    if (result[SEED_STORAGE_KEY]) {
      leftInput.value = result[SEED_STORAGE_KEY];
      await chrome.storage.local.remove(SEED_STORAGE_KEY);
    }
  } catch (error) {
    console.error('Error loading JSON diff seed:', error);
  }
}

document.getElementById('compareBtn').addEventListener('click', () => compareJson(true));
document.getElementById('saveBtn').addEventListener('click', saveCurrentComparison);
document.getElementById('shareBtn').addEventListener('click', () => shareComparison());
document.getElementById('exportBtn').addEventListener('click', exportCurrentComparison);
document.getElementById('importBtn').addEventListener('click', () => importFile.click());
document.getElementById('swapBtn').addEventListener('click', swapInputs);
document.getElementById('clearBtn').addEventListener('click', clearAll);
importFile.addEventListener('change', handleImportFile);

document.querySelectorAll('[data-format]').forEach((button) => {
  button.addEventListener('click', () => {
    formatInput(button.dataset.format === 'left' ? leftInput : rightInput);
  });
});

document.querySelectorAll('[data-paste]').forEach((button) => {
  button.addEventListener('click', () => {
    pasteInto(button.dataset.paste === 'left' ? leftInput : rightInput);
  });
});

document.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
    event.preventDefault();
    compareJson(true);
  }

  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
    event.preventDefault();
    saveCurrentComparison();
  }
});

await renderHistory();
await loadInitialContent();
