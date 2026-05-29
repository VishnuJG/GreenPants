// UI Helper Functions

const TAB_USAGE_KEY = 'tabUsageStats';
const LAST_TAB_KEY = 'lastActiveTab';

const TAB_ORDER = ['url-builder', 'request', 'timestamps', 'settings'];
const TAB_SHORTCUTS = {
  '1': 'url-builder',
  '2': 'request',
  '3': 'timestamps',
  '4': 'settings',
};

const isMac = /Mac|iPhone|iPod|iPad/i.test(navigator.userAgent);

function getShortcutLabel(index) {
  return isMac ? `^+${index} OR (CTRL+${index})` : `Alt+${index}`;
}

function matchesTabShortcut(event, index) {
  const digit = String(index);
  const isDigitKey = event.key === digit || event.code === `Digit${digit}`;
  if (!isDigitKey) {
    return false;
  }

  if (isMac) {
    return event.ctrlKey && !event.altKey && !event.metaKey && !event.shiftKey;
  }

  return event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey;
}

function applyShortcutLabels(tabButtons) {
  const tabTitles = {
    'url-builder': 'URL Builder',
    request: 'Headers & Body',
    timestamps: 'Timestamps',
    settings: 'Settings',
  };

  tabButtons.forEach(button => {
    const index = button.dataset.shortcut;
    if (!index) {
      return;
    }

    const label = getShortcutLabel(index);
    const shortcutEl = button.querySelector('.tab-shortcut');
    if (shortcutEl) {
      shortcutEl.textContent = label;
    }

    const tabLabel = tabTitles[button.dataset.tab] || button.dataset.tab;
    button.title = `${tabLabel} (${label})`;
  });
}

function normalizeTabName(tabName) {
  if (tabName === 'advanced' || tabName === 'history') {
    return 'settings';
  }
  return TAB_ORDER.includes(tabName) ? tabName : TAB_ORDER[0];
}

// Setup tab navigation with top-level buttons
export async function setupTabs() {
  const tabNav = document.getElementById('tabNav');
  const tabButtons = document.querySelectorAll('.tab-btn[data-tab]');
  const tabContents = document.querySelectorAll('.tab-content');

  if (!tabNav || tabButtons.length === 0) return;

  applyShortcutLabels(tabButtons);

  const lastTab = normalizeTabName(await getLastActiveTab());
  activateTab(lastTab, tabButtons, tabContents);

  tabButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const tabName = button.dataset.tab;
      await switchTab(tabName, tabButtons, tabContents);
    });
  });

  document.addEventListener('keydown', async (e) => {
    for (const [index, tabName] of Object.entries(TAB_SHORTCUTS)) {
      if (!matchesTabShortcut(e, index)) {
        continue;
      }

      e.preventDefault();
      await switchTab(tabName, tabButtons, tabContents);
      return;
    }
  });
}

async function switchTab(tabName, tabButtons, tabContents) {
  const normalizedTab = normalizeTabName(tabName);
  activateTab(normalizedTab, tabButtons, tabContents);
  await incrementTabUsage(normalizedTab);
  await saveLastActiveTab(normalizedTab);
}

function activateTab(tabName, tabButtons, tabContents) {
  tabButtons.forEach(button => {
    button.classList.toggle('active', button.dataset.tab === tabName);
  });

  tabContents.forEach(content => {
    content.classList.remove('active');
  });

  const targetTab = document.getElementById(`${tabName}-tab`);
  if (targetTab) {
    targetTab.classList.add('active');
  }
}

// Get tab usage statistics
async function getTabUsageStats() {
  try {
    const result = await chrome.storage.local.get(TAB_USAGE_KEY);
    return result[TAB_USAGE_KEY] || {};
  } catch (error) {
    console.error('Error loading tab stats:', error);
    return {};
  }
}

// Get last active tab
async function getLastActiveTab() {
  try {
    const result = await chrome.storage.local.get(LAST_TAB_KEY);
    return result[LAST_TAB_KEY] || null;
  } catch (error) {
    console.error('Error loading last tab:', error);
    return null;
  }
}

// Save last active tab
async function saveLastActiveTab(tabName) {
  try {
    await chrome.storage.local.set({ [LAST_TAB_KEY]: tabName });
  } catch (error) {
    console.error('Error saving last tab:', error);
  }
}

// Increment tab usage count
async function incrementTabUsage(tabName) {
  try {
    const stats = await getTabUsageStats();
    stats[tabName] = (stats[tabName] || 0) + 1;
    await chrome.storage.local.set({ [TAB_USAGE_KEY]: stats });
  } catch (error) {
    console.error('Error saving tab usage:', error);
  }
}

// Setup collapsible sections
export function setupCollapsibles() {
  // Setup URL section collapsibles
  const urlSectionHeaders = document.querySelectorAll('[data-url-section]');
  urlSectionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const section = header.closest('.url-section');
      const icon = header.querySelector('.collapse-icon');
      
      section.classList.toggle('collapsed');
      icon.classList.toggle('collapsed');
    });
  });
}
