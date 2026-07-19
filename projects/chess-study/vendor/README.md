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

## Fenshot

- Package: `@scoriiu/fenshot`
- Version: `0.1.4`
- Source: <https://github.com/scoriiu/fenshot>
- Registry package: <https://www.npmjs.com/package/@scoriiu/fenshot>
- License: MIT (`fenshot/LICENSE`)
- Included: browser ES modules and the `chess-tiles-v2.onnx` 13-class chess
  tile model.
- Local change: extensionless relative imports and the bare
  `onnxruntime-web/wasm` import point to the sibling vendored browser modules.
  `recognizeAtCorners` exposes classification at board coordinates already
  detected by the PDF pipeline, avoiding a second detection pass.
- Model SHA-256:
  `883F6A8E639E6D6B6399B3FDA0508AD772E3C6F9CEFA2E678A13F27B9FA6248D`.

## ONNX Runtime Web

- Package: `onnxruntime-web`
- Version: `1.27.0`
- Source: <https://github.com/microsoft/onnxruntime>
- Registry package: <https://www.npmjs.com/package/onnxruntime-web>
- License: MIT (`onnxruntime-web/LICENSE`)
- Included: the pure-WASM ES module loader and SIMD-threaded WASM runtime used
  by Fenshot. WebGPU/WebGL builds, source maps, and Node.js files are omitted.
- WASM SHA-256:
  `D1AB1B94B16A65B29D710D0B587B29E7BED336827577623913479B8AFE8113E6`.

## Updating

Review release notes and licenses first. Download exact package archives with
`npm pack`, replace only the listed files, reapply the documented `cm-pgn`
and Fenshot relative-import changes, verify the recorded model/runtime hashes,
and test representative PDF and annotated PGN files.
