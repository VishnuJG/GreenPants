// Request Body Management

let currentBodyType = 'json';
let isBodyExpanded = false;

// Initialize body management
export function initBodyManager() {
  const bodyTypeButtons = document.querySelectorAll('.body-type-btn');

  bodyTypeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      bodyTypeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentBodyType = btn.dataset.bodyType;
      updateBodyPlaceholder();
    });
  });

  initJsonEditorHelpers();
  updateBodyPlaceholder();
}

function initJsonEditorHelpers() {
  const bodyEditor = document.getElementById('bodyEditor');
  const formatBtn = document.getElementById('formatJson');
  const minifyBtn = document.getElementById('minifyJson');
  const expandBtn = document.getElementById('expandBody');

  formatBtn?.addEventListener('click', formatJson);
  minifyBtn?.addEventListener('click', minifyJson);
  expandBtn?.addEventListener('click', toggleBodyExpand);

  bodyEditor?.addEventListener('input', updateJsonStatus);
  bodyEditor?.addEventListener('keydown', handleJsonEditorKeydown);
  bodyEditor?.addEventListener('paste', handleJsonPaste);
  bodyEditor?.addEventListener('scroll', syncEditorBackdropScroll);
}

function getEditorElements() {
  return {
    container: document.getElementById('bodyEditorContainer'),
    backdrop: document.getElementById('bodyEditorBackdrop'),
    editor: document.getElementById('bodyEditor'),
  };
}

function syncEditorBackdropScroll() {
  const { backdrop, editor } = getEditorElements();
  if (!backdrop || !editor) {
    return;
  }
  backdrop.scrollTop = editor.scrollTop;
  backdrop.scrollLeft = editor.scrollLeft;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function indexToLineCol(text, index) {
  const before = text.slice(0, index);
  const lines = before.split('\n');
  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1,
  };
}

function lineColToIndex(text, line, column) {
  const lines = text.split('\n');
  let index = 0;
  for (let i = 1; i < line && i <= lines.length; i++) {
    index += lines[i - 1].length + 1;
  }
  index += Math.max(0, column - 1);
  return Math.min(index, text.length);
}

function expandErrorRange(text, index) {
  let start = Math.max(0, Math.min(index, text.length));
  let end = start + 1;

  while (start > 0 && !/\s/.test(text[start - 1]) && /[^\s,:{[\]}]/.test(text[start - 1])) {
    start--;
  }

  while (end < text.length && !/\s/.test(text[end]) && /[^\s,:{[\]}]/.test(text[end])) {
    end++;
  }

  if (end <= start) {
    end = Math.min(start + 1, text.length);
  }

  return { start, end };
}

function locateJsonSyntaxError(str) {
  let i = 0;
  const n = str.length;

  const fail = () => {
    throw { pos: i };
  };

  const ws = () => {
    while (i < n && /\s/.test(str[i])) {
      i++;
    }
  };

  const strVal = () => {
    i++;
    while (i < n) {
      const c = str[i];
      if (c === '\\') {
        i += 2;
        continue;
      }
      if (c === '"') {
        i++;
        return;
      }
      i++;
    }
    fail();
  };

  const numVal = () => {
    if (str[i] === '-') {
      i++;
    }
    if (i >= n || !/[0-9]/.test(str[i])) {
      fail();
    }
    while (i < n && /[0-9]/.test(str[i])) {
      i++;
    }
    if (str[i] === '.') {
      i++;
      while (i < n && /[0-9]/.test(str[i])) {
        i++;
      }
    }
    if (str[i] === 'e' || str[i] === 'E') {
      i++;
      if (str[i] === '+' || str[i] === '-') {
        i++;
      }
      while (i < n && /[0-9]/.test(str[i])) {
        i++;
      }
    }
  };

  const lit = (literal) => {
    if (!str.startsWith(literal, i)) {
      fail();
    }
    i += literal.length;
  };

  const val = () => {
    ws();
    if (i >= n) {
      fail();
    }
    const c = str[i];
    if (c === '"') {
      strVal();
      return;
    }
    if (c === '{') {
      obj();
      return;
    }
    if (c === '[') {
      arr();
      return;
    }
    if (c === '-' || (c >= '0' && c <= '9')) {
      numVal();
      return;
    }
    if (c === 't') {
      lit('true');
      return;
    }
    if (c === 'f') {
      lit('false');
      return;
    }
    if (c === 'n') {
      lit('null');
      return;
    }
    fail();
  };

  const obj = () => {
    i++;
    ws();
    if (i < n && str[i] === '}') {
      i++;
      return;
    }
    while (true) {
      ws();
      if (str[i] !== '"') {
        fail();
      }
      strVal();
      ws();
      if (str[i] !== ':') {
        fail();
      }
      i++;
      val();
      ws();
      if (str[i] === '}') {
        i++;
        return;
      }
      if (str[i] !== ',') {
        fail();
      }
      i++;
    }
  };

  const arr = () => {
    i++;
    ws();
    if (i < n && str[i] === ']') {
      i++;
      return;
    }
    while (true) {
      val();
      ws();
      if (str[i] === ']') {
        i++;
        return;
      }
      if (str[i] !== ',') {
        fail();
      }
      i++;
    }
  };

  try {
    val();
    ws();
    if (i < n) {
      fail();
    }
  } catch (e) {
    if (typeof e.pos === 'number') {
      return e.pos;
    }
  }

  return -1;
}

