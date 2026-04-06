Isoflow Sphinx Demo
====================

This page demonstrates the ``.. isoflow::`` directive embedding an interactive
diagram directly into Sphinx documentation.

Network Overview
----------------

.. isoflow:: diagrams/architecture.json
   :height: 450px
   :caption: Sample network architecture

The diagram above is fully interactive — pan and zoom are enabled.  Click the
expand button (top-right corner) to open a full-page view in a new tab.

A Second Diagram
----------------

.. isoflow:: diagrams/simple.json
   :height: 300px
   :width: 80%
   :caption: Minimal two-node diagram
