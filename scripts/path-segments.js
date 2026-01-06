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
    // Use the actual DOM element instead of index to handle drag-and-drop reordering
    removeBtn.onclick = (e) => {
      e.stopPropagation(); // Prevent any event bubbling
      const segmentElement = e.target.closest('.path-segment');
      const container = segmentElement?.parentElement;
      // Prevent removing root segment (first segment or one with index 0)
      if (segmentElement && 
          segmentElement.dataset.index !== '0' && 
          container && 
          container.firstElementChild !== segmentElement) {
        segmentElement.remove();
        updatePreview();
      }
    };
    
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
  removeBtn.draggable = false;
  removeBtn.onclick = (e) => {
    e.stopPropagation();
    const segmentElement = e.target.closest('.path-segment');
    const container = segmentElement?.parentElement;
    // Prevent removing root segment (first segment or one with index 0)
    if (segmentElement && 
        segmentElement.dataset.index !== '0' && 
        container && 
        container.firstElementChild !== segmentElement) {
      segmentElement.remove();
      updatePreview();
    }
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
// This function is kept for backward compatibility, but now works with DOM element
export function removePathSegment(index) {
  if (index === 0) return; // Can't remove root
  
  const container = document.getElementById('pathSegments');
  const segments = Array.from(container.querySelectorAll('.path-segment'));
  // Find segment by its dataset.index attribute, not DOM position
  const segmentToRemove = segments.find(seg => seg.dataset.index === String(index));
  if (segmentToRemove && segmentToRemove.dataset.index !== '0') {
    segmentToRemove.remove();
    updatePreview();
  }
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
  removeBtn.draggable = false;
  removeBtn.onclick = (e) => {
    e.stopPropagation();
    const segmentElement = e.target.closest('.path-segment');
    const container = segmentElement?.parentElement;
    // Prevent removing root segment (first segment or one with index 0)
    if (segmentElement && 
        segmentElement.dataset.index !== '0' && 
        container && 
        container.firstElementChild !== segmentElement) {
      segmentElement.remove();
      updatePreview();
    }
  };
  
  div.appendChild(input);
  div.appendChild(removeBtn);
  container.appendChild(div);
  
  // Setup drag and drop
  setupDragAndDrop(div, currentSegmentCount);
  
  input.focus();
  updatePreview();
}

