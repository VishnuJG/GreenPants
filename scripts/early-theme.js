// Apply the saved theme as early as possible (MV3 CSP-safe: no inline scripts).
(() => {
  const THEMES = {
    light: {
      primary: '#2563eb', primaryDark: '#1d4ed8', secondary: '#60a5fa', accent: '#93c5fd',
      gradientStart: '#2563eb', gradientEnd: '#06b6d4', success: '#16a34a', successDark: '#15803d',
      error: '#dc2626', errorDark: '#b91c1c', warning: '#d97706', warningDark: '#b45309',
      info: '#0284c7', infoDark: '#0369a1', bgGradientStart: '#f8fafc', bgGradientEnd: '#e2e8f0',
      surface: 'rgba(255, 255, 255, 0.96)', surface2: 'rgba(255, 255, 255, 0.75)',
      text: '#0f172a', textMuted: '#475569', border: 'rgba(15, 23, 42, 0.10)',
      inputBg: '#ffffff', inputText: '#0f172a', inputPlaceholder: '#94a3b8',
      codeBg: '#0f172a', codeText: '#e2e8f0'
    },
    dark: {
      primary: '#60a5fa', primaryDark: '#3b82f6', secondary: '#93c5fd', accent: '#bfdbfe',
      gradientStart: '#60a5fa', gradientEnd: '#a78bfa', success: '#4ade80', successDark: '#22c55e',
      error: '#f87171', errorDark: '#ef4444', warning: '#fbbf24', warningDark: '#f59e0b',
      info: '#7dd3fc', infoDark: '#38bdf8', bgGradientStart: '#070a12', bgGradientEnd: '#0b1220',
      surface: 'rgba(17, 24, 39, 0.86)', surface2: 'rgba(30, 41, 59, 0.66)',
      text: '#e5e7eb', textMuted: '#cbd5e1', border: 'rgba(148, 163, 184, 0.20)',
      inputBg: 'rgba(15, 23, 42, 0.80)', inputText: '#e5e7eb', inputPlaceholder: 'rgba(203, 213, 225, 0.70)',
      codeBg: '#0b1220', codeText: '#e5e7eb'
    }
  };

  const VARS = [
    ['--primary', 'primary'],
    ['--primary-dark', 'primaryDark'],
    ['--secondary', 'secondary'],
    ['--accent', 'accent'],
    ['--gradient-start', 'gradientStart'],
    ['--gradient-end', 'gradientEnd'],
    ['--success', 'success'],
    ['--success-dark', 'successDark'],
    ['--error', 'error'],
    ['--error-dark', 'errorDark'],
    ['--warning', 'warning'],
    ['--warning-dark', 'warningDark'],
    ['--info', 'info'],
    ['--info-dark', 'infoDark'],
    ['--bg-gradient-start', 'bgGradientStart'],
    ['--bg-gradient-end', 'bgGradientEnd'],
    ['--surface', 'surface'],
    ['--surface-2', 'surface2'],
    ['--text', 'text'],
    ['--text-muted', 'textMuted'],
    ['--border', 'border'],
    ['--input-bg', 'inputBg'],
    ['--input-text', 'inputText'],
    ['--input-placeholder', 'inputPlaceholder'],
    ['--code-bg', 'codeBg'],
    ['--code-text', 'codeText']
  ];

  function applyTheme(themeName) {
    const resolved = THEMES[themeName] ? themeName : 'light';
    const theme = THEMES[resolved];
    const root = document.documentElement;

    root.dataset.theme = resolved;
    root.style.colorScheme = resolved;

    for (const [cssVar, key] of VARS) {
      root.style.setProperty(cssVar, theme[key]);
    }

    // Force a style/layout flush to avoid "updates only on hover" repaint issues.
    void root.offsetHeight;
  }

  try {
    if (typeof chrome === 'undefined' || !chrome.storage?.local) return;
    chrome.storage.local.get('selectedTheme', (result) => {
      applyTheme(result?.selectedTheme);
    });
  } catch (_) {
    // no-op
  }
})();

