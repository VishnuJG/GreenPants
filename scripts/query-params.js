// Query Parameter Operations

import { getUrlObj } from './constants.js';
import { updatePreview } from './url-manager.js';

// Render query parameters
export function renderQueryParams() {
  const urlObj = getUrlObj();
  const container = document.getElementById('queryParams');
  if (!container) return; // Exit if container doesn't exist
  
  container.innerHTML = '';
  
  const params = Array.from(urlObj.searchParams.entries());
  
  if (params.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.textContent = 'No query parameters';
    container.appendChild(emptyState);
    return;
  }
  
  params.forEach(([key, value], index) => {
    const div = document.createElement('div');
    div.className = 'param-row';
    
    const keyInput = document.createElement('input');
    keyInput.type = 'text';
    keyInput.value = key;
    keyInput.placeholder = 'key';
    keyInput.dataset.type = 'key';
    keyInput.dataset.index = index;
    
    const valueInput = document.createElement('input');
    valueInput.type = 'text';
    valueInput.value = value;
    valueInput.placeholder = 'value';
    valueInput.dataset.type = 'value';
    valueInput.dataset.index = index;
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn btn-remove';
    removeBtn.textContent = '🗑️';
    removeBtn.onclick = () => removeQueryParam(key);
    
    div.appendChild(keyInput);
    div.appendChild(valueInput);
    div.appendChild(removeBtn);
    container.appendChild(div);
  });
  
  updatePreview();
}

// Add a new query parameter
export function addQueryParam() {
  const container = document.getElementById('queryParams');
  
  // Remove empty state if present
  const emptyState = container.querySelector('.empty-state');
  if (emptyState) {
    emptyState.remove();
  }
  
  const div = document.createElement('div');
  div.className = 'param-row';
  
  const keyInput = document.createElement('input');
  keyInput.type = 'text';
  keyInput.placeholder = 'key';
  keyInput.dataset.type = 'key';
  
  const valueInput = document.createElement('input');
  valueInput.type = 'text';
  valueInput.placeholder = 'value';
  valueInput.dataset.type = 'value';
  
  const removeBtn = document.createElement('button');
  removeBtn.className = 'btn btn-remove';
  removeBtn.textContent = '🗑️';
  removeBtn.onclick = () => {
    div.remove();
    // Show empty state if no params left
    if (container.children.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'empty-state';
      emptyState.textContent = 'No query parameters';
      container.appendChild(emptyState);
    }
    updatePreview();
  };
  
  div.appendChild(keyInput);
  div.appendChild(valueInput);
  div.appendChild(removeBtn);
  container.appendChild(div);
  
  keyInput.focus();
  updatePreview();
}

// Remove a query parameter
export function removeQueryParam(key) {
  const urlObj = getUrlObj();
  urlObj.searchParams.delete(key);
  renderQueryParams();
}

// Add query param with a specific key
export function addQueryParamWithKey(key) {
  const container = document.getElementById('queryParams');
  
  // Remove empty state if present
  const emptyState = container.querySelector('.empty-state');
  if (emptyState) {
    emptyState.remove();
  }
  
  const div = document.createElement('div');
  div.className = 'param-row';
  
  const keyInput = document.createElement('input');
  keyInput.type = 'text';
  keyInput.value = key;
  keyInput.placeholder = 'key';
  keyInput.dataset.type = 'key';
  
  const valueInput = document.createElement('input');
  valueInput.type = 'text';
  valueInput.placeholder = 'value';
  valueInput.dataset.type = 'value';
  
  const removeBtn = document.createElement('button');
  removeBtn.className = 'btn btn-remove';
  removeBtn.textContent = '🗑️';
  removeBtn.onclick = () => {
    div.remove();
    if (container.children.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'empty-state';
      emptyState.textContent = 'No query parameters';
      container.appendChild(emptyState);
    }
    updatePreview();
  };
  
  div.appendChild(keyInput);
  div.appendChild(valueInput);
  div.appendChild(removeBtn);
  container.appendChild(div);
  
  valueInput.focus();
  updatePreview();
}

