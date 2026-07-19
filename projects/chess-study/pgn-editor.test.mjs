import test from "node:test";
import assert from "node:assert/strict";
import { Pgn } from "./vendor/cm-pgn/src/Pgn.js";
import {
  addMoveToGame,
  isPromotionMove,
  replacePgnRecord,
  validateMoveFromFen,
} from "./pgn-editor.js";
import { splitPgnRecords } from "./pgn-records.js";

function makeGame(pgnText) {
  const pgn = new Pgn(pgnText, { sloppy: true });
  return { pgn, moves: pgn.history.moves };
}

test("adds a legal move and renders it into the PGN", () => {
  const game = makeGame('[Result "*"]\n\n*');
  const legalMove = validateMoveFromFen(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    { from: "e2", to: "e4" },
  );
  assert.ok(legalMove);

  const result = addMoveToGame(game, { from: "e2", to: "e4" });
  assert.equal(result.changed, true);
  assert.equal(result.move.san, "e4");
  assert.match(game.pgn.render(), /1\. e4 \*/);
});

test("creates a variation from an earlier position", () => {
  const game = makeGame('[Result "*"]\n\n1. e4 e5 2. Nf3 *');
  const firstMove = game.moves[0];
  const result = addMoveToGame(
    game,
    { from: "c7", to: "c5" },
    firstMove,
  );

  assert.equal(result.isVariation, true);
  assert.match(game.pgn.render(), /e5 \(1\.\.\. c5\)/);
});

test("reuses an existing continuation instead of duplicating it", () => {
  const game = makeGame('[Result "*"]\n\n1. e4 e5 *');
  const result = addMoveToGame(
    game,
    { from: "e7", to: "e5" },
    game.moves[0],
  );

  assert.equal(result.changed, false);
  assert.equal(result.move, game.moves[0].next);
  assert.equal((game.pgn.render().match(/e5/g) || []).length, 1);
});

test("updates only the selected record in a PGN database", () => {
  const database = '[Event "One"]\n\n1. e4 *\n\n[Event "Two"]\n\n1. d4 *';
  const updated = replacePgnRecord(
    database,
    1,
    '[Event "Two"]\n\n1. c4 *',
  );
  const records = splitPgnRecords(updated);

  assert.match(records[0], /1\. e4/);
  assert.match(records[1], /1\. c4/);
});

test("detects white and black pawn promotions", () => {
  assert.equal(isPromotionMove("wp", "a8"), true);
  assert.equal(isPromotionMove("bp", "h1"), true);
  assert.equal(isPromotionMove("wp", "a7"), false);
  assert.equal(isPromotionMove("wq", "a8"), false);
});
