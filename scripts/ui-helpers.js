// UI Helper Functions

const TAB_USAGE_KEY = 'tabUsageStats';
const LAST_TAB_KEY = 'lastActiveTab';

// Setup tab navigation with dropdown
export async function setupTabs() {
  const tabSelector = document.getElementById('tabSelector');
  const tabContents = document.querySelectorAll('.tab-content');
  
  if (!tabSelector) return;

  // Load usage stats and last active tab
  const stats = await getTabUsageStats();
  const lastTab = await getLastActiveTab();
  
  // Sort tabs by usage
  sortTabsByUsage(tabSelector, stats);
  
  // Set initial tab
  if (lastTab) {
    tabSelector.value = lastTab;
    showTab(lastTab);
  } else {
    showTab(tabSelector.value);
  }

  // Handle tab changes
  tabSelector.addEventListener('change', async (e) => {
    const tabName = e.target.value;
    showTab(tabName);
    
    // Track usage
    await incrementTabUsage(tabName);
    await saveLastActiveTab(tabName);
    
    // Re-sort tabs after usage update
    const updatedStats = await getTabUsageStats();
    sortTabsByUsage(tabSelector, updatedStats);
  });
  
  function showTab(tabName) {
    // Hide all tabs
    tabContents.forEach(content => {
      content.classList.remove('active');
    });
    
    // Show selected tab
    const targetTab = document.getElementById(`${tabName}-tab`);
    if (targetTab) {
      targetTab.classList.add('active');
    }
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

// Sort tabs by usage frequency
function sortTabsByUsage(selector, stats) {
  const options = Array.from(selector.options);
  const currentValue = selector.value;
  
  // Sort options by usage count (descending)
  options.sort((a, b) => {
    const usageA = stats[a.value] || 0;
    const usageB = stats[b.value] || 0;
    return usageB - usageA;
  });
  
  // Clear and re-add options
  selector.innerHTML = '';
  options.forEach(option => {
    const count = stats[option.value] || 0;
    // Add usage count to label if > 0
    if (count > 0) {
      const originalText = option.textContent.split(' (')[0]; // Remove old count if any
      option.textContent = `${originalText} (${count})`;
    }
    selector.appendChild(option);
  });
  
  // Restore selected value
  selector.value = currentValue;
}

// Setup collapsible sections
export function setupCollapsibles() {
  const suggestionsHeaderPaths = document.getElementById('suggestionsHeaderPaths');
  const suggestionsContentPaths = document.getElementById('suggestionsContentPaths');
  const suggestionsHeaderParams = document.getElementById('suggestionsHeaderParams');
  const suggestionsContentParams = document.getElementById('suggestionsContentParams');
  
  if (suggestionsHeaderPaths && suggestionsContentPaths) {
    suggestionsHeaderPaths.addEventListener('click', () => {
      suggestionsContentPaths.classList.toggle('collapsed');
      suggestionsHeaderPaths.querySelector('.collapse-icon').classList.toggle('collapsed');
    });
  }
  
  if (suggestionsHeaderParams && suggestionsContentParams) {
    suggestionsHeaderParams.addEventListener('click', () => {
      suggestionsContentParams.classList.toggle('collapsed');
      suggestionsHeaderParams.querySelector('.collapse-icon').classList.toggle('collapsed');
    });
  }
  
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

