# Sphinx-Isoflow Demo

A minimal Sphinx site demonstrating the `.. isoflow::` directive.

## Prerequisites

- Python 3.8+
- Node.js (to build the embed bundle)

## Setup & Build

```bash
# 1. From the isoflow repo root, build the embed JS bundle
npm run build:embed          # or: npx webpack --config webpack/embed.config.js

# 2. Copy the bundle into the Sphinx extension's static dir
cp dist/isoflow-embed.js packages/sphinx-isoflow/sphinx_isoflow/static/

# 3. Create a Python venv and install Sphinx + the extension
cd examples/sphinx-demo
python3 -m venv .venv
source .venv/bin/activate    # Windows: .venv\Scripts\activate
pip install sphinx
pip install ../../packages/sphinx-isoflow

# 4. Build the HTML docs
sphinx-build -b html . _build

# 5. Open in a browser
open _build/index.html       # macOS
# xdg-open _build/index.html  # Linux
# start _build/index.html     # Windows
```

## What you should see

- Two interactive Isoflow diagrams embedded in the page
- Each diagram supports pan & zoom
- An expand button (↗) in the top-right of each diagram opens a full-page view in a new tab
