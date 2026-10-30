# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Single-page personal portfolio (Spanish-language content) built with plain HTML, CSS and vanilla JS. There is no build step, package manager, linter, or test suite — open `index.html` directly in a browser (or serve the folder with any static server) to run it.

## Structure

- `index.html` — all content. Sections (`#inicio`, `#sobre-mi`, `#proyectos`, `#experiencia`, `#educacion`, `#contacto`) are linked from the nav via matching `href="#id"`. Includes JSON-LD structured data in the `<head>`.
- `style.css` — all styling.
- `script.js` — a single IIFE, loaded at the end of `<body>`.

## Things that span files

- **Theming is implemented twice in CSS.** Dark-mode variables are defined under `[data-theme="dark"]` *and* duplicated in `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { ... } }` (same for the `.theme-toggle` sun/moon icons). When changing a color token or theme-dependent style, update both blocks. `script.js` sets `data-theme` on `<html>` from `localStorage["theme"]`, falling back to the OS preference.
- **Nav active-link/smooth-scroll** in `script.js` derives its section list from `.nav-links a[href^="#"]`, so a new section needs both a nav link and a matching element `id`.
- **Scroll reveal:** any element with class `.reveal` gets `.visible` added by an IntersectionObserver; the animation lives in CSS, so new sections need both the class and the corresponding CSS.
- **Contact form** (`#contact-form`) is validated client-side only; submit is `preventDefault`ed and shows a success message without sending anything. There is no backend.
