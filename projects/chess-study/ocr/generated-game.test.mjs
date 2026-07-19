import test from "node:test";
import assert from "node:assert/strict";
import { Pgn } from "../vendor/cm-pgn/src/Pgn.js";
import { appendPgnRecord, buildOcrPositionPgn } from "./generated-game.js";

test("builds a setup-position PGN for a recognized PDF diagram", () => {
  const fen = "8/8/3k4/8/3K4/8/8/8 w - - 0 1";
  const pgn = buildOcrPositionPgn(fen, {
    pageNumber: 21,
    diagramNumber: 2,
  });

  assert.match(pgn, /\[SetUp "1"\]/);
  assert.match(pgn, new RegExp(`\\[FEN "${fen}"\\]`));
  assert.match(pgn, /\[Black "Page 21"\]/);
  assert.match(pgn, /\[Source "PDF page 21, diagram 2"\]/);
  assert.match(pgn, /\*$/);

  const parsed = new Pgn(pgn, { sloppy: true });
  assert.equal(parsed.history.props.setUpFen, fen);
  assert.equal(parsed.history.moves.length, 0);
});

test("appends a generated game after existing PGN content", () => {
  assert.equal(appendPgnRecord("first", "second"), "first\n\nsecond");
  assert.equal(appendPgnRecord("", "second"), "second");
});
