// JSON diff history and sharing

import { STORAGE_KEYS } from './constants.js';

export const HISTORY_STORAGE_KEY = STORAGE_KEYS.JSON_DIFF_HISTORY;
export const SEED_STORAGE_KEY = 'jsonDiffLeft';
export const MAX_HISTORY = 50;
export const SHARE_SIZE_LIMIT = 120000;

function isStorageAvailable() {
  return typeof chrome !== 'undefined' && chrome.storage?.local;
}

function createId() {
  return `diff-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function loadComparisonHistory() {
  if (!isStorageAvailable()) {
    return [];
  }

  const result = await chrome.storage.local.get(HISTORY_STORAGE_KEY);
  return result[HISTORY_STORAGE_KEY] || [];
}

export async function saveComparisonHistory(history) {
  if (!isStorageAvailable()) {
    return;
  }

  await chrome.storage.local.set({
    [HISTORY_STORAGE_KEY]: history.slice(0, MAX_HISTORY),
  });
}

export async function saveNamedComparison({ name, left, right, id = null }) {
  const trimmedName = name.trim();
  if (!trimmedName) {
    throw new Error('Name is required.');
  }

  if (!left.trim() && !right.trim()) {
    throw new Error('Add JSON on at least one side before saving.');
  }

  const history = await loadComparisonHistory();
  const now = Date.now();
  const entry = {
    id: id || createId(),
    name: trimmedName,
    left,
    right,
    createdAt: id ? (history.find((item) => item.id === id)?.createdAt || now) : now,
    updatedAt: now,
  };

  const withoutCurrent = history.filter((item) => item.id !== entry.id);
  withoutCurrent.unshift(entry);
  await saveComparisonHistory(withoutCurrent);
  return entry;
}

export async function deleteComparison(id) {
  const history = await loadComparisonHistory();
  await saveComparisonHistory(history.filter((item) => item.id !== id));
}

export async function renameComparison(id, name) {
  const trimmedName = name.trim();
  if (!trimmedName) {
    throw new Error('Name is required.');
  }

  const history = await loadComparisonHistory();
  const index = history.findIndex((item) => item.id === id);
  if (index === -1) {
    throw new Error('Comparison not found.');
  }

  history[index] = {
    ...history[index],
    name: trimmedName,
    updatedAt: Date.now(),
  };

  await saveComparisonHistory(history);
  return history[index];
}

async function compressToBase64Url(text) {
  const bytes = new TextEncoder().encode(text);
  const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream('gzip'));
  const buffer = await new Response(stream).arrayBuffer();
  const view = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 0x8000;

  for (let i = 0; i < view.length; i += chunkSize) {
    binary += String.fromCharCode(...view.subarray(i, i + chunkSize));
  }

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function decompressFromBase64Url(encoded) {
  const padded = encoded.replace(/-/g, '+').replace(/_/g, '/');
  const padLength = (4 - (padded.length % 4)) % 4;
  const binary = atob(padded + '='.repeat(padLength));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  return new Response(stream).text();
}

export async function createShareLink({ name, left, right }) {
  const payload = JSON.stringify({
    n: name || 'Shared comparison',
    l: left,
    r: right,
    v: 1,
  });

  if (payload.length > SHARE_SIZE_LIMIT) {
    throw new Error('Comparison is too large to share as a link. Export a file instead.');
  }

  const encoded = await compressToBase64Url(payload);
  const baseUrl = chrome.runtime.getURL('json-diff.html');
  return `${baseUrl}#s=${encoded}`;
}

export async function parseShareLink(hash) {
  if (!hash || !hash.startsWith('#s=')) {
    return null;
  }

  const encoded = hash.slice(3);
  const json = await decompressFromBase64Url(encoded);
  const payload = JSON.parse(json);

  return {
    name: payload.n || 'Shared comparison',
    left: payload.l || '',
    right: payload.r || '',
  };
}

export function exportComparisonFile({ name, left, right }) {
  const payload = {
    name: name || 'JSON comparison',
    left,
    right,
    exportedAt: new Date().toISOString(),
    version: 1,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  const safeName = (name || 'json-comparison').replace(/[^\w\-]+/g, '-').slice(0, 60);
  anchor.href = url;
  anchor.download = `${safeName}.jsondiff.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function importComparisonFile(file) {
  const text = await file.text();
  const payload = JSON.parse(text);

  if (!payload.left && !payload.right) {
    throw new Error('File does not contain left/right JSON.');
  }

  return {
    name: payload.name || file.name.replace(/\.json(?:diff)?\.json$/i, ''),
    left: payload.left || '',
    right: payload.right || '',
  };
}

export function formatHistoryDate(timestamp) {
  return new Date(timestamp).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
