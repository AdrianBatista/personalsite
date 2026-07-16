# Vendored browser dependencies

These files are committed because this repository is a static site without a
package manager or build step. The application imports the browser modules
directly and does not fetch executable code from a runtime CDN.

## PDF.js

- Package: `pdfjs-dist`
- Version: `6.1.200`
- Source: <https://github.com/mozilla/pdf.js>
- Registry package: <https://www.npmjs.com/package/pdfjs-dist>
- License: Apache-2.0 (`pdfjs/LICENSE`)
- Included: minified display/worker modules, CMaps, standard fonts, and WASM
  decoders required by the display API.
- Omitted: optional no-WebAssembly JavaScript decoder fallbacks and the
  scripting evaluator. The application targets modern browsers with
  WebAssembly support and disables PDF JavaScript evaluation.

## cm-pgn

- Package: `cm-pgn`
- Version: `4.1.2`
- Source: <https://github.com/shaack/cm-pgn>
- Registry package: <https://www.npmjs.com/package/cm-pgn>
- License: MIT (`cm-pgn/LICENSE`)
- Local change: the bare `chess.mjs` import in `src/History.js` points to the
  sibling vendored copy so the module works without an import map or bundler.

## chess.mjs

- Package: `chess.mjs`
- Version: `2.3.2`
- Source: <https://github.com/shaack/chess.mjs>
- Registry package: <https://www.npmjs.com/package/chess.mjs>
- License: BSD-2-Clause (`chess-mjs/LICENSE`)

## cm-chessboard

- Package: `cm-chessboard`
- Version: `8.12.12`
- Source: <https://github.com/shaack/cm-chessboard>
- Registry package: <https://www.npmjs.com/package/cm-chessboard>
- License: MIT (`cm-chessboard/LICENSE`)
- Included: ES modules, board stylesheet, standard piece sprite, marker
  stylesheet, and marker sprite.

## Updating

Review release notes and licenses first. Download exact package archives with
`npm pack`, replace only the listed files, reapply the documented `cm-pgn`
relative-import change, and test representative PDF and annotated PGN files.
