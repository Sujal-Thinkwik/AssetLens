# AssetLens

A web app for importing asset spreadsheets. Upload an `.xlsx`, `.xls` or `.csv` file and the app extracts asset type, manufacturer, model, serial number, CPU, RAM, storage and screen size, even when headers, column order or structure differ between files. Every other column is kept and shown alongside.

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
| `npm run build`   | Type-check and build to `build/`     |
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

## Project structure

```
src/
├── assets/         Styles and images, with a central index.ts
├── common/         Shared pieces (Logo, ScrollToTop)
├── components/     UI components (header, footer, home, theme toggle)
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
