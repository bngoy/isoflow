"""Isoflow directive for Sphinx — renders diagrams inline like ``.. figure::``."""

import json
import os
import uuid

from docutils import nodes
from docutils.parsers.rst import Directive, directives


class IsoflowDirective(Directive):
    """Embed an interactive Isoflow diagram.

    Usage::

        .. isoflow:: diagrams/architecture.json
           :height: 400px
           :width: 100%
           :caption: System Architecture
    """

    required_arguments = 1  # path to JSON file
    optional_arguments = 0
    has_content = False
    option_spec = {
        "height": directives.unchanged,
        "width": directives.unchanged,
        "caption": directives.unchanged,
    }

    def run(self):
        env = self.state.document.settings.env
        source_dir = os.path.dirname(env.doc2path(env.docname))
        json_relpath = self.arguments[0]
        json_abspath = os.path.normpath(os.path.join(source_dir, json_relpath))

        # Register as a dependency so Sphinx rebuilds when the JSON changes
        env.note_dependency(json_relpath)

        # Read and validate JSON
        if not os.path.isfile(json_abspath):
            raise self.error(f"Isoflow JSON file not found: {json_abspath}")

        with open(json_abspath, "r", encoding="utf-8") as f:
            try:
                data = json.load(f)
            except json.JSONDecodeError as exc:
                raise self.error(
                    f"Invalid JSON in {json_abspath}: {exc}"
                ) from exc

        height = self.options.get("height", "400px")
        width = self.options.get("width", "100%")
        caption = self.options.get("caption", "")

        uid = f"isoflow-{uuid.uuid4().hex[:8]}"
        json_data = json.dumps(data, separators=(",", ":"))

        caption_html = ""
        if caption:
            caption_html = f"<figcaption><p>{_escape_html(caption)}</p></figcaption>"

        raw_html = (
            f'<figure class="isoflow-figure" style="width:{width};margin:1em auto">'
            f'<div id="{uid}" style="height:{height};width:100%;position:relative;border:1px solid #e0e0e0;border-radius:4px;overflow:hidden"></div>'
            f"{caption_html}"
            f"</figure>"
            f"<script>"
            f"(function(){{"
            f"var d={json_data};"
            f'var c=document.getElementById("{uid}");'
            f"if(typeof IsoflowEmbed!=='undefined'){{IsoflowEmbed.render(c,{{data:d,mode:'inline'}});}}"
            f"else{{c.innerHTML='<p style=\"padding:20px\">Isoflow embed script not loaded.</p>';}}"
            f"}})();"
            f"</script>"
        )

        return [nodes.raw("", raw_html, format="html")]


def _escape_html(text):
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )
