// Drag and Drop for Path Segments

import { updatePreview } from './url-manager.js';

let draggedElement = null;
let isDragHandleActive = false;

// Setup drag and drop for a segment element
export function setupDragAndDrop(element, index) {
  // Don't allow dragging the root segment
  if (index === 0) {
    element.draggable = false;
    return;
  }

  // Find the drag handle and make only it trigger dragging
  const dragHandle = element.querySelector('.drag-handle');
  if (dragHandle) {
    // When mousedown on drag handle, make parent draggable
    dragHandle.addEventListener('mousedown', (e) => {
      isDragHandleActive = true;
      element.draggable = true;
      e.stopPropagation(); // Prevent event from bubbling
    });
    
    // Reset on mouseup anywhere
    document.addEventListener('mouseup', () => {
      isDragHandleActive = false;
    });
  }

  element.addEventListener('dragstart', handleDragStart);
  element.addEventListener('dragend', handleDragEnd);
  element.addEventListener('dragover', handleDragOver);
  element.addEventListener('drop', handleDrop);
  element.addEventListener('dragleave', handleDragLeave);
  
  // Prevent dragging from inputs and buttons
  const input = element.querySelector('input');
  const button = element.querySelector('button');
  
  if (input) {
    input.addEventListener('mousedown', (e) => {
      element.draggable = false;
      e.stopPropagation();
    });
  }
  
  if (button) {
    button.addEventListener('mousedown', (e) => {
      element.draggable = false;
      e.stopPropagation();
    });
  }
}

function handleDragStart(e) {
  // Only allow drag if initiated from drag handle
  if (!isDragHandleActive) {
    e.preventDefault();
    return;
  }
  
  draggedElement = e.currentTarget;
  e.currentTarget.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
}

function handleDragEnd(e) {
  e.currentTarget.classList.remove('dragging');
  
  // Remove draggable after drag ends
  e.currentTarget.draggable = false;
  
  // Remove all drag-over classes
  const segments = document.querySelectorAll('.path-segment');
  segments.forEach(segment => {
    segment.classList.remove('drag-over');
  });
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  
  e.dataTransfer.dropEffect = 'move';
  
  const target = e.currentTarget;
  
  // Don't allow dropping on root segment
  if (target.dataset.index === '0') {
    return false;
  }
  
  if (draggedElement !== target) {
    target.classList.add('drag-over');
  }
  
  return false;
}

function handleDragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  
  e.preventDefault();
  
  const target = e.currentTarget;
  
  // Don't allow dropping on root segment or itself
  if (target.dataset.index === '0' || draggedElement === target) {
    return false;
  }
  
  // Get the container
  const container = target.parentNode;
  
  // Insert the dragged element before the target
  container.insertBefore(draggedElement, target);
  
  // Update dataset.index values to reflect new order (except root which stays 0)
  const segments = container.querySelectorAll('.path-segment');
  segments.forEach((segment, newIndex) => {
    // Root segment always has index 0
    if (newIndex === 0) {
      segment.dataset.index = '0';
    } else {
      segment.dataset.index = String(newIndex);
    }
    // Also update input dataset.index
    const input = segment.querySelector('input');
    if (input) {
      input.dataset.index = String(newIndex);
    }
  });
  
  updatePreview();
  
  return false;
}

