const STANDARD_START_FEN =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export function fenToColorSquares(fen) {
  const placement = fenToPlacementKey(fen);
  const squares = [];

  for (const character of placement.replaceAll("/", "")) {
    if (/^[1-8]$/.test(character)) {
      squares.push(...Array(Number(character)).fill("empty"));
    } else if (/^[prnbqkPRNBQK]$/.test(character)) {
      squares.push(
        character === character.toUpperCase() ? "white" : "black",
      );
    }
  }

  if (squares.length !== 64) {
    throw new Error(`Invalid FEN placement: ${fen}`);
  }
  return squares;
}

export function fenToPlacementKey(fen) {
  return String(fen || "").trim().split(/\s+/)[0];
}

export function rotateColorSquares(squares) {
  return [...squares].reverse();
}

function createCandidate(game, gameIndex, move = null) {
  const fen = move?.fen || game.startFen || STANDARD_START_FEN;
  return {
    gameIndex,
    gameId: game.id,
    moveId: move?.studyId || null,
    ply: move?.ply || 0,
    san: move?.san || null,
    fen,
    placementKey: fenToPlacementKey(fen),
    colorSquares: fenToColorSquares(fen),
    isStart: !move,
    isCustomStart: !move && fen !== STANDARD_START_FEN,
    headers: game.headers,
  };
}

function appendMoveCandidates(moves, game, gameIndex, candidates) {
  for (const move of moves || []) {
    if (move.fen) candidates.push(createCandidate(game, gameIndex, move));
    for (const variation of move.variations || []) {
      appendMoveCandidates(variation, game, gameIndex, candidates);
    }
  }
}

export function buildPositionIndex(games) {
  const candidates = [];

  games.forEach((game, gameIndex) => {
    candidates.push(createCandidate(game, gameIndex));
    appendMoveCandidates(game.moves, game, gameIndex, candidates);
  });

  return candidates;
}
