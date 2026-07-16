import test from "node:test";
import assert from "node:assert/strict";
import {
  buildPositionIndex,
  fenToColorSquares,
} from "./position-index.js";
import { resolvePositionMatch } from "./position-matcher.js";

function observationsFromFen(fen, confidence = 0.98) {
  return fenToColorSquares(fen).map((predicted) => {
    const remainder = (1 - confidence) / 2;
    return {
      predicted,
      confidence,
      probabilities: {
        empty: predicted === "empty" ? confidence : remainder,
        white: predicted === "white" ? confidence : remainder,
        black: predicted === "black" ? confidence : remainder,
      },
    };
  });
}

const targetFen =
  "4rr1k/ppqn2pb/2pbp3/3n1p2/2BP4/P1N1B2P/1PPQ1PN1/R3R2K w - - 0 22";

test("converts a FEN placement into 64 color categories", () => {
  const squares = fenToColorSquares(targetFen);
  assert.equal(squares.length, 64);
  assert.equal(squares[4], "black");
  assert.equal(squares[34], "white");
  assert.equal(squares[0], "empty");
});

test("indexes starts, main lines, and variations", () => {
  const games = [
    {
      id: "game-0",
      headers: {},
      startFen: targetFen,
      moves: [
        {
          studyId: "g0-m0",
          ply: 1,
          san: "e4",
          fen: "8/8/8/8/4P3/8/8/8 b - - 0 1",
          variations: [
            [
              {
                studyId: "g0-m0-v0-0",
                ply: 1,
                san: "d4",
                fen: "8/8/8/8/3P4/8/8/8 b - - 0 1",
              },
            ],
          ],
        },
      ],
    },
  ];

  const index = buildPositionIndex(games);
  assert.deepEqual(
    index.map((candidate) => candidate.moveId),
    [null, "g0-m0", "g0-m0-v0-0"],
  );
});

test("prefers a curated custom starting position over a duplicate move", () => {
  const games = [
    {
      id: "study-position",
      headers: {},
      startFen: targetFen,
      moves: [],
    },
    {
      id: "full-game",
      headers: {},
      startFen:
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      moves: [
        {
          studyId: "g1-m42",
          ply: 42,
          san: "f5",
          fen: targetFen,
        },
      ],
    },
  ];

  const result = resolvePositionMatch(
    observationsFromFen(targetFen),
    buildPositionIndex(games),
  );

  assert.equal(result.confidence, "high");
  assert.equal(result.best.gameId, "study-position");
  assert.equal(result.best.moveId, null);
  assert.deepEqual(
    result.correspondingCandidates.map((candidate) => candidate.gameId),
    ["study-position", "full-game"],
  );
});
