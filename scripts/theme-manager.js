// Theme Manager - Handles theme switching and persistence

import { STORAGE_KEYS } from './constants.js';

// Available themes with their CSS variable values
export const THEMES = {
  lavender: {
    name: '💜 Lavender Dream',
    primary: '#9f7aea',
    primaryDark: '#805ad5',
    secondary: '#b794f4',
    accent: '#d6bcfa',
    gradientStart: '#9f7aea',
    gradientEnd: '#805ad5',
    success: '#68d391',
    successDark: '#48bb78',
    error: '#fc8181',
    errorDark: '#f56565',
    warning: '#fbd38d',
    warningDark: '#ed8936',
    info: '#63b3ed',
    infoDark: '#4299e1',
    bgGradientStart: '#a78bfa',
    bgGradientEnd: '#c084fc'
  },
  ocean: {
    name: '🌊 Ocean Breeze',
    primary: '#0ea5e9',
    primaryDark: '#0284c7',
    secondary: '#38bdf8',
    accent: '#7dd3fc',
    gradientStart: '#0ea5e9',
    gradientEnd: '#06b6d4',
    success: '#34d399',
    successDark: '#10b981',
    error: '#f87171',
    errorDark: '#ef4444',
    warning: '#fbbf24',
    warningDark: '#f59e0b',
    info: '#60a5fa',
    infoDark: '#3b82f6',
    bgGradientStart: '#22d3ee',
    bgGradientEnd: '#0ea5e9'
  },
  sunset: {
    name: '🌅 Sunset Glow',
    primary: '#f97316',
    primaryDark: '#ea580c',
    secondary: '#fb923c',
    accent: '#fdba74',
    gradientStart: '#f97316',
    gradientEnd: '#ef4444',
    success: '#4ade80',
    successDark: '#22c55e',
    error: '#f87171',
    errorDark: '#ef4444',
    warning: '#fcd34d',
    warningDark: '#fbbf24',
    info: '#60a5fa',
    infoDark: '#3b82f6',
    bgGradientStart: '#fb923c',
    bgGradientEnd: '#f43f5e'
  },
  forest: {
    name: '🌿 Forest Fresh',
    primary: '#22c55e',
    primaryDark: '#16a34a',
    secondary: '#4ade80',
    accent: '#86efac',
    gradientStart: '#22c55e',
    gradientEnd: '#14b8a6',
    success: '#34d399',
    successDark: '#10b981',
    error: '#fb7185',
    errorDark: '#f43f5e',
    warning: '#fcd34d',
    warningDark: '#fbbf24',
    info: '#38bdf8',
    infoDark: '#0ea5e9',
    bgGradientStart: '#4ade80',
    bgGradientEnd: '#2dd4bf'
  },
  neon: {
    name: '⚡ Neon Nights',
    primary: '#ec4899',
    primaryDark: '#db2777',
    secondary: '#f472b6',
    accent: '#f9a8d4',
    gradientStart: '#ec4899',
    gradientEnd: '#8b5cf6',
    success: '#4ade80',
    successDark: '#22c55e',
    error: '#f87171',
    errorDark: '#ef4444',
    warning: '#facc15',
    warningDark: '#eab308',
    info: '#22d3ee',
    infoDark: '#06b6d4',
    bgGradientStart: '#f472b6',
    bgGradientEnd: '#a78bfa'
  },
  daylight: {
    name: '☀️ Bright Day',
    primary: '#3b82f6',
    primaryDark: '#2563eb',
    secondary: '#60a5fa',
    accent: '#93c5fd',
    gradientStart: '#3b82f6',
    gradientEnd: '#6366f1',
    success: '#34d399',
    successDark: '#10b981',
    error: '#f87171',
    errorDark: '#ef4444',
    warning: '#fbbf24',
    warningDark: '#f59e0b',
    info: '#38bdf8',
    infoDark: '#0ea5e9',
    bgGradientStart: '#60a5fa',
    bgGradientEnd: '#818cf8'
  },
  cherry: {
    name: '🍒 Cherry Pop',
    primary: '#e11d48',
    primaryDark: '#be123c',
    secondary: '#fb7185',
    accent: '#fda4af',
    gradientStart: '#e11d48',
    gradientEnd: '#db2777',
    success: '#4ade80',
    successDark: '#22c55e',
    error: '#fca5a5',
    errorDark: '#f87171',
    warning: '#fde047',
    warningDark: '#facc15',
    info: '#67e8f9',
    infoDark: '#22d3ee',
    bgGradientStart: '#fb7185',
    bgGradientEnd: '#f472b6'
  },
  midnight: {
    name: '🌙 Midnight Blue',
    primary: '#6366f1',
    primaryDark: '#4f46e5',
    secondary: '#818cf8',
    accent: '#a5b4fc',
    gradientStart: '#6366f1',
    gradientEnd: '#8b5cf6',
    success: '#4ade80',
    successDark: '#22c55e',
    error: '#f87171',
    errorDark: '#ef4444',
    warning: '#fbbf24',
    warningDark: '#f59e0b',
    info: '#38bdf8',
    infoDark: '#0ea5e9',
    bgGradientStart: '#818cf8',
    bgGradientEnd: '#a78bfa'
  }
};

// Default theme
const DEFAULT_THEME = 'ocean';

// Apply theme to document
export function applyTheme(themeName) {
  const theme = THEMES[themeName] || THEMES[DEFAULT_THEME];
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
  
  // Store the selected theme
  document.body.dataset.theme = themeName;
}

// Load saved theme from storage
export async function loadTheme() {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      const result = await chrome.storage.local.get(STORAGE_KEYS.THEME);
      const themeName = result[STORAGE_KEYS.THEME] || DEFAULT_THEME;
      applyTheme(themeName);
      return themeName;
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
  Object.keys(THEMES).forEach(key => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = THEMES[key].name;
    selector.appendChild(option);
  });
  
  // Set current theme
  const currentTheme = document.body.dataset.theme || DEFAULT_THEME;
  selector.value = currentTheme;
  
  // Handle changes
  selector.addEventListener('change', async (e) => {
    const themeName = e.target.value;
    applyTheme(themeName);
    await saveTheme(themeName);
  });
}

// Initialize theme system
export async function initTheme() {
  const themeName = await loadTheme();
  setupThemeSelector();
  return themeName;
}

