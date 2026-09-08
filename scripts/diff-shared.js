// Shared line diff rendering for JSON/YAML diff pages

export function buildLineDiff(leftLines, rightLines) {
  const rows = [];
  const m = leftLines.length;
  const n = rightLines.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = m - 1; i >= 0; i -= 1) {
    for (let j = n - 1; j >= 0; j -= 1) {
      dp[i][j] = leftLines[i] === rightLines[j]
        ? dp[i + 1][j + 1] + 1
        : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (leftLines[i] === rightLines[j]) {
      rows.push({ type: 'same', left: leftLines[i], right: rightLines[j], leftNo: i + 1, rightNo: j + 1 });
      i += 1;
      j += 1;
      continue;
    }

    if (dp[i + 1][j] >= dp[i][j + 1]) {
      rows.push({ type: 'removed', left: leftLines[i], right: '', leftNo: i + 1, rightNo: null });
      i += 1;
    } else {
      rows.push({ type: 'added', left: '', right: rightLines[j], leftNo: null, rightNo: j + 1 });
      j += 1;
    }
  }

  while (i < m) {
    rows.push({ type: 'removed', left: leftLines[i], right: '', leftNo: i + 1, rightNo: null });
    i += 1;
  }

  while (j < n) {
    rows.push({ type: 'added', left: '', right: rightLines[j], leftNo: null, rightNo: j + 1 });
    j += 1;
  }

  for (let index = 0; index < rows.length - 1; index += 1) {
    const current = rows[index];
    const next = rows[index + 1];
    if (current.type === 'removed' && next.type === 'added') {
      rows[index] = {
        type: 'changed',
        left: current.left,
        right: next.right,
        leftNo: current.leftNo,
        rightNo: next.rightNo,
      };
      rows.splice(index + 1, 1);
    }
  }

  return rows;
}

export function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function renderDiffPanel(container, side, rows) {
  container.innerHTML = '';
  const fragment = document.createDocumentFragment();

  rows.forEach((row) => {
    const line = document.createElement('div');
    const text = side === 'left' ? row.left : row.right;
    const lineNo = side === 'left' ? row.leftNo : row.rightNo;

    line.className = 'diff-line';
    if (row.type === 'same') {
      line.classList.add('same');
    } else if (row.type === 'removed' && side === 'left') {
      line.classList.add('removed');
    } else if (row.type === 'added' && side === 'right') {
      line.classList.add('added');
    } else if (row.type === 'changed') {
      line.classList.add(side === 'left' ? 'changed-left' : 'changed-right');
    } else if (!text) {
      line.classList.add('empty');
    }

    line.innerHTML = `
      <span class="line-no">${lineNo ?? ''}</span>
      <span class="line-text">${escapeHtml(text)}</span>
    `;
    fragment.appendChild(line);
  });

  container.appendChild(fragment);
}

export function summarizeDiff(rows) {
  return {
    added: rows.filter((row) => row.type === 'added').length,
    removed: rows.filter((row) => row.type === 'removed').length,
    changed: rows.filter((row) => row.type === 'changed').length,
    same: rows.filter((row) => row.type === 'same').length,
  };
}
