import test from "node:test";
import assert from "node:assert/strict";
import {
  evaluationToWhiteShare,
  formatEvaluation,
  normalizeEvaluationForWhite,
  parseEngineInfo,
  uciVariationToSan,
} from "./engine-analysis.js";

const START_FEN =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

test("parses Stockfish MultiPV output", () => {
  const info = parseEngineInfo(
    "info depth 16 seldepth 22 multipv 2 score cp 31 nodes 12345 nps 456789 pv e2e4 e7e5 g1f3",
  );
  assert.deepEqual(info, {
    depth: 16,
    multipv: 2,
    scoreType: "cp",
    scoreValue: 31,
    nodes: 12345,
    nps: 456789,
    pv: ["e2e4", "e7e5", "g1f3"],
  });
});

test("normalizes scores to White's perspective", () => {
  const info = { scoreType: "cp", scoreValue: 45 };
  assert.deepEqual(normalizeEvaluationForWhite(info, START_FEN), {
    type: "cp",
    value: 45,
  });
  assert.deepEqual(
    normalizeEvaluationForWhite(
      info,
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1",
    ),
    { type: "cp", value: -45 },
  );
});

test("formats centipawn and mate evaluations", () => {
  assert.equal(formatEvaluation({ type: "cp", value: 36 }), "+0.36");
  assert.equal(formatEvaluation({ type: "cp", value: -125 }), "−1.25");
  assert.equal(formatEvaluation({ type: "mate", value: 3 }), "+#3");
  assert.equal(formatEvaluation({ type: "mate", value: -2 }), "−#2");
});

test("maps evaluations to a bounded advantage-bar share", () => {
  assert.equal(evaluationToWhiteShare(null), 50);
  assert.equal(evaluationToWhiteShare({ type: "cp", value: 0 }), 50);
  assert.ok(evaluationToWhiteShare({ type: "cp", value: 200 }) > 50);
  assert.ok(evaluationToWhiteShare({ type: "cp", value: -200 }) < 50);
  assert.equal(evaluationToWhiteShare({ type: "mate", value: 3 }), 100);
  assert.equal(evaluationToWhiteShare({ type: "mate", value: -3 }), 0);
});

test("converts a UCI principal variation to SAN", () => {
  assert.equal(
    uciVariationToSan(START_FEN, ["e2e4", "e7e5", "g1f3", "b8c6"]),
    "e4 e5 Nf3 Nc6",
  );
});
