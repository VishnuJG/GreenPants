// YAML parse, repair, and format helpers

import { parse, stringify } from './vendor/yaml.mjs';

export const YAML_OPTIONS = { indent: 2, lineWidth: 0 };

export function preprocessYaml(text) {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\t/g, '  ')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trim();
}

function tryParseJson(text) {
  const trimmed = text.trim();
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
    return null;
  }

  try {
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
}

function isQuoted(value) {
  return (
    (value.startsWith('"') && value.endsWith('"'))
    || (value.startsWith("'") && value.endsWith("'"))
  );
}

export function repairYamlText(text) {
  let cleaned = preprocessYaml(text);

  const jsonValue = tryParseJson(cleaned);
  if (jsonValue !== null) {
    return stringify(jsonValue, YAML_OPTIONS).trimEnd();
  }

  cleaned = cleaned.split('\n').map((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('---')) {
      return line;
    }

    const match = line.match(/^(\s*(?:-\s*)?)([\w.-]+):\s*(.+)$/);
    if (!match) {
      return line;
    }

    const [, indent, key, rawValue] = match;
    const value = rawValue.trim();

    if (!value || isQuoted(value) || value.startsWith('[') || value.startsWith('{')) {
      return line;
    }

    if (value.includes(':')) {
      const escaped = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      return `${indent}${key}: "${escaped}"`;
    }

    if (/[#{},[\]&*!|>'"%@`]/.test(value)) {
      const escaped = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      return `${indent}${key}: "${escaped}"`;
    }

    return line;
  }).join('\n');

  return cleaned;
}

export function formatYamlValue(value) {
  if (value === null || value === undefined) {
    return '';
  }
  return stringify(value, YAML_OPTIONS).trimEnd();
}

export function parseYamlDocument(text, { side = 'YAML', repair = false } = {}) {
  const trimmed = text.trim();
  if (!trimmed) {
    return { ok: true, value: null };
  }

  const candidates = repair
    ? [trimmed, preprocessYaml(trimmed), repairYamlText(trimmed)]
    : [preprocessYaml(trimmed), trimmed];

  const jsonValue = tryParseJson(trimmed);
  if (jsonValue !== null) {
    return { ok: true, value: jsonValue, repaired: true };
  }

  const seen = new Set();
  for (const candidate of candidates) {
    if (!candidate || seen.has(candidate)) {
      continue;
    }
    seen.add(candidate);

    try {
      return {
        ok: true,
        value: parse(candidate, { strict: false }),
        repaired: candidate !== trimmed,
      };
    } catch {
      // Try next candidate.
    }
  }

  let lastError = null;
  for (const candidate of candidates) {
    try {
      parse(candidate);
    } catch (error) {
      lastError = error;
    }
  }

  return {
    ok: false,
    error: `${side} YAML is invalid: ${lastError?.message || 'Unknown parse error'}`,
  };
}

export function fixYamlText(text) {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error('Paste YAML to fix and format.');
  }

  const jsonValue = tryParseJson(trimmed);
  if (jsonValue !== null) {
    return {
      text: formatYamlValue(jsonValue),
      repaired: true,
      note: 'Converted from JSON',
    };
  }

  const repaired = repairYamlText(trimmed);
  const result = parseYamlDocument(repaired, { repair: true });
  if (!result.ok) {
    const message = result.error.replace(/^YAML YAML is invalid: /, '').replace(/^Left YAML is invalid: /, '');
    throw new Error(message);
  }

  return {
    text: formatYamlValue(result.value),
    repaired: repaired !== preprocessYaml(trimmed) || result.repaired,
    note: result.repaired ? 'Repaired and formatted' : 'Formatted',
  };
}
