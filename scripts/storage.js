// Storage, History, and Suggestions Management

import { STORAGE_KEYS, MAX_HISTORY_ITEMS, MAX_SUGGESTIONS } from './constants.js';
import { loadUrlIntoEditor } from './url-manager.js';

// Check if storage API is available
export function isStorageAvailable() {
  return typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local;
}

// Save URL to history
export async function saveUrlToHistory(url, type) {
  if (!isStorageAvailable()) {
    console.warn('Storage API not available. Please reload the extension.');
    return;
  }
  
  try {
    const result = await chrome.storage.local.get(STORAGE_KEYS.URL_HISTORY);
    let history = result[STORAGE_KEYS.URL_HISTORY] || [];
    
    // Add new entry
    const entry = {
      url: url,
      type: type,
      timestamp: Date.now()
    };
    
    // Remove duplicates
    history = history.filter(item => item.url !== url);
    
    // Add to beginning
    history.unshift(entry);
    
    // Limit size
    if (history.length > MAX_HISTORY_ITEMS) {
      history = history.slice(0, MAX_HISTORY_ITEMS);
    }
    
    // Save
    await chrome.storage.local.set({ [STORAGE_KEYS.URL_HISTORY]: history });
  } catch (error) {
    console.error('Error saving URL to history:', error);
  }
}

// Save path segments and query parameters
export async function savePathsAndParams() {
  if (!isStorageAvailable()) {
    console.warn('Storage API not available. Please reload the extension.');
    return;
  }
  
  try {
    // Get current path segments
    const pathContainer = document.getElementById('pathSegments');
    const pathInputs = pathContainer.querySelectorAll('input');
    const paths = [];
    
    pathInputs.forEach((input, index) => {
      if (index > 0) { // Skip root
        const segment = input.value.trim();
        if (segment) {
          paths.push(segment);
        }
      }
    });
    
    // Get current query parameters
    const paramContainer = document.getElementById('queryParams');
    const paramRows = paramContainer.querySelectorAll('.param-row');
    const params = [];

    // Load existing
    const result = await chrome.storage.local.get([
      STORAGE_KEYS.PATH_SEGMENTS,
      STORAGE_KEYS.QUERY_PARAMS,
      STORAGE_KEYS.QUERY_PARAM_VALUES,
    ]);
    let savedPaths = result[STORAGE_KEYS.PATH_SEGMENTS] || [];
    let savedParams = result[STORAGE_KEYS.QUERY_PARAMS] || [];
    let savedParamValues = result[STORAGE_KEYS.QUERY_PARAM_VALUES] || {};

    paramRows.forEach(row => {
      const keyInput = row.querySelector('[data-type="key"]');
      const valueInput = row.querySelector('[data-type="value"]');
      const key = keyInput.value.trim();
      const value = valueInput.value.trim();

      if (key) {
        params.push(key);
      }

      if (key && value) {
        if (!savedParamValues[key]) {
          savedParamValues[key] = [];
        }
        savedParamValues[key] = savedParamValues[key].filter(v => v !== value);
        savedParamValues[key].unshift(value);
        savedParamValues[key] = savedParamValues[key].slice(0, MAX_SUGGESTIONS);
      }
    });
    
    // Add new paths
    paths.forEach(path => {
      if (!savedPaths.includes(path)) {
        savedPaths.unshift(path);
      }
    });
    
    // Add new params
    params.forEach(param => {
      if (!savedParams.includes(param)) {
        savedParams.unshift(param);
      }
    });
    
    // Limit size
    savedPaths = savedPaths.slice(0, MAX_SUGGESTIONS);
    savedParams = savedParams.slice(0, MAX_SUGGESTIONS);
    
    // Save
    await chrome.storage.local.set({
      [STORAGE_KEYS.PATH_SEGMENTS]: savedPaths,
      [STORAGE_KEYS.QUERY_PARAMS]: savedParams,
      [STORAGE_KEYS.QUERY_PARAM_VALUES]: savedParamValues,
    });
  } catch (error) {
    console.error('Error saving paths and params:', error);
  }
}

// Load and display history
export async function loadHistory() {
  const container = document.getElementById('urlHistory');
  
  if (!isStorageAvailable()) {
    container.innerHTML = '';
    const errorState = document.createElement('div');
    errorState.className = 'empty-state';
    errorState.textContent = '⚠️ Please reload the extension';
    errorState.style.color = '#e53e3e';
    container.appendChild(errorState);
    return;
  }
  
  try {
    const result = await chrome.storage.local.get(STORAGE_KEYS.URL_HISTORY);
    const history = result[STORAGE_KEYS.URL_HISTORY] || [];
    
    container.innerHTML = '';
    
    if (history.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'empty-state';
      emptyState.textContent = 'No history yet';
      container.appendChild(emptyState);
      return;
    }
    
    history.forEach(entry => {
      const div = document.createElement('div');
      div.className = 'history-item';
      div.title = entry.url; // Show full URL on hover
      
      const urlSpan = document.createElement('span');
      urlSpan.className = 'history-url';
      urlSpan.textContent = entry.url;
      
      const badge = document.createElement('span');
      badge.className = `history-badge ${entry.type === 'copied' ? 'copied' : ''}`;
      badge.textContent = entry.type;
      
      div.appendChild(urlSpan);
      div.appendChild(badge);
      
      // Click to load URL
      div.addEventListener('click', () => {
        loadUrlIntoEditor(entry.url);
      });
      
      container.appendChild(div);
    });
  } catch (error) {
    console.error('Error loading history:', error);
  }
}

// Clear history
export async function clearHistory() {
  if (!isStorageAvailable()) {
    alert('Storage API not available. Please reload the extension.');
    return;
  }
  
  if (confirm('Are you sure you want to clear all URL history?')) {
    await chrome.storage.local.set({ [STORAGE_KEYS.URL_HISTORY]: [] });
    await loadHistory();
  }
}

