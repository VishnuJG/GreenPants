// HTTP Request Handler

import { buildUrl } from './url-manager.js';
import { getHeaders } from './headers-manager.js';
import { getBody, getBodyType, getContentTypeHeader } from './body-manager.js';

let currentMethod = 'GET';

// Initialize HTTP method selector
export function initHttpMethod() {
  const methodButtons = document.querySelectorAll('.method-btn');
  
  methodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      methodButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMethod = btn.dataset.method;
      
      // Enable/disable body tab based on method
      updateBodyTabState();
    });
  });
}

// Update body tab state based on method
function updateBodyTabState() {
  const requestTab = document.querySelector('[data-tab="request"]');
  
  // Just update the title hint, don't disable
  if (currentMethod === 'GET' || currentMethod === 'DELETE') {
    if (requestTab) {
      requestTab.title = 'Body not typically used with ' + currentMethod;
    }
  } else {
    if (requestTab) {
      requestTab.title = '';
    }
  }
}

// Get current HTTP method
export function getMethod() {
  return currentMethod;
}

// Set HTTP method
export function setMethod(method) {
  currentMethod = method;
  const methodButtons = document.querySelectorAll('.method-btn');
  
  methodButtons.forEach(btn => {
    if (btn.dataset.method === method) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  updateBodyTabState();
}

// Send HTTP request and open response in new tab
export async function sendRequest() {
  const sendButton = document.getElementById('sendRequest');
  let responseTab = null;
  
  try {
    // Disable send button
    if (sendButton) {
      sendButton.disabled = true;
      sendButton.textContent = '⏳ Sending...';
    }
    
    // Build request FIRST (before opening viewer)
    const url = buildUrl();
    const headers = getHeaders();
    const body = getBodyType() !== 'none' ? getBody() : null;
    
    // Add Content-Type header if body exists and not already set
    if (body && !headers['Content-Type'] && !headers['content-type']) {
      const contentType = getContentTypeHeader();
      if (contentType) {
        headers['Content-Type'] = contentType;
      }
    }
    
    // Prepare fetch options
    const fetchOptions = {
      method: currentMethod,
      headers: headers
    };
    
    // Add body for methods that support it
    if (body && currentMethod !== 'GET' && currentMethod !== 'HEAD') {
      if (getBodyType() === 'form') {
        // Convert form data string to URLSearchParams
        const formData = new URLSearchParams();
        body.split('\n').forEach(line => {
          const [key, ...valueParts] = line.split('=');
          if (key && valueParts.length > 0) {
            formData.append(key.trim(), valueParts.join('=').trim());
          }
        });
        fetchOptions.body = formData.toString();
      } else {
        fetchOptions.body = body;
      }
    }
    
    // Send request
    const startTime = Date.now();
    const response = await fetch(url, fetchOptions);
    const duration = Date.now() - startTime;
    
    // Parse response
    const contentType = response.headers.get('content-type');
    let responseData;
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }
    
    // Store response data in chrome.storage for the viewer to read
    const responsePayload = {
      status: response.ok ? 'success' : 'error',
      statusCode: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      data: responseData,
      duration: duration,
      method: currentMethod,
      url: buildUrl(),
      timestamp: Date.now()
    };
    
    // Save to storage
    await chrome.storage.local.set({ 'latestResponse': responsePayload });
    console.log('Response saved to storage:', responsePayload);
    
    // NOW open response viewer tab (after data is ready)
    responseTab = await chrome.tabs.create({
      url: chrome.runtime.getURL('response-viewer.html'),
      active: true
    });
    
  } catch (error) {
    console.error('Request error:', error);
    
    // Try to save error to storage and open viewer
    try {
      const errorPayload = {
        status: 'error',
        message: error.message,
        error: error.toString(),
        method: currentMethod,
        url: buildUrl(),
        timestamp: Date.now()
      };
      await chrome.storage.local.set({ 'latestResponse': errorPayload });
      console.log('Error saved to storage:', errorPayload);
      
      // Open response viewer to show error
      responseTab = await chrome.tabs.create({
        url: chrome.runtime.getURL('response-viewer.html'),
        active: true
      });
    } catch (e) {
      console.error('Could not save error:', e);
      alert('❌ Request Error:\n\n' + error.message);
    }
  } finally {
    // Re-enable send button
    if (sendButton) {
      sendButton.disabled = false;
      sendButton.textContent = '🚀 Send Request';
    }
  }
  
  // Close the extension popup
  window.close();
}

// Send message with retry mechanism
async function sendMessageWithRetry(tabId, message, maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await chrome.tabs.sendMessage(tabId, message);
      console.log('Message sent successfully on attempt', i + 1);
      return; // Success!
    } catch (error) {
      console.log(`Attempt ${i + 1} failed:`, error.message);
      if (i < maxRetries - 1) {
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 200 * (i + 1)));
      } else {
        throw error; // Failed all attempts
      }
    }
  }
}

// Ensure content script is injected into the page (legacy, kept for compatibility)
async function ensureContentScriptInjected(tabId) {
  try {
    // Try to ping the content script to see if it's already loaded
    await chrome.tabs.sendMessage(tabId, { type: 'PING' });
    // If we get here, content script is already loaded
    return;
  } catch (error) {
    // Content script not loaded, inject it manually
    console.log('Injecting response panel content script...');
    
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['scripts/response-panel.js']
      });
      
      // Wait a moment for the script to initialize
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (injectError) {
      console.error('Failed to inject content script:', injectError);
      throw new Error('Cannot inject response panel on this page. Please navigate to a regular webpage.');
    }
  }
}


// Export for testing
export function getRequestConfig() {
  return {
    url: buildUrl(),
    method: currentMethod,
    headers: getHeaders(),
    body: getBodyType() !== 'none' ? getBody() : null,
    bodyType: getBodyType()
  };
}

