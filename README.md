# Molecular Viewer

An interactive 3D molecular visualization tool built with [NGL Viewer](https://nglviewer.org/), React, and TypeScript. Load any protein or nucleic acid structure from the RCSB Protein Data Bank and explore it in real time directly in the browser.

## Overview

This project demonstrates how WebGL-based molecular graphics can be embedded in a modern web application. NGL Viewer handles the heavy lifting of parsing structural biology file formats (mmCIF, BCIF) and rendering them as interactive 3D scenes — no plugins or desktop software required.

## Features

- **Live structure loading** — enter any PDB ID to fetch and render the structure directly from [RCSB PDB](https://www.rcsb.org/)
- **Multiple representations** — switch between Cartoon, Ribbon, Ball & Stick, Licorice, and Surface views
- **Preset structures** — one-click access to well-known molecules (Crambin, Hemoglobin, B-DNA, and more)
- **Interactive 3D controls** — rotate, zoom, and pan with mouse or trackpad
- **Responsive dark UI** — clean sidebar layout that works on different screen sizes

## Tech Stack

| Layer | Technology |
|---|---|
| UI framework | React 19 + TypeScript |
| Build tool | Vite |
| 3D rendering | NGL Viewer (WebGL) |
| Structure data | RCSB Protein Data Bank API |

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

1. Type a valid **PDB ID** (e.g. `1CRN`, `4HHB`, `1BNA`) into the input and click **Load**
2. Use the **Representation** buttons to change the visual style
3. Click any **Preset** for a quick demo structure
4. **Drag** to rotate · **Scroll** to zoom · **Right-drag** to pan

## About NGL Viewer

[NGL](https://github.com/nglviewer/ngl) is an open-source WebGL-based molecular graphics library. It supports a wide range of file formats and representation types used in structural biology, and fetches structures directly from public databases like RCSB PDB and PDBe.

## Data Source

Structures are fetched on demand from the **RCSB Protein Data Bank** (`files.rcsb.org` / `models.rcsb.org`). No data is stored locally. The PDB currently archives over 220,000 experimentally determined biological macromolecular structures.
