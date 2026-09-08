// User Actions - Apply and Copy

import { buildUrl } from './url-manager.js';
import { saveUrlToHistory, savePathsAndParams, loadHistory } from './storage.js';
import { refreshAutocompleteData } from './autocomplete.js';
import { persistParamEditorState } from './query-params.js';

async function persistUrlUsage(newUrl, type) {
  await persistParamEditorState();
  await saveUrlToHistory(newUrl, type);
  await savePathsAndParams();
  await refreshAutocompleteData();
}

function validateBuiltUrl(newUrl) {
  new URL(newUrl);
  return newUrl;
}

// Apply the new URL and navigate
export async function applyUrl() {
  try {
    const newUrl = validateBuiltUrl(buildUrl());
    await persistUrlUsage(newUrl, 'navigated');

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    await chrome.tabs.update(tab.id, { url: newUrl });

    window.close();
  } catch (error) {
    console.error('Error applying URL:', error);
    alert('Error: Invalid URL format. Please check your inputs.');
  }
}

// Open the edited URL in a new tab
export async function openUrlInNewTab() {
  try {
    const newUrl = validateBuiltUrl(buildUrl());
    await persistUrlUsage(newUrl, 'opened');

    await chrome.tabs.create({ url: newUrl, active: true });
    window.close();
  } catch (error) {
    console.error('Error opening URL in new tab:', error);
    alert('Error: Invalid URL format. Please check your inputs.');
  }
}

// Copy URL to clipboard
export async function copyUrl() {
  try {
    const newUrl = validateBuiltUrl(buildUrl());

    await navigator.clipboard.writeText(newUrl);
    await persistUrlUsage(newUrl, 'copied');

    const btn = document.getElementById('copyUrl');
    const originalText = btn.textContent;
    btn.textContent = '✓ Copied!';
    btn.style.background = '#28a745';

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
    }, 2000);

    await loadHistory();
  } catch (error) {
    console.error('Error copying URL:', error);
    alert('Error copying to clipboard');
  }
}
