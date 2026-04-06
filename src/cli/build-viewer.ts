#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';

function usage(): void {
  console.log(`Usage: isoflow-build <input.json> [options]

Options:
  -o, --output <file>    Output HTML file (default: <input>.html)
  --height <value>       Container height (default: 100%)
  --title <value>        Page title (default: Isoflow Viewer)
  -h, --help             Show this help message`);
}

function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
    usage();
    process.exit(args.length === 0 ? 1 : 0);
  }

  let inputFile = '';
  let outputFile = '';
  let height = '100%';
  let title = 'Isoflow Viewer';

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-o' || arg === '--output') {
      outputFile = args[++i];
    } else if (arg === '--height') {
      height = args[++i];
    } else if (arg === '--title') {
      title = args[++i];
    } else if (!arg.startsWith('-')) {
      inputFile = arg;
    }
  }

  if (!inputFile) {
    console.error('Error: No input file specified.');
    usage();
    process.exit(1);
  }

  const inputPath = path.resolve(inputFile);
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: Input file not found: ${inputPath}`);
    process.exit(1);
  }

  if (!outputFile) {
    const basename = path.basename(inputFile, path.extname(inputFile));
    outputFile = `${basename}.html`;
  }

  // Read the input JSON
  const jsonData = fs.readFileSync(inputPath, 'utf-8');

  // Validate it's valid JSON
  try {
    JSON.parse(jsonData);
  } catch {
    console.error('Error: Input file is not valid JSON.');
    process.exit(1);
  }

  // Find the embed bundle
  const embedBundlePath = path.resolve(__dirname, '..', 'isoflow-embed.js');
  if (!fs.existsSync(embedBundlePath)) {
    console.error(
      `Error: Embed bundle not found at ${embedBundlePath}.\nRun "npm run build:embed" first.`
    );
    process.exit(1);
  }

  const embedJs = fs.readFileSync(embedBundlePath, 'utf-8');

  // Height style: if 100%, make html/body fill viewport
  const isFullHeight = height === '100%';
  const bodyStyle = isFullHeight
    ? 'html,body{margin:0;padding:0;height:100%;overflow:hidden}#isoflow{width:100%;height:100%}'
    : `body{margin:0;padding:20px;font-family:sans-serif}#isoflow{width:100%;height:${height}}`;

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${escapeHtml(title)}</title>
<style>${bodyStyle}</style>
</head>
<body>
<div id="isoflow"></div>
<script>window.__ISOFLOW_DATA__=${jsonData};</script>
<script>${embedJs}</script>
<script>IsoflowEmbed.render(document.getElementById('isoflow'),{data:window.__ISOFLOW_DATA__});</script>
</body>
</html>`;

  const outputPath = path.resolve(outputFile);
  fs.writeFileSync(outputPath, html, 'utf-8');
  console.log(`Created: ${outputPath}`);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

main();
