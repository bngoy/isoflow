# sphinx-isoflow

A Sphinx extension for embedding interactive [Isoflow](https://github.com/markmanx/isoflow) network diagrams directly into your documentation.

Diagrams are rendered client-side using the Isoflow viewer — they support pan, zoom, and an expand-to-fullpage button out of the box.

## Installation

```bash
pip install sphinx-isoflow
```

Or install from a local checkout:

```bash
pip install ./packages/sphinx-isoflow
```

## Setup

### 1. Build the embed bundle

The extension requires `isoflow-embed.js` in its static directory. From the isoflow repo root:

```bash
npm run build:embed
cp dist/isoflow-embed.js packages/sphinx-isoflow/sphinx_isoflow/static/
```

### 2. Enable the extension

Add `sphinx_isoflow` to your Sphinx `conf.py`:

```python
extensions = ["sphinx_isoflow"]
```

## Usage

Use the `.. isoflow::` directive to embed a diagram from a JSON file:

```rst
.. isoflow:: diagrams/architecture.json
```

### Options

| Option       | Default  | Description                        |
|--------------|----------|------------------------------------|
| `:height:`   | `400px`  | Height of the diagram container    |
| `:width:`    | `100%`   | Width of the diagram container     |
| `:caption:`  | *(none)* | Caption displayed below the figure |

### Full example

```rst
.. isoflow:: diagrams/architecture.json
   :height: 450px
   :width: 80%
   :caption: System Architecture
```

This renders as a `<figure>` element with the interactive diagram inside and an optional caption below it. Each diagram includes an expand button (top-right) that opens a full-page interactive view in a new browser tab.

## JSON format

The directive expects an Isoflow model JSON file. A minimal example:

```json
{
  "version": "1.0.0",
  "title": "My Diagram",
  "colors": [
    { "id": "blue", "value": "#a5b8f3" }
  ],
  "icons": [],
  "items": [
    { "id": "client", "name": "Client" },
    { "id": "server", "name": "Server" }
  ],
  "views": [
    {
      "id": "v1",
      "name": "Default",
      "items": [
        { "id": "client", "tile": { "x": 0, "y": 0 } },
        { "id": "server", "tile": { "x": 5, "y": 0 } }
      ],
      "connectors": [
        {
          "id": "c1",
          "color": "blue",
          "anchors": [
            { "id": "a1", "ref": { "item": "client" } },
            { "id": "a2", "ref": { "item": "server" } }
          ]
        }
      ],
      "rectangles": []
    }
  ]
}
```

## Running the demo

A complete working example is available in `examples/sphinx-demo/`:

```bash
# From the isoflow repo root
npm run build:embed
cp dist/isoflow-embed.js packages/sphinx-isoflow/sphinx_isoflow/static/

cd examples/sphinx-demo
python3 -m venv .venv
source .venv/bin/activate
pip install sphinx
pip install ../../packages/sphinx-isoflow

sphinx-build -b html . _build
open _build/index.html
```

## How it works

1. The directive reads the JSON file at build time and inlines the data into a `<script>` tag.
2. Sphinx copies `isoflow-embed.js` (a self-contained UMD bundle with React included) into `_static/`.
3. On page load, each diagram container calls `IsoflowEmbed.render()` in inline mode, which mounts the Isoflow viewer and adds an expand overlay button.
4. Sphinx rebuilds automatically when the JSON source file changes (registered as a dependency).

## License

MIT
