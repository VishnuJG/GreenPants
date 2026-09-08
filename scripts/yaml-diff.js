// YAML Diff viewer

import {
  formatYamlValue,
  parseYamlDocument,
  fixYamlText,
} from './yaml-utils.js';
import {
  buildLineDiff,
  escapeHtml,
  renderDiffPanel,
  summarizeDiff,
} from './diff-shared.js';
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
} from './yaml-diff-storage.js';

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
const importYamlFile = document.getElementById('importYamlFile');
const fixInput = document.getElementById('fixInput');
const fixStatus = document.getElementById('fixStatus');
const mainLayout = document.getElementById('mainLayout');
const pageSubtitle = document.getElementById('pageSubtitle');

let activeComparisonId = null;
let activeComparisonName = '';
let toastTimer = null;
let currentMode = 'diff';

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

function parseYaml(text, side, repair = false) {
  const result = parseYamlDocument(text, { side, repair });
  if (!result.ok) {
    throw new Error(result.error);
  }
  return result.value;
}

function formatInput(textarea) {
  hideError();
  const side = textarea === leftInput ? 'Left' : 'Right';

  try {
    const parsed = parseYaml(textarea.value, side, true);
    if (parsed === null) {
      return;
    }
    textarea.value = formatYamlValue(parsed);
    showToast(`${side} YAML formatted.`);
  } catch (error) {
    showError(error.message);
  }
}

function setFixStatus(state, message) {
  fixStatus.textContent = message;
  fixStatus.classList.remove('valid', 'invalid');
  if (state) {
    fixStatus.classList.add(state);
  }
}

function fixYamlDocument() {
  hideError();

  const raw = fixInput.value;
  if (!raw.trim()) {
    setFixStatus('invalid', 'Empty');
    showError('Paste YAML to fix and format.');
    return;
  }

  try {
    const fixed = fixYamlText(raw);
    fixInput.value = fixed.text;
    setFixStatus('valid', `Valid YAML · ${fixed.note}`);
    showToast(fixed.repaired ? 'YAML repaired and formatted.' : 'YAML formatted.');
  } catch (error) {
    setFixStatus('invalid', 'Invalid YAML');
    showError(error.message);
  }
}

function validateYamlDocument() {
  hideError();

  const raw = fixInput.value;
  if (!raw.trim()) {
    setFixStatus('invalid', 'Empty');
    showError('Paste YAML to validate.');
    return;
  }

  const result = parseYamlDocument(raw, { repair: true });
  if (result.ok) {
    setFixStatus('valid', result.repaired ? 'Valid YAML · fixable' : 'Valid YAML');
    showToast(result.repaired ? 'Valid after auto-repair.' : 'YAML is valid.');
    return;
  }

  setFixStatus('invalid', 'Invalid YAML');
  showError(result.error);
}

function clearFixEditor() {
  fixInput.value = '';
  hideError();
  setFixStatus('', 'Ready');
}

async function copyFixEditor() {
  if (!fixInput.value.trim()) {
    showError('Nothing to copy.');
    return;
  }

  try {
    await navigator.clipboard.writeText(fixInput.value);
    showToast('YAML copied.');
  } catch {
    showError('Could not copy to clipboard.');
  }
}

async function handleImportYamlFile(event) {
  const file = event.target.files?.[0];
  event.target.value = '';
  if (!file) {
    return;
  }

  hideError();

  try {
    fixInput.value = await file.text();
    setFixStatus('', 'Imported');
    showToast(`Loaded ${file.name}`);
  } catch {
    showError('Could not read YAML file.');
  }
}

