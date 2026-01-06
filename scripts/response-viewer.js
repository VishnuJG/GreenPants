// Response Viewer Script
console.log('Response viewer script loaded');

// Load response data from storage on page load
async function loadResponseData() {
  console.log('Loading response data from storage...');
  try {
    const result = await chrome.storage.local.get('latestResponse');
    console.log('Storage result:', result);
    
    if (result.latestResponse) {
      console.log('Found response data:', result.latestResponse);
      displayResponse(result.latestResponse);
      // Clear the storage after loading
      await chrome.storage.local.remove('latestResponse');
    } else {
      console.log('No response data found in storage');
    }
  } catch (error) {
    console.error('Error loading response:', error);
  }
}

// Load data when page loads
window.addEventListener('DOMContentLoaded', loadResponseData);

// Also listen for storage changes (in case data arrives later)
chrome.storage.onChanged.addListener((changes, area) => {
  console.log('Storage changed:', changes, area);
  if (area === 'local' && changes.latestResponse) {
    console.log('New response data detected:', changes.latestResponse.newValue);
    if (changes.latestResponse.newValue) {
      displayResponse(changes.latestResponse.newValue);
    }
  }
});

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    btn.classList.add('active');
    document.getElementById(tab + '-content').classList.add('active');
  });
});

// Copy functionality
async function copyToClipboard(text, button) {
  try {
    await navigator.clipboard.writeText(text);
    const originalText = button.textContent;
    button.textContent = '✓ Copied!';
    button.classList.add('copied');
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('copied');
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
    button.textContent = '❌ Failed';
  }
}


function displayResponse(data) {
  const loadingState = document.getElementById('loadingState');
  const responseContent = document.getElementById('responseContent');
  const requestInfo = document.getElementById('requestInfo');
  const statusSection = document.getElementById('statusSection');
  const bodyContent = document.getElementById('bodyContent');
  const headersContent = document.getElementById('headersContent');
  const rawContent = document.getElementById('rawContent');

  // Hide loading
  loadingState.style.display = 'none';
  responseContent.style.display = 'block';

  // Display request info
  const methodClass = `method-${(data.method || 'get').toLowerCase()}`;
  requestInfo.innerHTML = `
    <span class="method-badge ${methodClass}">${data.method || 'GET'}</span>
    ${data.duration ? `
    <div class="info-item">
      <span class="info-label">Duration:</span>
      <span>${data.duration}ms</span>
    </div>
    ` : ''}
    <div class="info-item">
      <span class="info-label">URL:</span>
      <span class="url-text">${data.url || 'N/A'}</span>
    </div>
  `;

  // Display status
  if (data.status === 'success') {
    statusSection.innerHTML = `
      <div class="status-badge status-success">
        <span>✓ ${data.statusCode} ${data.statusText}</span>
      </div>
    `;
  } else if (data.status === 'error') {
    statusSection.innerHTML = `
      <div class="status-badge status-error">
        <span>❌ ${data.statusCode ? data.statusCode + ' ' : ''}Error</span>
      </div>
      <div class="error-message">
        ${data.message || 'Request failed'}
      </div>
    `;
  }

  // Display body
  const bodyText = typeof data.data === 'object' 
    ? JSON.stringify(data.data, null, 2)
    : data.data || '';
  
  bodyContent.textContent = bodyText || 'Empty response';

  // Display headers
  const headersText = JSON.stringify(data.headers || {}, null, 2);
  headersContent.textContent = headersText;

  // Display raw
  const rawText = JSON.stringify(data, null, 2);
  rawContent.textContent = rawText;

  // Setup copy buttons
  document.getElementById('copyBody').addEventListener('click', (e) => {
    copyToClipboard(bodyText, e.target);
  });

  document.getElementById('copyHeaders').addEventListener('click', (e) => {
    copyToClipboard(headersText, e.target);
  });

  document.getElementById('copyRaw').addEventListener('click', (e) => {
    copyToClipboard(rawText, e.target);
  });
}

