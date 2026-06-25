/**
 * Minimal, XSS-safe markdown renderer for assistant replies. Strategy:
 * escape ALL HTML first, then add only our own safe tags — no raw HTML from
 * the model can survive. Supports fenced + inline code, bold, italic, links
 * (safe schemes only), unordered/ordered lists, h1-h3, paragraphs, <br>.
 * Streaming-safe: call it on the accumulated text each chunk.
 */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const SAFE_SCHEME = /^(https?:\/\/|mailto:|\/|#)/i;

function inline(s: string): string {
  // s is already HTML-escaped.
  s = s.replace(/`([^`]+)`/g, (_m, c) => `<code>${c}</code>`);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, text, url) => {
    const href = SAFE_SCHEME.test(url) ? url : '#';
    return `<a href="${href}" target="_blank" rel="noopener nofollow">${text}</a>`;
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  s = s.replace(/(^|[^_\w])_([^_\n]+)_/g, '$1<em>$2</em>');
  return s;
}

function renderBlocks(text: string): string {
  const lines = text.split('\n');
  let out = '';
  let i = 0;
  let para: string[] = [];
  const flush = () => { if (para.length) { out += `<p>${inline(para.join('<br>'))}</p>`; para = []; } };
  while (i < lines.length) {
    const line = lines[i];
    const h = line.match(/^(#{1,3})\s+(.*)$/);
    if (h) { flush(); out += `<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`; i++; continue; }
    if (/^\s*[-*]\s+/.test(line)) {
      flush(); const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) { items.push(`<li>${inline(lines[i].replace(/^\s*[-*]\s+/, ''))}</li>`); i++; }
      out += `<ul>${items.join('')}</ul>`; continue;
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      flush(); const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) { items.push(`<li>${inline(lines[i].replace(/^\s*\d+\.\s+/, ''))}</li>`); i++; }
      out += `<ol>${items.join('')}</ol>`; continue;
    }
    if (line.trim() === '') { flush(); i++; continue; }
    para.push(line); i++;
  }
  flush();
  return out;
}

export function renderMarkdown(src: string): string {
  const escaped = escapeHtml(src);
  const parts = escaped.split(/```/);
  let html = '';
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 1) {
      // fenced code: drop an optional leading language line, trim outer newlines
      let code = parts[i].replace(/^([^\n]*)\n/, (m, first) => (/^\w*$/.test(first.trim()) ? '' : m));
      code = code.replace(/^\n+/, '').replace(/\n+$/, '');
      html += `<pre><code>${code}</code></pre>`;
    } else {
      html += renderBlocks(parts[i]);
    }
  }
  return html;
}
