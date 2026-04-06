import React from 'react';
import { createRoot } from 'react-dom/client';
import { IsoflowViewer } from './IsoflowViewer';
import type { InitialData } from './types/isoflowProps';

interface RenderOptions {
  data: InitialData;
  mode?: 'inline' | 'fullpage';
}

const EXPAND_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`;

// Capture script src at load time for blob HTML generation
const EMBED_SCRIPT_SRC =
  typeof document !== 'undefined'
    ? (document.currentScript as HTMLScriptElement)?.src || ''
    : '';

function createOverlayButton(
  container: HTMLElement,
  data: InitialData
): void {
  const btn = document.createElement('button');
  btn.innerHTML = EXPAND_ICON_SVG;
  btn.title = 'Open in new tab';
  btn.setAttribute(
    'style',
    [
      'position:absolute',
      'top:8px',
      'right:8px',
      'z-index:1000',
      'background:rgba(255,255,255,0.85)',
      'border:1px solid rgba(0,0,0,0.15)',
      'border-radius:6px',
      'padding:6px',
      'cursor:pointer',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'color:#333',
      'box-shadow:0 1px 3px rgba(0,0,0,0.12)',
      'transition:background 0.15s',
    ].join(';')
  );

  btn.addEventListener('mouseenter', () => {
    btn.style.background = 'rgba(255,255,255,1)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.background = 'rgba(255,255,255,0.85)';
  });

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    openFullpageTab(data);
  });

  // Ensure container is positioned for absolute overlay
  const pos = window.getComputedStyle(container).position;
  if (pos === 'static' || pos === '') {
    container.style.position = 'relative';
  }

  container.appendChild(btn);
}

function openFullpageTab(data: InitialData): void {
  const jsonData = JSON.stringify(data);

  let html: string;
  if (EMBED_SCRIPT_SRC) {
    // Script loaded from a URL (e.g., Sphinx _static/) — reference it
    html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Isoflow Viewer</title>
<style>html,body{margin:0;padding:0;height:100%;overflow:hidden}#isoflow-root{width:100%;height:100%}</style>
</head>
<body>
<div id="isoflow-root"></div>
<script>window.__ISOFLOW_DATA__=${jsonData};<\/script>
<script src="${EMBED_SCRIPT_SRC}"><\/script>
<script>IsoflowEmbed.render(document.getElementById('isoflow-root'),{data:window.__ISOFLOW_DATA__,mode:'fullpage'});<\/script>
</body>
</html>`;
  } else {
    // Script was inlined — we can't reference ourselves, so use a minimal approach
    // This case shouldn't normally happen for inline mode (CLI uses fullpage directly)
    html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Isoflow Viewer</title>
<style>html,body{margin:0;padding:0;height:100%;overflow:hidden}</style>
</head>
<body>
<p style="padding:20px;font-family:sans-serif">Please open the standalone HTML file directly for the full view.</p>
</body>
</html>`;
  }

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}

function render(
  container: HTMLElement,
  options: RenderOptions
): void {
  const { data, mode = 'fullpage' } = options;
  const initialData: InitialData = { ...data, fitToView: true };

  // Create a wrapper div for the React root
  const wrapper = document.createElement('div');
  wrapper.style.width = '100%';
  wrapper.style.height = '100%';
  container.appendChild(wrapper);

  const root = createRoot(wrapper);
  root.render(<IsoflowViewer initialData={initialData} />);

  if (mode === 'inline') {
    createOverlayButton(container, data);
  }
}

// Export as UMD global
const IsoflowEmbed = { render };
export { render };
export default IsoflowEmbed;
