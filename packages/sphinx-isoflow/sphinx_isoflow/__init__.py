"""Sphinx extension for embedding interactive Isoflow diagrams."""

import os
from .directive import IsoflowDirective


def register_static_files(app):
    static_dir = os.path.join(os.path.dirname(__file__), "static")
    app.config.html_static_path.append(static_dir)
    app.add_js_file("isoflow-embed.js")


def setup(app):
    app.add_directive("isoflow", IsoflowDirective)
    app.connect("builder-inited", register_static_files)
    return {
        "version": "0.1.0",
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
