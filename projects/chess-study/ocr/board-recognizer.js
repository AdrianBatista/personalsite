const CLASS_PROFILES = Object.freeze({
  empty: { mean: 0.004, spread: 0.028 },
  white: { mean: 0.105, spread: 0.075 },
  black: { mean: 0.36, spread: 0.15 },
});

function likelihood(value, profile) {
  const distance = (value - profile.mean) / profile.spread;
  return Math.exp(-0.5 * distance * distance) + 0.000001;
}

function normalizeProbabilities(probabilities) {
  const total =
    probabilities.empty + probabilities.white + probabilities.black;
  return {
    empty: probabilities.empty / total,
    white: probabilities.white / total,
    black: probabilities.black / total,
  };
}

function squareFeature(imageData, box, rank, file) {
  const cellWidth = box.width / 8;
  const cellHeight = box.height / 8;
  const startX = Math.max(
    0,
    Math.floor(box.x + (file + 0.12) * cellWidth),
  );
  const endX = Math.min(
    imageData.width,
    Math.ceil(box.x + (file + 0.88) * cellWidth),
  );
  const startY = Math.max(
    0,
    Math.floor(box.y + (rank + 0.12) * cellHeight),
  );
  const endY = Math.min(
    imageData.height,
    Math.ceil(box.y + (rank + 0.88) * cellHeight),
  );

  let pixels = 0;
  let veryDarkPixels = 0;
  let darkPixels = 0;

  for (let y = startY; y < endY; y += 1) {
    for (let x = startX; x < endX; x += 1) {
      const offset = (y * imageData.width + x) * 4;
      const gray =
        (imageData.data[offset] +
          imageData.data[offset + 1] +
          imageData.data[offset + 2]) /
        3;
      pixels += 1;
      if (gray < 80) veryDarkPixels += 1;
      if (gray < 170) darkPixels += 1;
    }
  }

  return {
    veryDark: pixels ? veryDarkPixels / pixels : 0,
    dark: pixels ? darkPixels / pixels : 0,
  };
}

export function recognizeBoardColors(imageData, box) {
  const observations = [];

  for (let rank = 0; rank < 8; rank += 1) {
    for (let file = 0; file < 8; file += 1) {
      const feature = squareFeature(imageData, box, rank, file);
      const probabilities = normalizeProbabilities({
        empty: likelihood(feature.veryDark, CLASS_PROFILES.empty),
        white: likelihood(feature.veryDark, CLASS_PROFILES.white),
        black: likelihood(feature.veryDark, CLASS_PROFILES.black),
      });
      const predicted = Object.entries(probabilities).sort(
        (left, right) => right[1] - left[1],
      )[0][0];

      observations.push({
        ...feature,
        probabilities,
        predicted,
        confidence: probabilities[predicted],
      });
    }
  }

  return observations;
}

