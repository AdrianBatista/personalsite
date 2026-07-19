import { Chess } from "./vendor/chess-mjs/src/Chess.js";
import { splitPgnRecords } from "./pgn-records.js";

function moveKey(move) {
  if (!move) return "";
  return `${move.from}${move.to}${move.promotion || ""}`;
}

function firstMovesFrom(game, previous) {
  const mainMove = previous ? previous.next : game.moves[0];
  if (!mainMove) return [];
  return [
    mainMove,
    ...(mainMove.variations || [])
      .map((variation) => variation[0])
      .filter(Boolean),
  ];
}

export function isPromotionMove(piece, squareTo) {
  return Boolean(
    piece &&
      piece[1] === "p" &&
      ((piece[0] === "w" && squareTo?.[1] === "8") ||
        (piece[0] === "b" && squareTo?.[1] === "1")),
  );
}

export function validateMoveFromFen(fen, notation, chess960 = false) {
  try {
    const chess = new Chess(fen, { chess960: Boolean(chess960) });
    return chess.move(notation, { sloppy: true });
  } catch {
    return null;
  }
}

export function addMoveToGame(game, notation, previous = null) {
  const existingMove = firstMovesFrom(game, previous).find(
    (move) => moveKey(move) === moveKey(notation),
  );
  if (existingMove) {
    return { move: existingMove, changed: false, isVariation: false };
  }

  const isVariation = Boolean(previous ? previous.next : game.moves[0]);
  const move = game.pgn.history.addMove(
    notation,
    previous || "start",
    true,
  );
  return { move, changed: true, isVariation };
}

export function replacePgnRecord(database, recordIndex, renderedRecord) {
  const records = splitPgnRecords(database);
  if (recordIndex < 0 || recordIndex >= records.length) {
    throw new RangeError("PGN record index is outside the database.");
  }
  records[recordIndex] = renderedRecord.trim();
  return records.join("\n\n");
}
