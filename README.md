# AssetLens

A web app for importing asset spreadsheets. Upload an `.xlsx`, `.xls`, `.xlsm`, `.csv` or `.tsv` file (up to 20 MB, multiple sheets supported) and the app extracts asset type, manufacturer, model, serial number, CPU, RAM, storage and screen size, even when headers, column order or structure differ between files. Every other column is kept and shown alongside.

Files are parsed entirely in the browser. Nothing is uploaded to a server and there is no login.

## Features

- Drag-and-drop or click-to-browse upload
- Automatic header detection, column mapping and field extraction
- Searchable, sortable, paginated table of the extracted assets
- Column details per sheet showing how each field was detected
- Light and dark themes
- Responsive layout with a scroll-to-top button

## Tech stack

- **React 19** + **TypeScript**
- **Vite 6** (SWC) for dev server and builds
- **Mantine 9** (core, dropzone) and **mantine-datatable** for UI and tables
- **SheetJS (`xlsx`)** for Excel files and **csvtojson** for CSV files
- **Tailwind CSS 4** for base styles
- **React Router 7** for routing
- **ESLint** + **Prettier**

## Getting started

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

The dev server runs at http://localhost:5173.

## Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the dev server                 |
| `npm run build`   | Type-check and build to `dist/`      |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint                           |

## How parsing works

The parser lives in [`src/utils/assetParser`](src/utils/assetParser):

1. Readers (`readers.ts`) turn a CSV or each workbook sheet into a raw grid of strings.
2. The header row is located automatically (`headers.ts`), so title rows above the table are skipped.
3. Columns are mapped to asset fields by header name; unrecognised headers are mapped from their values (`inference.ts`).
4. Missing fields are filled from description-style text columns (`extractors.ts`).
5. Columns that are not asset fields are kept as extra columns.

The Column details section shows, per sheet, which source column was mapped to each field and how it was detected.

To support a new header name, manufacturer, device type or CPU family, add it to the lists in `patterns.ts`.

## Deployment

The app is a static site. `npm run build` writes the output to `dist/`.

On Render (Static Site):

| Setting           | Value                                    |
| ----------------- | ---------------------------------------- |
| Build command     | `npm install && npm run build`           |
| Publish directory | `dist`                                   |
| Rewrite rule      | `/*` to `/index.html` (for client routes) |

## Project structure

```
src/
├── assets/         Styles and images, with a central index.ts
├── common/         Shared pieces (Logo, ScrollToTop)
├── components/     UI components (header, footer, home, theme toggle)
│   └── home/       Hero, dropzone, asset table, column details, content sections
├── constants/      App name and shared constants
├── layouts/        Page layouts (MasterLayout)
├── pages/          Route pages
├── routes/         Router configuration
├── theme/          Mantine theme and color palette
├── utils/          Spreadsheet parsing (assetParser)
└── App.tsx         App providers
```

## Import aliases

| Alias          | Path              |
| -------------- | ----------------- |
| `@/`           | `src/`            |
| `@components/` | `src/components/` |
| `@assets/`     | `src/assets/`     |
| `@utils/`      | `src/utils/`      |

## Theming

The theme lives in [`src/theme`](src/theme). `primary` (violet) is the main brand color. Users can switch between light and dark mode with the toggle in the header.