function setMode(mode) {
  currentMode = mode;
  document.body.classList.toggle('mode-fix', mode === 'fix');
  mainLayout.classList.toggle('fix-mode', mode === 'fix');

  document.querySelectorAll('.mode-btn').forEach((button) => {
    button.classList.toggle('active', button.dataset.mode === mode);
  });

  if (mode === 'fix') {
    pageSubtitle.textContent = 'Paste YAML to validate, clean up indentation, and format';
    if (!fixInput.value.trim() && leftInput.value.trim()) {
      fixInput.value = leftInput.value;
    }
    hideError();
    results.hidden = true;
  } else {
    pageSubtitle.textContent = 'Compare two YAML documents or fix & format a single file';
  }
}

async function pasteInto(textarea) {
  try {
    textarea.value = await navigator.clipboard.readText();
  } catch {
    showError('Could not read from clipboard.');
  }
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
    compareYaml(false);
  } else {
    results.hidden = true;
    summary.textContent = entry.name || 'Ready';
  }
}

function compareYaml(updateSummary = true) {
  hideError();

  try {
    const leftParsed = parseYaml(leftInput.value, 'Left', true);
    const rightParsed = parseYaml(rightInput.value, 'Right', true);

    if (leftParsed === null && rightParsed === null) {
      showError('Paste YAML into at least one side to compare.');
      results.hidden = true;
      if (updateSummary) {
        summary.textContent = activeComparisonName || 'Ready';
      }
      return;
    }

    const leftFormatted = leftParsed === null ? '' : formatYamlValue(leftParsed);
    const rightFormatted = rightParsed === null ? '' : formatYamlValue(rightParsed);

    leftInput.value = leftFormatted;
    rightInput.value = rightFormatted;

    const rows = buildLineDiff(
      leftFormatted ? leftFormatted.split('\n') : [],
      rightFormatted ? rightFormatted.split('\n') : []
    );

    renderDiffPanel(leftDiff, 'left', rows);
    renderDiffPanel(rightDiff, 'right', rows);

    const { added, removed, changed, same } = summarizeDiff(rows);

    if (updateSummary) {
      const prefix = activeComparisonName ? `${activeComparisonName} · ` : '';
      if (added === 0 && removed === 0 && changed === 0) {
        summary.textContent = `${prefix}Identical YAML`;
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
    compareYaml(false);
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
    compareYaml(true);
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
      showError('Add YAML before exporting.');
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
    console.error('Error loading YAML diff seed:', error);
  }
}

document.getElementById('compareBtn').addEventListener('click', () => compareYaml(true));
document.getElementById('saveBtn').addEventListener('click', saveCurrentComparison);
document.getElementById('shareBtn').addEventListener('click', () => shareComparison());
document.getElementById('exportBtn').addEventListener('click', exportCurrentComparison);
document.getElementById('importBtn').addEventListener('click', () => importFile.click());
document.getElementById('swapBtn').addEventListener('click', swapInputs);
document.getElementById('clearBtn').addEventListener('click', clearAll);
importFile.addEventListener('change', handleImportFile);

document.getElementById('fixYamlBtn').addEventListener('click', fixYamlDocument);
document.getElementById('validateYamlBtn').addEventListener('click', validateYamlDocument);
document.getElementById('pasteFixBtn').addEventListener('click', () => pasteInto(fixInput));
document.getElementById('copyFixBtn').addEventListener('click', copyFixEditor);
document.getElementById('clearFixBtn').addEventListener('click', clearFixEditor);
document.getElementById('importYamlFileBtn').addEventListener('click', () => importYamlFile.click());
importYamlFile.addEventListener('change', handleImportYamlFile);

document.querySelectorAll('.mode-btn').forEach((button) => {
  button.addEventListener('click', () => setMode(button.dataset.mode));
});

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
  if (event.metaKey || event.ctrlKey) {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (currentMode === 'fix') {
        fixYamlDocument();
      } else {
        compareYaml(true);
      }
      return;
    }

    if (event.key.toLowerCase() === 's') {
      event.preventDefault();
      if (currentMode === 'fix') {
        fixYamlDocument();
      } else {
        saveCurrentComparison();
      }
    }
  }
});

await renderHistory();
await loadInitialContent();
