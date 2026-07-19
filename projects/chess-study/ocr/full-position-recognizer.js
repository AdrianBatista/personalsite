import {
  createRecognizer,
  placementToFen,
  resolveOrientation,
} from "../vendor/fenshot/index.js";

function imageDataCanvas(imageData) {
  const canvas = document.createElement("canvas");
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  canvas.getContext("2d").putImageData(imageData, 0, 0);
  return canvas;
}

export function createFullPositionRecognizer(options) {
  const recognizer = createRecognizer(options);

  return {
    warmUp: recognizer.warmUp,
    async recognize(imageData, box) {
      const scan = await recognizer.recognizeAtCorners(
        imageDataCanvas(imageData),
        {
          x0: box.x,
          y0: box.y,
          x1: box.x + box.width,
          y1: box.y + box.height,
        },
      );
      if (!scan) return null;

      const resolved = resolveOrientation(scan.placement);
      return {
        ...scan,
        placement: resolved.placement,
        orientation: resolved.orientation,
        fen: placementToFen(resolved.placement, "w"),
      };
    },
  };
}
