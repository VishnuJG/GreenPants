// URL Management - Loading, Display, Building, Preview

import { currentUrl, urlObj, setCurrentUrl, setUrlObj, getCurrentUrl, getUrlObj } from './constants.js';
import { renderPathSegments } from './path-segments.js';
import { renderQueryParams } from './query-params.js';

// Load the current tab's URL
export async function loadCurrentUrl() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url) {
      setCurrentUrl(tab.url);
      setUrlObj(new URL(tab.url));
      displayUrl();
      await populateFields();
    }
  } catch (error) {
    console.error('Error loading URL:', error);
    // Update all URL fields if they exist
    const urlFields = document.querySelectorAll('.url-display');
    if (urlFields.length > 0) {
      urlFields.forEach(field => {
        if (field) field.value = 'Error loading URL';
      });
    }
  }
}

// Display the current URL
export function displayUrl() {
  const url = getCurrentUrl();
  // Update all URL display fields if they exist
  const urlFields = document.querySelectorAll('.url-display');
  if (urlFields.length > 0) {
    urlFields.forEach(field => {
      if (field) field.value = url;
    });
  }
}

// Populate all input fields with current URL components
export async function populateFields({ preserveParamDom = false } = {}) {
  const url = getUrlObj();
  
  // Protocol and Host
  const protocolField = document.getElementById('protocol');
  const hostField = document.getElementById('host');
  const hashField = document.getElementById('hash');
  
  if (protocolField) protocolField.value = url.protocol;
  if (hostField) hostField.value = url.host;
  
  // Path segments - only render if container exists
  const pathContainer = document.getElementById('pathSegments');
  if (pathContainer) {
    renderPathSegments();
  }
  
  // Query parameters - only render if container exists
  const paramContainer = document.getElementById('queryParams');
  if (paramContainer) {
    await renderQueryParams({ preserveDom: preserveParamDom });
  }
  
  // Hash
  if (hashField) hashField.value = url.hash.replace('#', '');
}

// Load a URL into the editor
export async function loadUrlIntoEditor(url) {
  try {
    setUrlObj(new URL(url));
    setCurrentUrl(url);
    displayUrl();
    await populateFields();
  } catch (error) {
    console.error('Error loading URL into editor:', error);
  }
}

// Build URL from current inputs
export function buildUrl() {
  // Get protocol and host
  const protocolField = document.getElementById('protocol');
  const hostField = document.getElementById('host');
  
  if (!protocolField || !hostField) {
    return getCurrentUrl(); // Return current URL if fields don't exist
  }
  
  const protocol = protocolField.value;
  const host = hostField.value;
  
  // Get path segments
  const pathContainer = document.getElementById('pathSegments');
  if (!pathContainer) {
    return getCurrentUrl(); // Return current URL if container doesn't exist
  }
  
  const pathInputs = pathContainer.querySelectorAll('input');
  let path = '';
  
  pathInputs.forEach((input, index) => {
    if (index === 0) {
      path += '/'; // Root
    } else {
      const segment = input.value.trim();
      if (segment) {
        path += segment + '/';
      }
    }
  });
  
  // Remove trailing slash if present (except for root)
  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1);
  }
  
  // Get query parameters
  const paramContainer = document.getElementById('queryParams');
  if (!paramContainer) {
    return getCurrentUrl(); // Return current URL if container doesn't exist
  }
  
  const paramRows = paramContainer.querySelectorAll('.param-row');
  const searchParams = new URLSearchParams();
  
  paramRows.forEach(row => {
    const toggle = row.querySelector('.param-toggle');
    if (toggle && !toggle.checked) {
      return;
    }

    const keyInput = row.querySelector('[data-type="key"]');
    const valueInput = row.querySelector('[data-type="value"]');
    const key = keyInput.value.trim();
    const value = valueInput.value.trim();

    if (key) {
      searchParams.append(key, value);
    }
  });
  
  // Get hash
  const hashField = document.getElementById('hash');
  const hash = hashField ? hashField.value.trim() : '';
  
  // Build complete URL
  let newUrl = `${protocol}//${host}${path}`;
  
  const queryString = searchParams.toString();
  if (queryString) {
    newUrl += '?' + queryString;
  }
  
  if (hash) {
    newUrl += '#' + hash;
  }
  
  return newUrl;
}

function normalizeUrl(urlString) {
  try {
    return new URL(urlString).href;
  } catch {
    return urlString.trim();
  }
}

// Update preview
export function updatePreview() {
  try {
    const newUrl = buildUrl();
    // Update all URL display fields if they exist
    const urlFields = document.querySelectorAll('.url-display');
    if (urlFields.length > 0) {
      urlFields.forEach(field => {
        if (field) field.value = newUrl;
      });
    }
  } catch (error) {
    console.error('Error building URL:', error);
  }
}

// Parse URL from the editable field and update all components
export async function parseUrlFromField(event) {
  try {
    // Get value from the field that triggered the event, or first field if no event
    const firstField = document.querySelector('.url-display');
    if (!firstField) return; // Exit if no URL fields exist
    
    const urlInput = event && event.target 
      ? event.target.value.trim()
      : firstField.value.trim();
    
    if (!urlInput) return;

    // Skip re-parsing when the URL field already reflects the current editor state.
    // This keeps disabled params in the list when toggling them off updates the preview.
    try {
      if (normalizeUrl(urlInput) === normalizeUrl(buildUrl())) {
        return;
      }
    } catch {
      // Fall through to manual URL parsing.
    }
    
    const parsedUrl = new URL(urlInput);
    setUrlObj(parsedUrl);
    setCurrentUrl(urlInput);
    
    // Update all fields
    await populateFields({ preserveParamDom: true });
    
    // Sync all URL display fields
    const urlFields = document.querySelectorAll('.url-display');
    if (urlFields.length > 0) {
      urlFields.forEach(field => {
        if (field) field.value = urlInput;
      });
    }
  } catch (error) {
    console.error('Error parsing URL:', error);
    // Invalid URL - don't update
  }
}

