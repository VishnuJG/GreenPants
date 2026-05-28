// Main Entry Point - Initialization and Event Listeners

import { loadCurrentUrl, updatePreview, parseUrlFromField } from './url-manager.js';
import { addPathSegment } from './path-segments.js';
import { addQueryParam } from './query-params.js';
import { loadHistory, loadSuggestions, clearHistory, clearSuggestions } from './storage.js';
import { applyUrl, copyUrl } from './actions.js';
import { setupTabs, setupCollapsibles } from './ui-helpers.js';
import { loadTimestampSettings, setupTimestampListeners } from './timestamp-settings.js';
import { addHeader, loadHeaders } from './headers-manager.js';
import { initBodyManager, setBody } from './body-manager.js';
import { initHttpMethod, sendRequest } from './http-request.js';
import { initTheme } from './theme-manager.js';

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  // Check if we're on the popup page (not response viewer)
  const isPopup = document.getElementById('tabNav') !== null;
  
  if (isPopup) {
    await initTheme(); // Initialize theme first for better UX
    await setupTabs(); // Setup tabs first to ensure DOM is ready
    setupCollapsibles();
    await loadCurrentUrl();
    await loadHistory();
    await loadSuggestions();
    await loadTimestampSettings();
    setupEventListeners();
    setupTimestampListeners();
    initHttpMethod();
    initBodyManager();
    loadHeaders({}); // Initialize with one empty header row
  }
});

// Setup event listeners
function setupEventListeners() {
  // Add buttons
  document.getElementById('addPath').addEventListener('click', addPathSegment);
  document.getElementById('addParam').addEventListener('click', addQueryParam);
  document.getElementById('addHeader').addEventListener('click', () => addHeader());
  
  // Action buttons
  document.getElementById('applyUrl').addEventListener('click', applyUrl);
  document.getElementById('copyUrl').addEventListener('click', copyUrl);
  document.getElementById('sendRequest').addEventListener('click', sendRequest);
  
  // History buttons
  document.getElementById('clearHistory').addEventListener('click', clearHistory);
  document.getElementById('clearSuggestions').addEventListener('click', clearSuggestions);
  
  // Global Enter key handler - triggers Navigate button
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      // Don't trigger if user is typing in textarea (allow multi-line)
      if (e.target.tagName === 'TEXTAREA') {
        return;
      }
      
      // Handle Enter key in input fields
      if (e.target.tagName === 'INPUT') {
        e.preventDefault();
        
        // Blur the input to commit the change
        e.target.blur();
        
        // Small delay to ensure the change is processed
        setTimeout(() => {
          // Trigger Navigate button
          const applyButton = document.getElementById('applyUrl');
          if (applyButton && !applyButton.disabled) {
            applyButton.click();
          }
        }, 50);
        return;
      }
      
      // Trigger Navigate button for other elements
      e.preventDefault();
      const applyButton = document.getElementById('applyUrl');
      if (applyButton && !applyButton.disabled) {
        applyButton.click();
      }
    }
  });
  
  // Update preview on any input change (except currentUrl textarea)
  document.addEventListener('input', (e) => {
    if (e.target.tagName === 'INPUT') {
      updatePreview();
    }
  });
  
  // Handle direct URL editing for all URL fields
  const urlFields = document.querySelectorAll('.url-display');
  urlFields.forEach(urlField => {
    urlField.addEventListener('blur', parseUrlFromField);
    
    // Sync all URL fields when one changes
    urlField.addEventListener('input', (e) => {
      const value = e.target.value;
      document.querySelectorAll('.url-display').forEach(field => {
        if (field !== e.target) {
          field.value = value;
        }
      });
    });
  });
}

