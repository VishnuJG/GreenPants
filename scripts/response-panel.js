// Response Panel - Injected into webpage to display API responses

// Create and inject the response panel
function createResponsePanel() {
  // Remove existing panel if any
  const existing = document.getElementById('api-tester-response-panel');
  if (existing) {
    existing.remove();
  }

  const panel = document.createElement('div');
  panel.id = 'api-tester-response-panel';
  panel.innerHTML = `
    <div class="api-panel-header">
      <div class="api-panel-title">
        <span class="api-panel-icon">🚀</span>
        <span>API Response</span>
      </div>
      <div class="api-panel-actions">
        <button class="api-panel-btn minimize" title="Minimize">−</button>
        <button class="api-panel-btn close" title="Close">×</button>
      </div>
    </div>
    <div class="api-panel-content">
      <div class="api-response-status"></div>
      <div class="api-response-headers"></div>
      <div class="api-response-body"></div>
    </div>
    <div class="api-resize-handle" title="Drag to resize"></div>
  `;

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    #api-tester-response-panel {
      position: fixed;
      top: 20px;
      right: 20px;
      width: 600px;
      min-width: 300px;
      max-width: 90vw;
      height: 600px;
      min-height: 200px;
      max-height: 90vh;
      background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      animation: slideIn 0.3s ease-out;
      border: 2px solid #667eea;
      resize: both;
      overflow: hidden;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }

    #api-tester-response-panel.minimized .api-panel-content {
      display: none;
    }

    #api-tester-response-panel.minimized {
      width: 300px;
    }

    .api-panel-header {
      padding: 16px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 10px 10px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: move;
      user-select: none;
    }

    .api-panel-title {
      display: flex;
      align-items: center;
      gap: 10px;
      color: white;
      font-weight: 700;
      font-size: 16px;
    }

    .api-panel-icon {
      font-size: 20px;
    }

    .api-panel-actions {
      display: flex;
      gap: 8px;
    }

    .api-panel-btn {
      width: 28px;
      height: 28px;
      border: none;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border-radius: 6px;
      cursor: pointer;
      font-size: 20px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      line-height: 1;
    }

    .api-panel-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.1);
    }

    .api-panel-content {
      padding: 20px;
      overflow-y: auto;
      flex: 1;
      color: #e2e8f0;
    }
    
    .api-resize-handle {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 20px;
      height: 20px;
      cursor: nwse-resize;
      background: linear-gradient(135deg, transparent 0%, transparent 50%, #667eea 50%, #667eea 100%);
      border-bottom-right-radius: 10px;
    }

    .api-panel-content::-webkit-scrollbar {
      width: 8px;
    }

    .api-panel-content::-webkit-scrollbar-track {
      background: #2d3748;
      border-radius: 10px;
    }

    .api-panel-content::-webkit-scrollbar-thumb {
      background: #4a5568;
      border-radius: 10px;
    }

    .api-panel-content::-webkit-scrollbar-thumb:hover {
      background: #667eea;
    }

    .api-response-status {
      margin-bottom: 16px;
      padding: 12px 16px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .api-response-status.success {
      background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
      color: white;
    }

    .api-response-status.error {
      background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
      color: white;
    }

    .api-response-status.pending {
      background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
      color: white;
    }

    .api-section-title {
      color: #fbbf24;
      font-weight: 700;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 16px 0 12px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .api-section-title::before {
      content: '';
      width: 4px;
      height: 16px;
      background: #fbbf24;
      border-radius: 2px;
    }

    .api-response-headers,
    .api-response-body {
      background: #0d1117;
      padding: 16px;
      border-radius: 8px;
      font-family: 'SF Mono', 'Monaco', 'Menlo', 'Courier New', monospace;
      font-size: 12px;
      line-height: 1.6;
      white-space: pre-wrap;
      word-break: break-all;
      color: #68d391;
      border: 1px solid #30363d;
      margin-bottom: 12px;
    }

    .api-copy-btn {
      background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      margin-top: 8px;
      transition: all 0.2s;
    }

    .api-copy-btn:hover {
      background: linear-gradient(135deg, #3182ce 0%, #2c5282 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(66, 153, 225, 0.4);
    }

    .api-duration {
      color: #a0aec0;
      font-size: 12px;
      margin-left: auto;
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(panel);

  // Make panel draggable and resizable
  makeDraggable(panel);
  makeResizable(panel);

  // Add button handlers
  panel.querySelector('.close').addEventListener('click', () => {
    panel.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => panel.remove(), 300);
  });

  panel.querySelector('.minimize').addEventListener('click', () => {
    panel.classList.toggle('minimized');
    const btn = panel.querySelector('.minimize');
    btn.textContent = panel.classList.contains('minimized') ? '+' : '−';
  });

  return panel;
}

// Make panel draggable
function makeDraggable(element) {
  const header = element.querySelector('.api-panel-header');
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  header.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    // Don't drag if clicking on buttons
    if (e.target.classList.contains('api-panel-btn')) {
      return;
    }
    
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    element.style.top = (element.offsetTop - pos2) + "px";
    element.style.left = (element.offsetLeft - pos1) + "px";
    element.style.right = 'auto';
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// Make panel resizable
function makeResizable(element) {
  const resizeHandle = element.querySelector('.api-resize-handle');
  let startX, startY, startWidth, startHeight;

  resizeHandle.onmousedown = initResize;

  function initResize(e) {
    e.preventDefault();
    e.stopPropagation();
    
    startX = e.clientX;
    startY = e.clientY;
    startWidth = parseInt(document.defaultView.getComputedStyle(element).width, 10);
    startHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10);
    
    document.onmousemove = doResize;
    document.onmouseup = stopResize;
  }

  function doResize(e) {
    e.preventDefault();
    
    const newWidth = startWidth + (e.clientX - startX);
    const newHeight = startHeight + (e.clientY - startY);
    
    // Apply min/max constraints
    if (newWidth >= 300 && newWidth <= window.innerWidth * 0.9) {
      element.style.width = newWidth + 'px';
    }
    
    if (newHeight >= 200 && newHeight <= window.innerHeight * 0.9) {
      element.style.height = newHeight + 'px';
    }
  }

  function stopResize() {
    document.onmousemove = null;
    document.onmouseup = null;
  }
}

// Display response in the panel
function displayResponse(responseData) {
  const panel = createResponsePanel();
  
  const statusDiv = panel.querySelector('.api-response-status');
  const headersDiv = panel.querySelector('.api-response-headers');
  const bodyDiv = panel.querySelector('.api-response-body');

  if (responseData.status === 'pending') {
    statusDiv.className = 'api-response-status pending';
    statusDiv.innerHTML = `
      <span>⏳ SENDING REQUEST...</span>
    `;
    headersDiv.innerHTML = '';
    bodyDiv.innerHTML = '';
  } else if (responseData.status === 'error') {
    statusDiv.className = 'api-response-status error';
    statusDiv.innerHTML = `
      <span>❌ ERROR ${responseData.statusCode || ''}</span>
      ${responseData.duration ? `<span class="api-duration">${responseData.duration}ms</span>` : ''}
    `;
    
    headersDiv.innerHTML = `
      <div class="api-section-title">📋 Error Details</div>
      <div style="color: #fc8181;">${responseData.message || 'Request failed'}</div>
    `;
    bodyDiv.innerHTML = '';
  } else if (responseData.status === 'success') {
    statusDiv.className = 'api-response-status success';
    statusDiv.innerHTML = `
      <span>✓ ${responseData.statusCode} ${responseData.statusText}</span>
      <span class="api-duration">${responseData.duration}ms</span>
    `;

    // Headers
    const headersContent = JSON.stringify(responseData.headers, null, 2);
    headersDiv.innerHTML = '';
    headersDiv.appendChild(createSection('📋 Response Headers', headersContent));

    // Body
    const bodyContent = typeof responseData.data === 'object' 
      ? JSON.stringify(responseData.data, null, 2)
      : responseData.data;
    
    bodyDiv.innerHTML = '';
    bodyDiv.appendChild(createSection('📦 Response Body', bodyContent || '<em style="color: #a0aec0;">Empty response</em>'));
  }
}

// Helper to create a section with title, content, and copy button
function createSection(title, content) {
  const container = document.createElement('div');
  
  const titleDiv = document.createElement('div');
  titleDiv.className = 'api-section-title';
  titleDiv.textContent = title;
  
  const contentDiv = document.createElement('div');
  contentDiv.style.whiteSpace = 'pre-wrap';
  contentDiv.style.wordBreak = 'break-all';
  
  if (content.startsWith('<em')) {
    contentDiv.innerHTML = content;
  } else {
    contentDiv.textContent = content;
  }
  
  const copyBtn = document.createElement('button');
  copyBtn.className = 'api-copy-btn';
  copyBtn.textContent = title.includes('Headers') ? '📋 Copy Headers' : '📋 Copy Body';
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(content);
      copyBtn.textContent = '✓ Copied!';
      setTimeout(() => {
        copyBtn.textContent = title.includes('Headers') ? '📋 Copy Headers' : '📋 Copy Body';
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      copyBtn.textContent = '❌ Failed';
    }
  });
  
  container.appendChild(titleDiv);
  container.appendChild(contentDiv);
  container.appendChild(copyBtn);
  
  return container;
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'API_RESPONSE') {
    displayResponse(message.data);
    sendResponse({ success: true });
    return true;
  }
  
  if (message.type === 'PING') {
    sendResponse({ success: true });
    return true;
  }
});

// Log that content script is loaded
console.log('API Tester response panel ready');

