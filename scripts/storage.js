// Storage, History, and Suggestions Management

import { STORAGE_KEYS, MAX_HISTORY_ITEMS, MAX_SUGGESTIONS } from './constants.js';
import { loadUrlIntoEditor } from './url-manager.js';
import { addPathSegmentWithValue } from './path-segments.js';
import { addQueryParamWithKey } from './query-params.js';

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
    
    paramRows.forEach(row => {
      const keyInput = row.querySelector('[data-type="key"]');
      const valueInput = row.querySelector('[data-type="value"]');
      const key = keyInput.value.trim();
      
      if (key) {
        params.push(key);
      }
    });
    
    // Load existing
    const result = await chrome.storage.local.get([STORAGE_KEYS.PATH_SEGMENTS, STORAGE_KEYS.QUERY_PARAMS]);
    let savedPaths = result[STORAGE_KEYS.PATH_SEGMENTS] || [];
    let savedParams = result[STORAGE_KEYS.QUERY_PARAMS] || [];
    
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
      [STORAGE_KEYS.QUERY_PARAMS]: savedParams
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

// Load suggestions (path segments and params)
export async function loadSuggestions() {
  const pathContainer = document.getElementById('recentPaths');
  const paramContainer = document.getElementById('recentParams');
  
  if (!isStorageAvailable()) {
    pathContainer.innerHTML = '';
    const errorState1 = document.createElement('div');
    errorState1.className = 'empty-state';
    errorState1.textContent = '⚠️ Please reload the extension';
    errorState1.style.color = '#e53e3e';
    pathContainer.appendChild(errorState1);
    
    paramContainer.innerHTML = '';
    const errorState2 = document.createElement('div');
    errorState2.className = 'empty-state';
    errorState2.textContent = '⚠️ Please reload the extension';
    errorState2.style.color = '#e53e3e';
    paramContainer.appendChild(errorState2);
    return;
  }
  
  try {
    const result = await chrome.storage.local.get([STORAGE_KEYS.PATH_SEGMENTS, STORAGE_KEYS.QUERY_PARAMS]);
    const paths = result[STORAGE_KEYS.PATH_SEGMENTS] || [];
    const params = result[STORAGE_KEYS.QUERY_PARAMS] || [];
    
    // Render path chips
    pathContainer.innerHTML = '';
    
    if (paths.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'empty-state';
      emptyState.textContent = 'No recent paths';
      pathContainer.appendChild(emptyState);
    } else {
      paths.forEach(path => {
        const chip = document.createElement('span');
        chip.className = 'chip';
        chip.textContent = path;
        chip.addEventListener('click', () => {
          addPathSegmentWithValue(path);
        });
        pathContainer.appendChild(chip);
      });
    }
    
    // Render param chips
    paramContainer.innerHTML = '';
    
    if (params.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'empty-state';
      emptyState.textContent = 'No recent parameters';
      paramContainer.appendChild(emptyState);
    } else {
      params.forEach(param => {
        const chip = document.createElement('span');
        chip.className = 'chip';
        chip.textContent = param;
        chip.addEventListener('click', () => {
          addQueryParamWithKey(param);
        });
        paramContainer.appendChild(chip);
      });
    }
  } catch (error) {
    console.error('Error loading suggestions:', error);
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

// Clear suggestions
export async function clearSuggestions() {
  if (!isStorageAvailable()) {
    alert('Storage API not available. Please reload the extension.');
    return;
  }
  
  if (confirm('Are you sure you want to clear all suggestions?')) {
    await chrome.storage.local.set({
      [STORAGE_KEYS.PATH_SEGMENTS]: [],
      [STORAGE_KEYS.QUERY_PARAMS]: []
    });
    await loadSuggestions();
  }
}

