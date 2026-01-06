// User Actions - Apply and Copy

import { buildUrl } from './url-manager.js';
import { saveUrlToHistory, savePathsAndParams, loadHistory } from './storage.js';

// Apply the new URL and navigate
export async function applyUrl() {
  try {
    const newUrl = buildUrl();
    
    // Validate URL
    new URL(newUrl);
    
    // Save to history
    await saveUrlToHistory(newUrl, 'navigated');
    
    // Save path segments and params
    await savePathsAndParams();
    
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    await chrome.tabs.update(tab.id, { url: newUrl });
    
    // Close popup after successful navigation
    window.close();
  } catch (error) {
    console.error('Error applying URL:', error);
    alert('Error: Invalid URL format. Please check your inputs.');
  }
}

// Copy URL to clipboard
export async function copyUrl() {
  try {
    const newUrl = buildUrl();
    
    // Use the Clipboard API
    await navigator.clipboard.writeText(newUrl);
    
    // Save to history as copied
    await saveUrlToHistory(newUrl, 'copied');
    
    // Save path segments and params
    await savePathsAndParams();
    
    // Visual feedback
    const btn = document.getElementById('copyUrl');
    const originalText = btn.textContent;
    btn.textContent = '✓ Copied!';
    btn.style.background = '#28a745';
    
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
    }, 2000);
    
    // Refresh history display
    await loadHistory();
  } catch (error) {
    console.error('Error copying URL:', error);
    alert('Error copying to clipboard');
  }
}

