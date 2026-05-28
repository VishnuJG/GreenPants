// Theme Manager - Handles theme switching and persistence

import { STORAGE_KEYS } from './constants.js';

/** @typedef {'light' | 'dark'} ThemeMode */

/**
 * @param {ThemeMode} mode
 * @param {object} colors
 */
function createTheme(name, mode, colors) {
  return { name, mode, ...colors };
}

// Refined palettes with semantic surface / text tokens
export const THEMES = {
  light: createTheme('Light', 'light', {
    primary: '#2563eb',
    primaryDark: '#1d4ed8',
    secondary: '#3b82f6',
    accent: '#93c5fd',
    gradientStart: '#2563eb',
    gradientEnd: '#1e40af',
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
    textPrimary: '#0f172a',
    textSecondary: '#334155',
    textMuted: '#64748b',
    surface: '#ffffff',
    surfaceElevated: '#ffffff',
    surfaceMuted: '#f1f5f9',
    border: '#e2e8f0',
    borderStrong: '#cbd5e1',
    inputBg: '#ffffff',
    chromeBg: 'rgba(255, 255, 255, 0.65)',
    chromeBorder: 'rgba(255, 255, 255, 0.85)',
    chromeText: '#0f172a',
    chromeControlBg: 'rgba(255, 255, 255, 0.95)',
    shadow: 'rgba(15, 23, 42, 0.08)',
  }),

  dark: createTheme('Dark', 'dark', {
    primary: '#60a5fa',
    primaryDark: '#3b82f6',
    secondary: '#93c5fd',
    accent: '#bfdbfe',
    gradientStart: '#60a5fa',
    gradientEnd: '#818cf8',
    success: '#4ade80',
    successDark: '#22c55e',
    error: '#f87171',
    errorDark: '#ef4444',
    warning: '#fbbf24',
    warningDark: '#f59e0b',
    info: '#38bdf8',
    infoDark: '#0ea5e9',
    bgGradientStart: '#0f172a',
    bgGradientEnd: '#1e293b',
    textPrimary: '#f8fafc',
    textSecondary: '#e2e8f0',
    textMuted: '#94a3b8',
    surface: '#1e293b',
    surfaceElevated: '#334155',
    surfaceMuted: '#0f172a',
    border: '#334155',
    borderStrong: '#475569',
    inputBg: '#0f172a',
    chromeBg: 'rgba(15, 23, 42, 0.75)',
    chromeBorder: 'rgba(51, 65, 85, 0.9)',
    chromeText: '#f1f5f9',
    chromeControlBg: '#1e293b',
    shadow: 'rgba(0, 0, 0, 0.35)',
  }),

  golden: createTheme('Golden', 'dark', {
    primary: '#d4af37',
    primaryDark: '#b8860b',
    secondary: '#e8c547',
    accent: '#f5e6b8',
    gradientStart: '#d4af37',
    gradientEnd: '#a67c00',
    success: '#6ee7b7',
    successDark: '#34d399',
    error: '#fca5a5',
    errorDark: '#f87171',
    warning: '#fcd34d',
    warningDark: '#fbbf24',
    info: '#7dd3fc',
    infoDark: '#38bdf8',
    bgGradientStart: '#14110a',
    bgGradientEnd: '#2a2218',
    textPrimary: '#faf6eb',
    textSecondary: '#e8dcc4',
    textMuted: '#a89878',
    surface: '#221c14',
    surfaceElevated: '#2f271c',
    surfaceMuted: '#18140e',
    border: '#3d3428',
    borderStrong: '#524636',
    inputBg: '#18140e',
    chromeBg: 'rgba(20, 17, 10, 0.82)',
    chromeBorder: 'rgba(212, 175, 55, 0.35)',
    chromeText: '#f5e6b8',
    chromeControlBg: '#2a2218',
    shadow: 'rgba(0, 0, 0, 0.45)',
  }),

  silver: createTheme('Silver', 'light', {
    primary: '#52525b',
    primaryDark: '#3f3f46',
    secondary: '#71717a',
    accent: '#d4d4d8',
    gradientStart: '#71717a',
    gradientEnd: '#52525b',
    success: '#059669',
    successDark: '#047857',
    error: '#e11d48',
    errorDark: '#be123c',
    warning: '#ca8a04',
    warningDark: '#a16207',
    info: '#0891b2',
    infoDark: '#0e7490',
    bgGradientStart: '#f4f4f5',
    bgGradientEnd: '#d4d4d8',
    textPrimary: '#18181b',
    textSecondary: '#3f3f46',
    textMuted: '#71717a',
    surface: '#fafafa',
    surfaceElevated: '#ffffff',
    surfaceMuted: '#f4f4f5',
    border: '#d4d4d8',
    borderStrong: '#a1a1aa',
    inputBg: '#ffffff',
    chromeBg: 'rgba(255, 255, 255, 0.7)',
    chromeBorder: 'rgba(161, 161, 170, 0.5)',
    chromeText: '#27272a',
    chromeControlBg: 'rgba(255, 255, 255, 0.96)',
    shadow: 'rgba(24, 24, 27, 0.1)',
  }),

  crystal: createTheme('Crystal', 'light', {
    primary: '#5e5ce6',
    primaryDark: '#4845c4',
    secondary: '#64d2ff',
    accent: '#bf5af2',
    gradientStart: '#5e5ce6',
    gradientEnd: '#64d2ff',
    success: '#30d158',
    successDark: '#28a745',
    error: '#ff453a',
    errorDark: '#ff3b30',
    warning: '#ffd60a',
    warningDark: '#ff9f0a',
    info: '#64d2ff',
    infoDark: '#0a84ff',
    bgGradientStart: '#e8f4fc',
    bgGradientEnd: '#ede9fe',
    textPrimary: '#1c1c1e',
    textSecondary: '#3a3a3c',
    textMuted: '#636366',
    surface: 'rgba(255, 255, 255, 0.82)',
    surfaceElevated: 'rgba(255, 255, 255, 0.94)',
    surfaceMuted: 'rgba(255, 255, 255, 0.55)',
    border: 'rgba(255, 255, 255, 0.9)',
    borderStrong: 'rgba(94, 92, 230, 0.25)',
    inputBg: 'rgba(255, 255, 255, 0.88)',
    chromeBg: 'rgba(255, 255, 255, 0.45)',
    chromeBorder: 'rgba(255, 255, 255, 0.75)',
    chromeText: '#1c1c1e',
    chromeControlBg: 'rgba(255, 255, 255, 0.9)',
    shadow: 'rgba(94, 92, 230, 0.12)',
  }),
};

