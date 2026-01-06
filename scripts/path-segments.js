// Path Segment Operations

import { getUrlObj, setUrlObj } from './constants.js';
import { updatePreview } from './url-manager.js';
import { setupDragAndDrop } from './drag-drop.js';

// Render path segments
export function renderPathSegments() {
  const urlObj = getUrlObj();
  const container = document.getElementById('pathSegments');
  if (!container) return; // Exit if container doesn't exist
  
  container.innerHTML = '';
  
  const pathSegments = urlObj.pathname
    .split('/')
    .filter((segment, index, array) => {
      // Keep empty string at start for leading slash, but not trailing
      if (index === 0 && segment === '') return true;
      return segment !== '';
    });
  
  if (pathSegments.length === 0 || (pathSegments.length === 1 && pathSegments[0] === '')) {
    pathSegments.push('');
  }
  
  pathSegments.forEach((segment, index) => {
    const div = document.createElement('div');
    div.className = 'path-segment';
    div.dataset.index = index;
    
    // Add drag handle for non-root segments
    if (index > 0) {
      const dragHandle = document.createElement('span');
      dragHandle.className = 'drag-handle';
      dragHandle.textContent = '⋮⋮';
      dragHandle.title = 'Drag to reorder';
      div.appendChild(dragHandle);
    }
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = segment;
    input.placeholder = index === 0 ? '/' : 'segment';
    input.draggable = false; // Prevent input from being draggable
    if (index === 0) {
      input.readOnly = true;
      input.style.background = '#e9ecef';
      input.style.flex = '0.15';
      input.style.textAlign = 'center';
      input.style.cursor = 'not-allowed';
    }
    input.dataset.index = index;
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn btn-remove';
    removeBtn.textContent = '🗑️';
    removeBtn.draggable = false; // Prevent button from being draggable
    removeBtn.onclick = () => removePathSegment(index);
    
    // Don't allow removing the first segment (root)
    if (index === 0) {
      removeBtn.disabled = true;
      removeBtn.style.opacity = '0.5';
      removeBtn.style.cursor = 'not-allowed';
    }
    
    div.appendChild(input);
    div.appendChild(removeBtn);
    container.appendChild(div);
    
    // Setup drag and drop
    setupDragAndDrop(div, index);
  });
  
  updatePreview();
}

// Add a new path segment
export function addPathSegment() {
  const container = document.getElementById('pathSegments');
  const div = document.createElement('div');
  div.className = 'path-segment';
  div.dataset.index = container.children.length;
  
  // Add drag handle
  const dragHandle = document.createElement('span');
  dragHandle.className = 'drag-handle';
  dragHandle.textContent = '⋮⋮';
  dragHandle.title = 'Drag to reorder';
  div.appendChild(dragHandle);
  
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'new-segment';
  input.dataset.index = container.children.length;
  
  const removeBtn = document.createElement('button');
  removeBtn.className = 'btn btn-remove';
  removeBtn.textContent = '🗑️';
  removeBtn.onclick = () => {
    div.remove();
    updatePreview();
  };
  
  div.appendChild(input);
  div.appendChild(removeBtn);
  container.appendChild(div);
  
  // Setup drag and drop
  setupDragAndDrop(div, container.children.length);
  
  input.focus();
  updatePreview();
}

// Remove a path segment
export function removePathSegment(index) {
  if (index === 0) return; // Can't remove root
  
  const container = document.getElementById('pathSegments');
  const segments = container.querySelectorAll('.path-segment');
  if (segments[index]) {
    segments[index].remove();
  }
  
  updatePreview();
}


// Add path segment with a specific value
export function addPathSegmentWithValue(value) {
  const container = document.getElementById('pathSegments');
  const currentSegmentCount = container.children.length;
  
  const div = document.createElement('div');
  div.className = 'path-segment';
  div.dataset.index = currentSegmentCount;
  
  // Add drag handle
  const dragHandle = document.createElement('span');
  dragHandle.className = 'drag-handle';
  dragHandle.textContent = '⋮⋮';
  dragHandle.title = 'Drag to reorder';
  div.appendChild(dragHandle);
  
  const input = document.createElement('input');
  input.type = 'text';
  input.value = value;
  input.placeholder = 'segment';
  input.dataset.index = currentSegmentCount;
  
  const removeBtn = document.createElement('button');
  removeBtn.className = 'btn btn-remove';
  removeBtn.textContent = '🗑️';
  removeBtn.onclick = () => {
    div.remove();
    updatePreview();
  };
  
  div.appendChild(input);
  div.appendChild(removeBtn);
  container.appendChild(div);
  
  // Setup drag and drop
  setupDragAndDrop(div, currentSegmentCount);
  
  input.focus();
  updatePreview();
}