function findJsonErrorPosition(text, error) {
  const lineColMatch = error.message.match(/line (\d+) column (\d+)/i);
  if (lineColMatch) {
    return lineColToIndex(text, parseInt(lineColMatch[1], 10), parseInt(lineColMatch[2], 10));
  }

  const posMatch = error.message.match(/position (\d+)/i);
  if (posMatch) {
    return parseInt(posMatch[1], 10);
  }

  if (/Unexpected end of JSON input/i.test(error.message)) {
    return text.length;
  }

  const chromeMatch = error.message.match(/Unexpected token .*, "((?:\\.|[^"\\])*)"/);
  if (chromeMatch) {
    const snippet = chromeMatch[1]
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\');
    const idx = text.indexOf(snippet);
    if (idx >= 0) {
      return idx + snippet.length;
    }
  }

  return locateJsonSyntaxError(text);
}

function buildHighlightHtml(text, range) {
  if (!range) {
    return escapeHtml(text) + '\n';
  }

  const before = escapeHtml(text.slice(0, range.start));
  const error = escapeHtml(text.slice(range.start, range.end));
  const after = escapeHtml(text.slice(range.end));
  return `${before}<mark class="json-error-highlight">${error}</mark>${after}\n`;
}

function updateJsonHighlight(text, errorRange) {
  const { container, backdrop, editor } = getEditorElements();

  if (!container || !backdrop || !editor || currentBodyType !== 'json') {
    return;
  }

  container.classList.add('json-highlight-mode');
  backdrop.innerHTML = buildHighlightHtml(text, errorRange);
  syncEditorBackdropScroll();
}

function clearJsonHighlight() {
  const { container, backdrop } = getEditorElements();

  if (container) {
    container.classList.remove('json-highlight-mode', 'invalid');
  }
  if (backdrop) {
    backdrop.textContent = '';
  }
}

function updateJsonToolbarVisibility() {
  const toolbar = document.getElementById('jsonToolbar');
  if (toolbar) {
    toolbar.hidden = currentBodyType !== 'json';
  }

  if (currentBodyType !== 'json') {
    clearJsonHighlight();
  }

  updateJsonStatus();
}

function updateJsonStatus() {
  const { container, editor } = getEditorElements();
  const statusEl = document.getElementById('jsonStatus');

  if (!editor || !statusEl || currentBodyType !== 'json') {
    clearJsonHighlight();
    return;
  }

  const raw = editor.value;
  const content = raw.trim();
  const trimOffset = content ? raw.indexOf(content) : 0;

  if (!content) {
    container?.classList.remove('invalid');
    clearJsonHighlight();
    statusEl.className = 'json-status empty';
    statusEl.textContent = 'Empty';
    statusEl.title = '';
    return;
  }

  try {
    JSON.parse(content);
    container?.classList.remove('invalid');
    updateJsonHighlight(raw, null);
    statusEl.className = 'json-status valid';
    statusEl.textContent = '✓ Valid JSON';
    statusEl.title = '';
  } catch (e) {
    container?.classList.add('invalid');
    const errorIndex = findJsonErrorPosition(content, e);
    const adjustedIndex = errorIndex >= 0 ? errorIndex + trimOffset : -1;
    const errorRange = adjustedIndex >= 0
      ? expandErrorRange(raw, adjustedIndex)
      : null;
    updateJsonHighlight(raw, errorRange);

    const location = adjustedIndex >= 0 ? indexToLineCol(raw, adjustedIndex) : null;
    const locationLabel = location ? `Line ${location.line}, col ${location.column}: ` : '';

    statusEl.className = 'json-status invalid';
    statusEl.textContent = '✗ ' + locationLabel + e.message;
    statusEl.title = e.message;
  }
}

function formatJson() {
  const bodyEditor = document.getElementById('bodyEditor');
  if (!bodyEditor || currentBodyType !== 'json') {
    return;
  }

  const content = bodyEditor.value.trim();
  if (!content) {
    return;
  }

  try {
    bodyEditor.value = JSON.stringify(JSON.parse(content), null, 2);
    updateJsonStatus();
  } catch {
    updateJsonStatus();
  }
}

