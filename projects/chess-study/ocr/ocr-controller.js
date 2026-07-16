import { recognizeBoardColors } from "./board-recognizer.js";
import { detectChessDiagrams } from "./diagram-detector.js";
import { resolvePositionMatch } from "./position-matcher.js";

const MAX_ANALYSIS_EDGE = 1600;

function nextTask() {
  return new Promise((resolve) => window.setTimeout(resolve, 0));
}

export function createOcrController(options) {
  let revision = 0;
  let pageAnalysis = null;

  const clear = () => {
    revision += 1;
    pageAnalysis = null;
    options.onDetections([]);
    options.onStatus("idle");
  };

  const analyzeCurrentPage = async (force = false) => {
    const pdfDocument = options.getPdfDocument();
    const positionIndex = options.getPositionIndex();
    if (!pdfDocument || !positionIndex?.length) {
      clear();
      options.onStatus(!pdfDocument ? "needs-pdf" : "needs-pgn");
      return;
    }

    const pageNumber = options.getPageNumber();
    if (
      !force &&
      pageAnalysis?.pdfDocument === pdfDocument &&
      pageAnalysis.pageNumber === pageNumber
    ) {
      options.onDetections(pageAnalysis.detections);
      options.onStatus(pageAnalysis.detections.length ? "ready" : "none", {
        count: pageAnalysis.detections.length,
      });
      return;
    }

    const currentRevision = ++revision;
    options.onStatus("scanning");
    options.onDetections([]);

    try {
      await nextTask();
      const page = await pdfDocument.getPage(pageNumber);
      if (currentRevision !== revision) return;

      const baseViewport = page.getViewport({ scale: 1 });
      const analysisScale = Math.min(
        2.6,
        MAX_ANALYSIS_EDGE / Math.max(baseViewport.width, baseViewport.height),
      );
      const viewport = page.getViewport({ scale: analysisScale });
      const canvas = document.createElement("canvas");
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const context = canvas.getContext("2d", {
        alpha: false,
        willReadFrequently: true,
      });
      await page.render({
        canvas,
        canvasContext: context,
        viewport,
        background: "#ffffff",
      }).promise;
      if (currentRevision !== revision) return;

      await nextTask();
      const imageData = context.getImageData(
        0,
        0,
        canvas.width,
        canvas.height,
      );
      const detected = detectChessDiagrams(imageData);
      if (currentRevision !== revision) return;

      const detections = detected.map((box, index) => ({
        id: `page-${pageNumber}-diagram-${index + 1}`,
        index,
        pixelBox: box,
        pageBox: {
          x: box.x / analysisScale,
          y: box.y / analysisScale,
          width: box.width / analysisScale,
          height: box.height / analysisScale,
        },
        score: box.score,
        status: "detected",
      }));

      pageAnalysis = {
        pdfDocument,
        pageNumber,
        imageData,
        detections,
      };
      options.onDetections(detections);
      options.onStatus(detections.length ? "ready" : "none", {
        count: detections.length,
      });
    } catch (error) {
      if (currentRevision !== revision) return;
      console.error("Chess diagram analysis failed.", error);
      pageAnalysis = null;
      options.onDetections([]);
      options.onStatus("error");
    }
  };

  const recognizeDetection = async (detectionId) => {
    const positionIndex = options.getPositionIndex();
    const detection = pageAnalysis?.detections.find(
      (candidate) => candidate.id === detectionId,
    );
    if (!detection || !positionIndex?.length) return;

    const currentRevision = revision;
    detection.status = "analyzing";
    options.onDetections(pageAnalysis.detections);
    options.onStatus("recognizing");

    try {
      await nextTask();
      const observations = recognizeBoardColors(
        pageAnalysis.imageData,
        detection.pixelBox,
      );
      const result = resolvePositionMatch(observations, positionIndex);
      if (currentRevision !== revision) return;

      detection.status =
        result.confidence === "high" ? "matched" : "ambiguous";
      detection.result = result;
      options.onDetections(pageAnalysis.detections);
      options.onResult(result, detection, observations);
    } catch (error) {
      if (currentRevision !== revision) return;
      console.error("Chess diagram recognition failed.", error);
      detection.status = "failed";
      options.onDetections(pageAnalysis.detections);
      options.onStatus("recognition-error");
    }
  };

  return {
    analyzeCurrentPage,
    recognizeDetection,
    clear,
    refreshOverlays() {
      options.onDetections(pageAnalysis?.detections || []);
    },
  };
}
