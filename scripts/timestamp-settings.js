// Timestamp Settings Module - Manages timestamp viewer settings

// Load timestamp settings from storage
export async function loadTimestampSettings() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['timestampEnabled', 'timestampFormat'], (result) => {
      const settings = {
        // Enable by default if not explicitly set
        enabled: result.timestampEnabled !== undefined ? result.timestampEnabled : true,
        format: result.timestampFormat || 'iso8601'
      };
      
      // Update UI
      const enabledCheckbox = document.getElementById('timestampEnabled');
      const formatSelect = document.getElementById('timestampFormat');
      
      if (enabledCheckbox) {
        enabledCheckbox.checked = settings.enabled;
      }
      
      if (formatSelect) {
        formatSelect.value = settings.format;
      }
      
      resolve(settings);
    });
  });
}

// Save timestamp settings to storage and notify content script
export async function saveTimestampSettings(enabled, format) {
  // Save to storage
  await chrome.storage.local.set({
    timestampEnabled: enabled,
    timestampFormat: format
  });
  
  // Notify all tabs with content script
  const tabs = await chrome.tabs.query({});
  
  for (const tab of tabs) {
    try {
      await chrome.tabs.sendMessage(tab.id, {
        type: 'UPDATE_TIMESTAMP_SETTINGS',
        enabled: enabled,
        format: format
      });
    } catch (error) {
      // Tab might not have content script, ignore error
      console.log(`Could not update tab ${tab.id}:`, error);
    }
  }
}

// Apply settings to current tab only
export async function applyToCurrentTab(enabled, format) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab || !tab.id) {
    return;
  }
  
  try {
    // Send settings to content script (it's auto-injected via manifest)
    await chrome.tabs.sendMessage(tab.id, {
      type: 'UPDATE_TIMESTAMP_SETTINGS',
      enabled: enabled,
      format: format
    });
  } catch (error) {
    // Content script might not be loaded yet on restricted pages (chrome://, etc.)
    console.log('Could not apply to current tab:', error.message);
  }
}

// Setup event listeners for timestamp settings
export function setupTimestampListeners() {
  const enabledCheckbox = document.getElementById('timestampEnabled');
  const formatSelect = document.getElementById('timestampFormat');
  const applyButton = document.getElementById('applyTimestampSettings');
  
  if (!enabledCheckbox || !formatSelect || !applyButton) {
    return;
  }
  
  // Apply settings when button is clicked
  applyButton.addEventListener('click', async () => {
    const enabled = enabledCheckbox.checked;
    const format = formatSelect.value;
    
    // Save and apply to all tabs
    await saveTimestampSettings(enabled, format);
    await applyToCurrentTab(enabled, format);
    
    // Show feedback
    const originalText = applyButton.textContent;
    applyButton.textContent = '✓ Applied!';
    applyButton.style.background = 'linear-gradient(135deg, #68d391 0%, #48bb78 100%)';
    
    setTimeout(() => {
      applyButton.textContent = originalText;
      applyButton.style.background = '';
    }, 1500);
  });
  
  // Also apply on checkbox change
  enabledCheckbox.addEventListener('change', async () => {
    const enabled = enabledCheckbox.checked;
    const format = formatSelect.value;
    await saveTimestampSettings(enabled, format);
    await applyToCurrentTab(enabled, format);
  });
  
  // Apply on format change
  formatSelect.addEventListener('change', async () => {
    if (enabledCheckbox.checked) {
      const enabled = enabledCheckbox.checked;
      const format = formatSelect.value;
      await saveTimestampSettings(enabled, format);
      await applyToCurrentTab(enabled, format);
    } else {
      // Just save, don't apply
      const format = formatSelect.value;
      await chrome.storage.local.set({ timestampFormat: format });
    }
  });
}