function minifyJson() {
  const bodyEditor = document.getElementById('bodyEditor');
  if (!bodyEditor || currentBodyType !== 'json') {
    return;
  }

  const content = bodyEditor.value.trim();
  if (!content) {
    return;
  }

  try {
    bodyEditor.value = JSON.stringify(JSON.parse(content));
    updateJsonStatus();
  } catch {
    updateJsonStatus();
  }
}

function toggleBodyExpand() {
  const bodyEditor = document.getElementById('bodyEditor');
  const expandBtn = document.getElementById('expandBody');

  if (!bodyEditor) {
    return;
  }

  isBodyExpanded = !isBodyExpanded;
  bodyEditor.classList.toggle('expanded', isBodyExpanded);
  expandBtn?.classList.toggle('active', isBodyExpanded);
  if (expandBtn) {
    expandBtn.textContent = isBodyExpanded ? 'Collapse' : 'Expand';
  }
}

function handleJsonEditorKeydown(e) {
  if (currentBodyType !== 'json' || e.key !== 'Tab') {
    return;
  }

  e.preventDefault();
  const editor = e.target;
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const indent = '  ';

  if (start !== end) {
    const selected = editor.value.slice(start, end);
    const lines = selected.split('\n');
    const indented = e.shiftKey
      ? lines.map(line => line.replace(/^  /, '')).join('\n')
      : lines.map(line => indent + line).join('\n');
    editor.value = editor.value.slice(0, start) + indented + editor.value.slice(end);
    editor.selectionStart = start;
    editor.selectionEnd = start + indented.length;
  } else {
    editor.value = editor.value.slice(0, start) + indent + editor.value.slice(end);
    editor.selectionStart = editor.selectionEnd = start + indent.length;
  }

  editor.dispatchEvent(new Event('input', { bubbles: true }));
}

function handleJsonPaste(e) {
  if (currentBodyType !== 'json') {
    return;
  }

  const pasted = e.clipboardData?.getData('text')?.trim();
  if (!pasted) {
    return;
  }

  try {
    JSON.parse(pasted);
    e.preventDefault();
    const editor = e.target;
    const formatted = JSON.stringify(JSON.parse(pasted), null, 2);
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    editor.value = editor.value.slice(0, start) + formatted + editor.value.slice(end);
    editor.selectionStart = editor.selectionEnd = start + formatted.length;
    editor.dispatchEvent(new Event('input', { bubbles: true }));
  } catch {
    // Let default paste happen for non-JSON text
  }
}

// Update placeholder based on body type
function updateBodyPlaceholder() {
  const bodyEditor = document.getElementById('bodyEditor');

  const placeholders = {
    json: '{\n  "key": "value",\n  "name": "John Doe"\n}',
    form: 'key1=value1\nkey2=value2\nname=John Doe',
    raw: 'Enter raw text here...',
    none: ''
  };

  if (bodyEditor) {
    bodyEditor.placeholder = placeholders[currentBodyType] || '';

    if (currentBodyType === 'none') {
      bodyEditor.disabled = true;
      bodyEditor.value = '';
    } else {
      bodyEditor.disabled = false;
    }
  }

  updateJsonToolbarVisibility();
}

// Get current body type
export function getBodyType() {
  return currentBodyType;
}

// Get body content based on type
export function getBody() {
  const bodyEditor = document.getElementById('bodyEditor');

  if (!bodyEditor || currentBodyType === 'none') {
    return null;
  }

  const content = bodyEditor.value.trim();

  if (!content) {
    return null;
  }

  switch (currentBodyType) {
    case 'json':
      try {
        JSON.parse(content);
        return content;
      } catch (e) {
        throw new Error('Invalid JSON format: ' + e.message);
      }

    case 'form':
      return content;

    case 'raw':
      return content;

    default:
      return null;
  }
}

// Set body content
export function setBody(content, type = 'json') {
  const bodyEditor = document.getElementById('bodyEditor');
  const bodyTypeButtons = document.querySelectorAll('.body-type-btn');

  if (bodyEditor) {
    bodyEditor.value = content || '';
  }

  if (type) {
    currentBodyType = type;
    bodyTypeButtons.forEach(btn => {
      if (btn.dataset.bodyType === type) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    updateBodyPlaceholder();
  }

  updateJsonStatus();
}

// Clear body
export function clearBody() {
  const bodyEditor = document.getElementById('bodyEditor');
  if (bodyEditor) {
    bodyEditor.value = '';
  }
  updateJsonStatus();
}

// Get Content-Type header based on body type
export function getContentTypeHeader() {
  switch (currentBodyType) {
    case 'json':
      return 'application/json';
    case 'form':
      return 'application/x-www-form-urlencoded';
    case 'raw':
      return 'text/plain';
    default:
      return null;
  }
}
