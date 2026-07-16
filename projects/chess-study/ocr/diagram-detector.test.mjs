import test from "node:test";
import assert from "node:assert/strict";
import { detectChessDiagrams } from "./diagram-detector.js";

function createSyntheticPage(width = 600, height = 800) {
  const data = new Uint8ClampedArray(width * height * 4).fill(255);
  for (let index = 3; index < data.length; index += 4) data[index] = 255;
  return { data, width, height };
}

function fillRect(image, x, y, width, height, value) {
  for (let row = y; row < y + height; row += 1) {
    for (let column = x; column < x + width; column += 1) {
      const offset = (row * image.width + column) * 4;
      image.data[offset] = value;
      image.data[offset + 1] = value;
      image.data[offset + 2] = value;
    }
  }
}

function drawBoard(image, x, y, size) {
  const cell = size / 8;
  fillRect(image, x, y, size, 2, 0);
  fillRect(image, x, y + size - 2, size, 2, 0);
  fillRect(image, x, y, 2, size, 0);
  fillRect(image, x + size - 2, y, 2, size, 0);

  for (let rank = 0; rank < 8; rank += 1) {
    for (let file = 0; file < 8; file += 1) {
      if ((rank + file) % 2 === 1) {
        fillRect(
          image,
          Math.round(x + file * cell + 2),
          Math.round(y + rank * cell + 2),
          Math.max(1, Math.round(cell - 3)),
          Math.max(1, Math.round(cell - 3)),
          195,
        );
      }
    }
  }
}

test("detects an axis-aligned printed chess diagram", () => {
  const page = createSyntheticPage();
  drawBoard(page, 80, 190, 160);
  const detections = detectChessDiagrams(page);

  assert.equal(detections.length, 1);
  assert.ok(Math.abs(detections[0].x - 80) <= 2);
  assert.ok(Math.abs(detections[0].y - 190) <= 2);
  assert.ok(Math.abs(detections[0].width - 160) <= 3);
});

test("does not treat a single horizontal rule as a board", () => {
  const page = createSyntheticPage();
  fillRect(page, 40, 200, 260, 2, 0);
  assert.deepEqual(detectChessDiagrams(page), []);
});

