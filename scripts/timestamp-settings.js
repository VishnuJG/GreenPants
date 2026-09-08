// Timestamp Settings Module - Manages timestamp viewer settings

function getTimestampControls() {
  return {
    enabledCheckbox: document.getElementById('timestampEnabled'),
    navSwitch: document.getElementById('timestampEnabledNav'),
    formatSelect: document.getElementById('timestampFormat'),
    applyButton: document.getElementById('applyTimestampSettings'),
  };
}

function syncTimestampControls(enabled) {
  const { enabledCheckbox, navSwitch } = getTimestampControls();
  if (enabledCheckbox) {
    enabledCheckbox.checked = enabled;
  }
  if (navSwitch) {
    navSwitch.checked = enabled;
  }
}

export async function loadTimestampSettings() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['timestampEnabled', 'timestampFormat'], (result) => {
      const settings = {
        enabled: result.timestampEnabled === true,
        format: result.timestampFormat || 'iso8601',
      };

      syncTimestampControls(settings.enabled);

      const { formatSelect } = getTimestampControls();
      if (formatSelect) {
        formatSelect.value = settings.format;
      }

      resolve(settings);
    });
  });
}

export async function saveTimestampSettings(enabled, format) {
  await chrome.storage.local.set({
    timestampEnabled: enabled,
    timestampFormat: format,
  });

  const tabs = await chrome.tabs.query({});

  for (const tab of tabs) {
    try {
      await chrome.tabs.sendMessage(tab.id, {
        type: 'UPDATE_TIMESTAMP_SETTINGS',
        enabled,
        format,
      });
    } catch {
      // Tab might not have content script loaded.
    }
  }
}

export async function applyToCurrentTab(enabled, format) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab?.id) {
    return;
  }

  try {
    await chrome.tabs.sendMessage(tab.id, {
      type: 'UPDATE_TIMESTAMP_SETTINGS',
      enabled,
      format,
    });
  } catch {
    // Content script may be unavailable on restricted pages.
  }
}

async function applyTimestampState(enabled, format) {
  syncTimestampControls(enabled);
  await saveTimestampSettings(enabled, format);
  await applyToCurrentTab(enabled, format);
}

export function setupTimestampListeners() {
  const { enabledCheckbox, navSwitch, formatSelect, applyButton } = getTimestampControls();

  if (!enabledCheckbox || !formatSelect) {
    return;
  }

  const handleEnabledChange = async (enabled) => {
    await applyTimestampState(enabled, formatSelect.value);
  };

  enabledCheckbox.addEventListener('change', async () => {
    await handleEnabledChange(enabledCheckbox.checked);
  });

  if (navSwitch) {
    navSwitch.addEventListener('change', async (event) => {
      event.stopPropagation();
      await handleEnabledChange(navSwitch.checked);
    });

    navSwitch.addEventListener('click', (event) => {
      event.stopPropagation();
    });
  }

  formatSelect.addEventListener('change', async () => {
    const enabled = enabledCheckbox.checked || navSwitch?.checked || false;
    if (enabled) {
      await applyTimestampState(enabled, formatSelect.value);
      return;
    }

    await chrome.storage.local.set({ timestampFormat: formatSelect.value });
  });

  if (applyButton) {
    applyButton.addEventListener('click', async () => {
      const enabled = enabledCheckbox.checked || navSwitch?.checked || false;
      await applyTimestampState(enabled, formatSelect.value);

      const originalText = applyButton.textContent;
      applyButton.textContent = '✓ Applied!';
      applyButton.style.background = 'linear-gradient(135deg, #68d391 0%, #48bb78 100%)';

      setTimeout(() => {
        applyButton.textContent = originalText;
        applyButton.style.background = '';
      }, 1500);
    });
  }
}
