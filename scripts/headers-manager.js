// Request Headers Management

import { updatePreview } from './url-manager.js';

let headerCount = 0;

// Add a new header row
export function addHeader(key = '', value = '') {
  const container = document.getElementById('requestHeaders');
  const headerId = `header-${headerCount++}`;
  
  const row = document.createElement('div');
  row.className = 'header-row';
  row.id = headerId;
  
  row.innerHTML = `
    <input type="text" placeholder="Header Name (e.g., Authorization)" value="${key}" data-type="header-key">
    <input type="text" placeholder="Header Value (e.g., Bearer token...)" value="${value}" data-type="header-value">
    <button class="btn btn-remove" onclick="window.removeHeader('${headerId}')">🗑️</button>
  `;
  
  container.appendChild(row);
  
  // Focus on the first input
  if (!key) {
    row.querySelector('input').focus();
  }
}

// Remove a header row
export function removeHeader(headerId) {
  const row = document.getElementById(headerId);
  if (row) {
    row.remove();
  }
}

// Get all headers as an object
export function getHeaders() {
  const headers = {};
  const rows = document.querySelectorAll('#requestHeaders .header-row');
  
  rows.forEach(row => {
    const keyInput = row.querySelector('[data-type="header-key"]');
    const valueInput = row.querySelector('[data-type="header-value"]');
    
    if (keyInput && valueInput) {
      const key = keyInput.value.trim();
      const value = valueInput.value.trim();
      
      if (key) {
        headers[key] = value;
      }
    }
  });
  
  return headers;
}

// Load headers from an object
export function loadHeaders(headersObj) {
  clearHeaders();
  
  if (headersObj && typeof headersObj === 'object') {
    Object.entries(headersObj).forEach(([key, value]) => {
      addHeader(key, value);
    });
  }
  
  // Add one empty header row if no headers
  if (Object.keys(headersObj || {}).length === 0) {
    addHeader();
  }
}

// Clear all headers
export function clearHeaders() {
  const container = document.getElementById('requestHeaders');
  if (container) {
    container.innerHTML = '';
  }
  headerCount = 0;
}

// Expose functions globally for inline onclick handlers
window.removeHeader = removeHeader;