const LEGACY_THEME_ALIASES = {
  ocean: 'light',
  daylight: 'light',
  forest: 'light',
  cherry: 'light',
  midnight: 'dark',
  neon: 'dark',
  lavender: 'crystal',
  sunset: 'golden',
};

const DEFAULT_THEME = 'light';

const SEMANTIC_KEYS = [
  'textPrimary',
  'textSecondary',
  'textMuted',
  'surface',
  'surfaceElevated',
  'surfaceMuted',
  'border',
  'borderStrong',
  'inputBg',
  'chromeBg',
  'chromeBorder',
  'chromeText',
  'chromeControlBg',
  'shadow',
];

const COLOR_KEYS = [
  'primary',
  'primaryDark',
  'secondary',
  'accent',
  'gradientStart',
  'gradientEnd',
  'success',
  'successDark',
  'error',
  'errorDark',
  'warning',
  'warningDark',
  'info',
  'infoDark',
  'bgGradientStart',
  'bgGradientEnd',
];

export function resolveThemeName(themeName) {
  if (THEMES[themeName]) {
    return themeName;
  }
  if (LEGACY_THEME_ALIASES[themeName]) {
    return LEGACY_THEME_ALIASES[themeName];
  }
  return DEFAULT_THEME;
}

// Apply theme to document
export function applyTheme(themeName) {
  const resolved = resolveThemeName(themeName);
  const theme = THEMES[resolved];
  const root = document.documentElement;

  COLOR_KEYS.forEach((key) => {
    const cssKey = key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
    root.style.setProperty(`--${cssKey}`, theme[key]);
  });

  SEMANTIC_KEYS.forEach((key) => {
    const cssKey = key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
    root.style.setProperty(`--${cssKey}`, theme[key]);
  });

  document.body.dataset.theme = resolved;
  document.body.dataset.mode = theme.mode;
}

// Load saved theme from storage
export async function loadTheme() {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      const result = await chrome.storage.local.get(STORAGE_KEYS.THEME);
      const stored = result[STORAGE_KEYS.THEME] || DEFAULT_THEME;
      const themeName = resolveThemeName(stored);
      applyTheme(themeName);
      if (stored !== themeName) {
        await saveTheme(themeName);
      }
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
      const resolved = resolveThemeName(themeName);
      await chrome.storage.local.set({ [STORAGE_KEYS.THEME]: resolved });
    }
  } catch (error) {
    console.error('Error saving theme:', error);
  }
}

// Setup theme selector
export function setupThemeSelector() {
  const selector = document.getElementById('themeSelector');
  if (!selector) return;

  Object.keys(THEMES).forEach((key) => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = THEMES[key].name;
    selector.appendChild(option);
  });

  const currentTheme = document.body.dataset.theme || DEFAULT_THEME;
  selector.value = currentTheme;

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
