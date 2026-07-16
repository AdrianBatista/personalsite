import { rotateColorSquares } from "./position-index.js";

function scoreCandidate(observations, colorSquares) {
  let logScore = 0;
  let mismatches = 0;
  let confidence = 0;

  observations.forEach((observation, index) => {
    const expected = colorSquares[index];
    logScore += Math.log(observation.probabilities[expected] || 0.000001);
    confidence += observation.confidence;
    if (observation.predicted !== expected && observation.confidence >= 0.55) {
      mismatches += 1;
    }
  });

  return {
    visualScore: logScore / observations.length,
    mismatches,
    recognitionConfidence: confidence / observations.length,
  };
}

function startPositionBonus(candidate) {
  if (candidate.isCustomStart) return 0.045;
  if (candidate.isStart) return 0.012;
  return 0;
}

export function rankPositionCandidates(observations, positionIndex) {
  const ranked = [];

  for (const candidate of positionIndex) {
    const whiteOrientation = scoreCandidate(
      observations,
      candidate.colorSquares,
    );
    const blackOrientation = scoreCandidate(
      observations,
      rotateColorSquares(candidate.colorSquares),
    );
    const best =
      whiteOrientation.visualScore >= blackOrientation.visualScore
        ? { ...whiteOrientation, orientation: "white" }
        : { ...blackOrientation, orientation: "black" };

    ranked.push({
      ...candidate,
      ...best,
      totalScore: best.visualScore + startPositionBonus(candidate),
    });
  }

  ranked.sort((left, right) => {
    if (right.totalScore !== left.totalScore) {
      return right.totalScore - left.totalScore;
    }
    if (left.mismatches !== right.mismatches) {
      return left.mismatches - right.mismatches;
    }
    return left.gameIndex - right.gameIndex;
  });

  return ranked;
}

export function resolvePositionMatch(observations, positionIndex) {
  const candidates = rankPositionCandidates(observations, positionIndex);
  const best = candidates[0] || null;
  const second = candidates[1] || null;
  const margin = best && second ? best.totalScore - second.totalScore : Infinity;
  const correspondingByGame = new Map();

  if (best) {
    candidates
      .filter((candidate) => candidate.placementKey === best.placementKey)
      .forEach((candidate) => {
        if (!correspondingByGame.has(candidate.gameIndex)) {
          correspondingByGame.set(candidate.gameIndex, candidate);
        }
      });
  }
  const correspondingCandidates = [...correspondingByGame.values()];

  let confidence = "low";
  if (
    best &&
    best.mismatches <= 1 &&
    best.recognitionConfidence >= 0.72 &&
    (margin >= 0.02 || best.isCustomStart)
  ) {
    confidence = "high";
  } else if (
    best &&
    best.mismatches <= 4 &&
    best.recognitionConfidence >= 0.58
  ) {
    confidence = "medium";
  }

  return {
    best,
    candidates: candidates.slice(0, 5),
    correspondingCandidates,
    confidence,
    margin,
  };
}
