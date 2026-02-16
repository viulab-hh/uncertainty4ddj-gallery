# Uncertainty Visualizations — Gallery

This repository contains a small client-side gallery for uncertainty visualizations used in the Uncertainty4ddj project. It is a lightweight HTML/CSS/JavaScript app that reads a local `data.json` dataset and renders cards, filters and a detail modal. It was created using ChatGPT, Microsoft Copilot and GitHub Copilot Agent. This README was also created using AI and altered to fit the circumstances.

**What it does**
- Loads `data.json` and renders a responsive gallery of visualizations.
- Provides search and multi-select filters (cluster, topic, medium, chart type, date).
- Shows a modal with details and a link to the original source.
- On page load the gallery order is randomized (refresh to reshuffle); filtering preserves the current order.

**Quick start**
- Open `index.html` (or the file you prefer) in a modern browser — no server required for basic browsing.
- To use locally with `fetch()` consistently, run a small local server, e.g.:

  - Python 3: `python -m http.server 8000` 

  Then open `http://localhost:8000/` and navigate to the folder.

**Files & structure**
- `index.html` — main gallery page (HTML, styles and embedded JS).
- `data.json` — dataset (array of items) used to populate cards and filters.
- `images/` — folder with visualization thumbnails and images referenced by entries in `data.json`.
- `csv_to_json_converter.py` — helper script used historically to create `data.json` from CSV after a notion export (see README_CSV_CONVERTER.md).
- `Alte Versuche/` — older experiments and backups.

**Data format (important for contributors)**
- `data.json` is an array of objects. Important fields used by the app:
  - `Titel`: article title (string)
  - `Visualisierungstitel (falls nicht identisch)`: visualization title (string, preferred for cards)
  - `Datum`: human-readable date string like `3. Juni 2024` (German month names)
  - `Bild`: filename in `images/` (e.g. `example.jpg`)
  - `Thema`, `Cluster`, `Quelle - Tags`, `Art der Visualisierung - Tags`, `Visualisierung der Unsicherheit` etc.

- Date handling: the app expects `Datum` in a textual German form (e.g. `3. Juni 2024`). The code extracts `Monat Jahr` and maps German month names to month numbers to support sorting. If you change the date format, update `formatDateReadable()` and `getDateSortKey()` in the HTML.

**How the JS works (overview)**
- `loadJSON()` fetches `data.json`.
- On initial load the list is shuffled once (Fisher–Yates) — implemented to randomize the homepage view only.
- `populateFilters()` builds unique filter values from the dataset and renders clickable options.
- Filters update internal hidden checkbox state; `filterAndRenderGallery()` reads those values and filters DATA client-side using AND across categories and OR within each category.
- `renderGallery()` draws cards using visualization title (if present), and `openModal()` shows full details.

**Styling & UI notes**
- Styles are embedded inside the HTML. The CSS uses CSS variables near the top of the file for colors, radius and base font.
- Filter panels are implemented with `details`/`summary` and close automatically when clicking outside.
- Visual behavior to note: the reset button has a subtle hover effect; selected filter options are visually highlighted.

**Contributing / Editing**

IMPORTANT: Always update the data in the Notion database, export it as CSV and follow the instructions in 'Datenanleitung Mock-Up.txt' and 'README_CSV_CONVERTER.md' to create a new 'data.json' in this project

- To add or edit entries: update `data.json`. Keep the same field names and the date format unless you also update the parsing code.
- To add images: put image files into `images/` and reference them from the `Bild` field.
- To change filters or add new fields: update `populateFilters()` and the filter reading logic in `filterAndRenderGallery()`.
- If you refactor JS into external files, remember to update the HTML to include them and to keep variable names consistent (`DATA`, helper functions etc.).
- Keep UI behavior stable: initial shuffle occurs only on page load where `DATA` is first assigned; do not call `shuffleArray()` inside filter handlers if you want deterministic filtering.

**Testing & troubleshooting**
- If cards disappear after edits, open the browser console — a common cause is an undefined variable in the rendering code (e.g. wrong field names). Search the HTML for field accessors like `d.Titel` or `d["Visualisierungstitel (falls nicht identisch)"]`.
- If `fetch('data.json')` fails in the browser when opening the file locally, run a local server as shown above.

**Deployment**
- For private GitHub repositories you can push this repo normally. If you want to publish a static demo, GitHub Pages can host the static `*.html` files; note that Pages requires the repository to be public or to use a Pages build from `main` for private repos under certain plans.

**Contact & attribution**
- This code was developed for the Uncertainty4ddj project at HAW Hamburg. For questions about the dataset or usage, contact the project maintainer (see footer in the HTML).

---


