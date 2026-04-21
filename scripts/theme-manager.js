// Theme Manager - Handles theme switching and persistence

import { STORAGE_KEYS } from './constants.js';

// Available themes with their CSS variable values
export const THEMES = {
  light: {
    name: 'Light',
    primary: '#2563eb',
    primaryDark: '#1d4ed8',
    secondary: '#60a5fa',
    accent: '#93c5fd',
    gradientStart: '#2563eb',
    gradientEnd: '#06b6d4',
    success: '#16a34a',
    successDark: '#15803d',
    error: '#dc2626',
    errorDark: '#b91c1c',
    warning: '#d97706',
    warningDark: '#b45309',
    info: '#0284c7',
    infoDark: '#0369a1',
    bgGradientStart: '#f8fafc',
    bgGradientEnd: '#e2e8f0',

    // Base UI tokens (these drive "light vs dark" feel)
    surface: 'rgba(255, 255, 255, 0.96)',
    surface2: 'rgba(255, 255, 255, 0.75)',
    text: '#0f172a',
    textMuted: '#475569',
    border: 'rgba(15, 23, 42, 0.10)',
    inputBg: '#ffffff',
    inputText: '#0f172a',
    inputPlaceholder: '#94a3b8',
    codeBg: '#0f172a',
    codeText: '#e2e8f0'
  },
  dark: {
    name: 'Dark',
    primary: '#60a5fa',
    primaryDark: '#3b82f6',
    secondary: '#93c5fd',
    accent: '#bfdbfe',
    gradientStart: '#60a5fa',
    gradientEnd: '#a78bfa',
    success: '#4ade80',
    successDark: '#22c55e',
    error: '#f87171',
    errorDark: '#ef4444',
    warning: '#fbbf24',
    warningDark: '#f59e0b',
    info: '#7dd3fc',
    infoDark: '#38bdf8',
    bgGradientStart: '#070a12',
    bgGradientEnd: '#0b1220',

    // Base UI tokens
    surface: 'rgba(17, 24, 39, 0.86)',
    surface2: 'rgba(30, 41, 59, 0.66)',
    text: '#e5e7eb',
    textMuted: '#cbd5e1',
    border: 'rgba(148, 163, 184, 0.20)',
    inputBg: 'rgba(15, 23, 42, 0.80)',
    inputText: '#e5e7eb',
    inputPlaceholder: 'rgba(203, 213, 225, 0.70)',
    codeBg: '#0b1220',
    codeText: '#e5e7eb'
  }
};

// Default theme
const DEFAULT_THEME = 'light';

// Apply theme to document
export function applyTheme(themeName) {
  const resolvedThemeName = THEMES[themeName] ? themeName : DEFAULT_THEME;
  const theme = THEMES[resolvedThemeName];
  const root = document.documentElement;
  
  // Set CSS variables
  root.style.setProperty('--primary', theme.primary);
  root.style.setProperty('--primary-dark', theme.primaryDark);
  root.style.setProperty('--secondary', theme.secondary);
  root.style.setProperty('--accent', theme.accent);
  root.style.setProperty('--gradient-start', theme.gradientStart);
  root.style.setProperty('--gradient-end', theme.gradientEnd);
  root.style.setProperty('--success', theme.success);
  root.style.setProperty('--success-dark', theme.successDark);
  root.style.setProperty('--error', theme.error);
  root.style.setProperty('--error-dark', theme.errorDark);
  root.style.setProperty('--warning', theme.warning);
  root.style.setProperty('--warning-dark', theme.warningDark);
  root.style.setProperty('--info', theme.info);
  root.style.setProperty('--info-dark', theme.infoDark);
  root.style.setProperty('--bg-gradient-start', theme.bgGradientStart);
  root.style.setProperty('--bg-gradient-end', theme.bgGradientEnd);

  // Base UI tokens
  root.style.setProperty('--surface', theme.surface);
  root.style.setProperty('--surface-2', theme.surface2);
  root.style.setProperty('--text', theme.text);
  root.style.setProperty('--text-muted', theme.textMuted);
  root.style.setProperty('--border', theme.border);
  root.style.setProperty('--input-bg', theme.inputBg);
  root.style.setProperty('--input-text', theme.inputText);
  root.style.setProperty('--input-placeholder', theme.inputPlaceholder);
  root.style.setProperty('--code-bg', theme.codeBg);
  root.style.setProperty('--code-text', theme.codeText);
  
  // Store the selected theme (html + body) and hint native controls
  root.dataset.theme = resolvedThemeName;
  root.style.colorScheme = resolvedThemeName;
  document.body.dataset.theme = resolvedThemeName;

  // Force a style/layout flush to avoid "updates only on hover" repaint issues.
  void root.offsetHeight;
  return resolvedThemeName;
}

// Load saved theme from storage
export async function loadTheme() {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      const result = await chrome.storage.local.get(STORAGE_KEYS.THEME);
      const themeName = result[STORAGE_KEYS.THEME] || DEFAULT_THEME;
      const resolvedThemeName = applyTheme(themeName);
      return resolvedThemeName;
    }
  } catch (error) {
    console.error('Error loading theme:', error);
  }
  applyTheme(DEFAULT_THEME);
  return DEFAULT_THEME;
}

// Save theme to storage
export async function saveTheme(themeName) {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      await chrome.storage.local.set({ [STORAGE_KEYS.THEME]: themeName });
    }
  } catch (error) {
    console.error('Error saving theme:', error);
  }
}

// Setup theme selector
export function setupThemeSelector() {
  const selector = document.getElementById('themeSelector');
  if (!selector) return;
  
  // Populate options
  selector.innerHTML = '';
  Object.keys(THEMES).forEach(key => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = THEMES[key].name;
    selector.appendChild(option);
  });
  
  // Set current theme
  const currentTheme = document.body.dataset.theme || DEFAULT_THEME;
  selector.value = THEMES[currentTheme] ? currentTheme : DEFAULT_THEME;
  
  // Handle changes
  selector.addEventListener('change', async (e) => {
    const themeName = e.target.value;
    const resolvedThemeName = applyTheme(themeName);
    await saveTheme(resolvedThemeName);
  });
}

// Initialize theme system
export async function initTheme() {
  const themeName = await loadTheme();
  setupThemeSelector();
  return themeName;
}

