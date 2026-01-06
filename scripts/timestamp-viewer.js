// Content Script - Timestamp Viewer
// Runs on web pages to detect and convert timestamps

let isEnabled = false;
let displayFormat = 'iso8601'; // 'iso8601', 'rfc2822', 'custom'
let processedElements = new WeakSet();

// Timestamp detection patterns
const PATTERNS = {
  // Unix timestamp (seconds) - 10 digits, must be realistic (after year 2000, before year 2100)
  unixSeconds: /\b(1[0-9]{9}|2[0-1][0-9]{8})\b/g,
  // Unix timestamp (milliseconds) - 13 digits
  unixMillis: /\b(1[0-9]{12}|2[0-1][0-9]{11})\b/g,
  // ISO 8601 format
  iso8601: /\b\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?\b/g,
  // Common context patterns for timestamps
  contextWords: /\b(created|updated|modified|timestamp|time|date|posted|published|expires|expired|at)\s*:?\s*/gi
};

// Format timestamp based on user preference
function formatTimestamp(timestamp, isMillis = false) {
  const date = new Date(isMillis ? timestamp : timestamp * 1000);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return null;
  }
  
  switch (displayFormat) {
    case 'iso8601':
      return date.toISOString();
    
    case 'rfc2822':
      return date.toUTCString();
    
    case 'custom':
      // Custom format: "Nov 27, 2025, 10:30:00 AM"
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    
    default:
      return date.toISOString();
  }
}

// Create timestamp badge element
function createTimestampBadge(originalText, formattedDate) {
  const badge = document.createElement('span');
  badge.className = 'timestamp-converter-badge';
  badge.textContent = ` [📅 ${formattedDate}]`;
  badge.style.cssText = `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    margin-left: 6px;
    cursor: help;
    display: inline-block;
    vertical-align: middle;
    box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    white-space: nowrap;
  `;
  badge.title = `Original: ${originalText}\nFormatted: ${formattedDate}`;
  badge.setAttribute('data-timestamp-original', originalText);
  return badge;
}

// Check if element should be processed
function shouldProcessElement(element) {
  // Skip if already processed
  if (processedElements.has(element)) {
    return false;
  }
  
  // Skip script, style, input, textarea, and our own badges
  const tagName = element.tagName.toLowerCase();
  if (['script', 'style', 'input', 'textarea', 'select', 'button', 'noscript'].includes(tagName)) {
    return false;
  }
  
  // Skip code blocks and pre tags (common in documentation)
  if (element.closest('code, pre, kbd, samp')) {
    return false;
  }
  
  // Skip if inside a contenteditable element
  if (element.isContentEditable || element.closest('[contenteditable="true"]')) {
    return false;
  }
  
  return true;
}

// Process text node to find and augment timestamps
function processTextNode(textNode) {
  if (!textNode.parentElement || !shouldProcessElement(textNode.parentElement)) {
    return;
  }
  
  const text = textNode.textContent;
  const parent = textNode.parentElement;
  
  // Check for Unix timestamps (seconds)
  const secondsMatches = [...text.matchAll(PATTERNS.unixSeconds)];
  
  // Check for Unix timestamps (milliseconds)
  const millisMatches = [...text.matchAll(PATTERNS.unixMillis)];
  
  const allMatches = [
    ...secondsMatches.map(m => ({ value: m[0], isMillis: false, index: m.index })),
    ...millisMatches.map(m => ({ value: m[0], isMillis: true, index: m.index }))
  ].sort((a, b) => a.index - b.index);
  
  if (allMatches.length === 0) {
    return;
  }
  
  // Create document fragment to replace text node
  const fragment = document.createDocumentFragment();
  let lastIndex = 0;
  
  for (const match of allMatches) {
    const timestamp = parseInt(match.value);
    const formatted = formatTimestamp(timestamp, match.isMillis);
    
    if (!formatted) {
      continue;
    }
    
    // Add text before match
    if (match.index > lastIndex) {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
    }
    
    // Add original timestamp
    fragment.appendChild(document.createTextNode(match.value));
    
    // Add formatted badge
    fragment.appendChild(createTimestampBadge(match.value, formatted));
    
    lastIndex = match.index + match.value.length;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
  }
  
  // Replace text node with fragment
  parent.replaceChild(fragment, textNode);
  processedElements.add(parent);
}

// Walk through DOM and process text nodes
function scanAndAugmentPage() {
  if (!isEnabled) {
    return;
  }
  
  // Clear processed elements to allow re-processing
  processedElements = new WeakSet();
  
  // Create a TreeWalker to efficiently traverse text nodes
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        // Skip empty or whitespace-only nodes
        if (!node.textContent.trim()) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );
  
  const textNodes = [];
  let node;
  while (node = walker.nextNode()) {
    textNodes.push(node);
  }
  
  // Process all text nodes
  textNodes.forEach(processTextNode);
}

// Remove all timestamp badges
function removeAllBadges() {
  const badges = document.querySelectorAll('.timestamp-converter-badge');
  badges.forEach(badge => badge.remove());
  processedElements = new WeakSet();
}

// Observe DOM changes and process new content
let observer = null;

function startObserving() {
  if (observer || !isEnabled) {
    return;
  }
  
  observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) {
            processTextNode(node);
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Process text nodes in added element
            const walker = document.createTreeWalker(
              node,
              NodeFilter.SHOW_TEXT,
              null
            );
            let textNode;
            while (textNode = walker.nextNode()) {
              processTextNode(textNode);
            }
          }
        });
      }
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

function stopObserving() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}

// Handle messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'UPDATE_TIMESTAMP_SETTINGS') {
    const wasEnabled = isEnabled;
    const formatChanged = displayFormat !== message.format;
    
    isEnabled = message.enabled;
    displayFormat = message.format;
    
    if (isEnabled) {
      if (!wasEnabled) {
        // Enable: scan page and start observing
        scanAndAugmentPage();
        startObserving();
      } else if (formatChanged) {
        // Format changed: remove old badges and re-scan
        removeAllBadges();
        scanAndAugmentPage();
      }
    } else if (wasEnabled) {
      // Disable: remove badges and stop observing
      removeAllBadges();
      stopObserving();
    }
    
    sendResponse({ success: true });
  } else if (message.type === 'GET_TIMESTAMP_STATUS') {
    sendResponse({ enabled: isEnabled, format: displayFormat });
  }
  
  return true; // Keep channel open for async response
});

// Initialize: load settings from storage
chrome.storage.local.get(['timestampEnabled', 'timestampFormat'], (result) => {
  // Enable by default if not explicitly set
  isEnabled = result.timestampEnabled !== undefined ? result.timestampEnabled : true;
  displayFormat = result.timestampFormat || 'iso8601';
  
  if (isEnabled) {
    scanAndAugmentPage();
    startObserving();
  }
});

