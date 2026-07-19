import { Chess } from "./vendor/chess-mjs/src/Chess.js";

const MATE_SCORE = 100000;
const PIECE_VALUES = Object.freeze({ p: 1, n: 3, b: 3, r: 5, q: 9, k: 100 });

export const MOVE_QUALITIES = Object.freeze({
  brilliant: { symbol: "!!", className: "brilliant" },
  great: { symbol: "!", className: "great" },
  best: { symbol: "★", className: "best" },
  excellent: { symbol: "✓", className: "excellent" },
  good: { symbol: "●", className: "good" },
  inaccuracy: { symbol: "?!", className: "inaccuracy" },
  mistake: { symbol: "?", className: "mistake" },
  missedWin: { symbol: "×", className: "missed-win" },
  blunder: { symbol: "??", className: "blunder" },
});

export function evaluationToCentipawns(evaluation) {
  if (!evaluation) return 0;
  if (evaluation.type === "mate") {
    return Math.sign(evaluation.value || 1) *
      (MATE_SCORE - Math.min(999, Math.abs(evaluation.value)));
  }
  return evaluation.value;
}

function uciForMove(move) {
  return `${move.from || ""}${move.to || ""}${move.promotion || ""}`.toLowerCase();
}

export function isMaterialSacrifice(move, afterLines) {
  if (!move?.fen || !move.to || !move.piece || move.promotion) return false;
  const offeredValue = PIECE_VALUES[move.piece] || 0;
  const capturedValue = PIECE_VALUES[move.captured] || 0;
  if (
    offeredValue < PIECE_VALUES.n ||
    offeredValue - capturedValue < 2 ||
    move.piece === "k"
  ) {
    return false;
  }

  try {
    const replies = new Chess(move.fen).moves({ verbose: true });
    const bestReplyUci = afterLines?.[0]?.pv?.[0]?.toLowerCase();
    return replies.some(
      (reply) =>
        `${reply.from}${reply.to}${reply.promotion || ""}` === bestReplyUci &&
        reply.to === move.to &&
        Boolean(reply.captured),
    );
  } catch {
    return false;
  }
}

export function classifyMove({
  move,
  beforeLines,
  afterEvaluation,
  afterLines,
}) {
  const beforeEvaluation = beforeLines?.[0]?.evaluation;
  if (!move || !beforeEvaluation || !afterEvaluation) return null;

  const before = evaluationToCentipawns(beforeEvaluation);
  const after = evaluationToCentipawns(afterEvaluation);
  const whiteMoved = move.ply % 2 === 1;
  const loss = Math.max(0, whiteMoved ? before - after : after - before);
  const moverBefore = whiteMoved ? before : -before;
  const moverAfter = whiteMoved ? after : -after;
  const bestUci = beforeLines[0]?.pv?.[0]?.toLowerCase();
  const playedBest = Boolean(bestUci && bestUci === uciForMove(move));
  const second = beforeLines?.[1]?.evaluation
    ? evaluationToCentipawns(beforeLines[1].evaluation)
    : before;
  const bestGap = Math.max(0, whiteMoved ? before - second : second - before);

  let key;
  if (moverBefore >= 250 && moverAfter < 80 && loss > 120) {
    key = "missedWin";
  } else if (loss > 250) {
    key = "blunder";
  } else if (loss > 120) {
    key = "mistake";
  } else if (loss > 60) {
    key = "inaccuracy";
  } else if (
    playedBest &&
    loss <= 25 &&
    moverAfter >= -150 &&
    isMaterialSacrifice(move, afterLines)
  ) {
    key = "brilliant";
  } else if (playedBest && bestGap >= 100) {
    key = "great";
  } else if (loss <= 10) {
    key = "best";
  } else if (loss <= 25) {
    key = "excellent";
  } else {
    key = "good";
  }

  return { key, loss: Math.round(loss), ...MOVE_QUALITIES[key] };
}
