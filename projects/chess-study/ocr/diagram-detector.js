const DEFAULT_OPTIONS = Object.freeze({
  lineThreshold: 180,
  minPageWidthRatio: 0.075,
  maxPageWidthRatio: 0.55,
  squareTolerance: 0.16,
});

function grayAt(imageData, x, y) {
  const offset = (y * imageData.width + x) * 4;
  return (
    (imageData.data[offset] +
      imageData.data[offset + 1] +
      imageData.data[offset + 2]) /
    3
  );
}

function findHorizontalSegments(imageData, options) {
  const minimumLength = Math.max(
    48,
    imageData.width * options.minPageWidthRatio,
  );
  const maximumLength = imageData.width * options.maxPageWidthRatio;
  const segments = [];

  for (let y = 0; y < imageData.height; y += 1) {
    let runStart = -1;
    let lastDark = -1;
    let gap = 0;

    for (let x = 0; x <= imageData.width; x += 1) {
      const dark =
        x < imageData.width &&
        grayAt(imageData, x, y) <= options.lineThreshold;

      if (dark) {
        if (runStart < 0) runStart = x;
        lastDark = x;
        gap = 0;
      } else if (runStart >= 0 && gap < 3 && x < imageData.width) {
        gap += 1;
      } else if (runStart >= 0) {
        const length = lastDark - runStart + 1;
        if (length >= minimumLength && length <= maximumLength) {
          segments.push({ x: runStart, y, width: length });
        }
        runStart = -1;
        lastDark = -1;
        gap = 0;
      }
    }
  }

  return segments;
}

function clusterSegments(segments) {
  const clusters = [];

  for (const segment of segments) {
    const match = clusters.find(
      (cluster) =>
        segment.y - cluster.maxY <= 2 &&
        Math.abs(segment.x - cluster.x) <= 3 &&
        Math.abs(segment.width - cluster.width) <= 6,
    );

    if (match) {
      match.items.push(segment);
      match.maxY = segment.y;
      match.x =
        match.items.reduce((total, item) => total + item.x, 0) /
        match.items.length;
      match.width =
        match.items.reduce((total, item) => total + item.width, 0) /
        match.items.length;
    } else {
      clusters.push({
        items: [segment],
        minY: segment.y,
        maxY: segment.y,
        x: segment.x,
        width: segment.width,
      });
    }
  }

  return clusters.map((cluster) => ({
    x: cluster.x,
    y: (cluster.minY + cluster.maxY) / 2,
    width: cluster.width,
    thickness: cluster.maxY - cluster.minY + 1,
  }));
}

function verticalBorderDensity(imageData, x, startY, endY, threshold) {
  let dark = 0;
  let samples = 0;

  for (let y = Math.max(0, startY); y <= Math.min(endY, imageData.height - 1); y += 1) {
    let darkest = 255;
    for (let offset = -2; offset <= 2; offset += 1) {
      const sampleX = Math.round(x + offset);
      if (sampleX < 0 || sampleX >= imageData.width) continue;
      darkest = Math.min(darkest, grayAt(imageData, sampleX, y));
    }
    samples += 1;
    if (darkest <= threshold) dark += 1;
  }

  return samples ? dark / samples : 0;
}

function checkerContrast(imageData, box) {
  const means = [[], []];
  const cellWidth = box.width / 8;
  const cellHeight = box.height / 8;

  for (let rank = 0; rank < 8; rank += 1) {
    for (let file = 0; file < 8; file += 1) {
      const startX = Math.max(
        0,
        Math.floor(box.x + (file + 0.2) * cellWidth),
      );
      const endX = Math.min(
        imageData.width,
        Math.ceil(box.x + (file + 0.8) * cellWidth),
      );
      const startY = Math.max(
        0,
        Math.floor(box.y + (rank + 0.2) * cellHeight),
      );
      const endY = Math.min(
        imageData.height,
        Math.ceil(box.y + (rank + 0.8) * cellHeight),
      );
      let total = 0;
      let pixels = 0;

      for (let y = startY; y < endY; y += 1) {
        for (let x = startX; x < endX; x += 1) {
          total += grayAt(imageData, x, y);
          pixels += 1;
        }
      }
      if (pixels) means[(rank + file) % 2].push(total / pixels);
    }
  }

  const average = (values) =>
    values.reduce((total, value) => total + value, 0) / values.length;
  return Math.abs(average(means[0]) - average(means[1]));
}

function intersectionOverUnion(left, right) {
  const x1 = Math.max(left.x, right.x);
  const y1 = Math.max(left.y, right.y);
  const x2 = Math.min(left.x + left.width, right.x + right.width);
  const y2 = Math.min(left.y + left.height, right.y + right.height);
  const intersection =
    Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  const union =
    left.width * left.height + right.width * right.height - intersection;
  return union ? intersection / union : 0;
}

function deduplicate(candidates) {
  const selected = [];

  for (const candidate of [...candidates].sort((a, b) => b.score - a.score)) {
    if (
      selected.some(
        (existing) => intersectionOverUnion(existing, candidate) >= 0.65,
      )
    ) {
      continue;
    }
    selected.push(candidate);
  }

  return selected.sort((left, right) => {
    if (Math.abs(left.y - right.y) > Math.min(left.height, right.height) * 0.25) {
      return left.y - right.y;
    }
    return left.x - right.x;
  });
}

export function detectChessDiagrams(imageData, providedOptions = {}) {
  const options = { ...DEFAULT_OPTIONS, ...providedOptions };
  const lines = findDiagramBorderLines(imageData, options);
  const candidates = [];

  for (let topIndex = 0; topIndex < lines.length; topIndex += 1) {
    const top = lines[topIndex];
    for (
      let bottomIndex = topIndex + 1;
      bottomIndex < lines.length;
      bottomIndex += 1
    ) {
      const bottom = lines[bottomIndex];
      const height = bottom.y - top.y;
      if (height < 48) continue;

      const width = (top.width + bottom.width) / 2;
      if (height > top.width * (1 + options.squareTolerance)) break;
      if (height < width * (1 - options.squareTolerance)) continue;
      if (Math.abs(top.x - bottom.x) > Math.max(5, width * 0.04)) continue;
      if (Math.abs(top.width - bottom.width) > width * 0.08) continue;

      const x = (top.x + bottom.x) / 2;
      const rightX = x + width - 1;
      const leftDensity = verticalBorderDensity(
        imageData,
        x,
        Math.round(top.y),
        Math.round(bottom.y),
        options.lineThreshold + 30,
      );
      const rightDensity = verticalBorderDensity(
        imageData,
        rightX,
        Math.round(top.y),
        Math.round(bottom.y),
        options.lineThreshold + 30,
      );
      if (leftDensity < 0.58 || rightDensity < 0.58) continue;

      const box = {
        x: Math.round(x),
        y: Math.round(top.y),
        width: Math.round(width),
        height: Math.round(height),
      };
      const contrast = checkerContrast(imageData, box);
      if (contrast < 8) continue;

      candidates.push({
        ...box,
        score:
          contrast / 40 +
          (leftDensity + rightDensity) / 2 -
          Math.abs(width - height) / width,
        contrast,
      });
    }
  }

  return deduplicate(candidates);
}

export function findDiagramBorderLines(imageData, providedOptions = {}) {
  const options = { ...DEFAULT_OPTIONS, ...providedOptions };
  return clusterSegments(findHorizontalSegments(imageData, options));
}
