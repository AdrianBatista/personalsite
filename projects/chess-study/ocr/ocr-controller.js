import { detectChessDiagrams } from "./diagram-detector.js";
import { createFullPositionRecognizer } from "./full-position-recognizer.js";

const MAX_ANALYSIS_EDGE = 1600;

function nextTask() {
  return new Promise((resolve) => window.setTimeout(resolve, 0));
}

export function createOcrController(options) {
  let revision = 0;
  let pageAnalysis = null;
  const positionRecognizer = createFullPositionRecognizer({
    modelUrl: options.modelUrl,
    wasmPaths: options.wasmPaths,
  });

  const clear = () => {
    revision += 1;
    pageAnalysis = null;
    options.onDetections([]);
    options.onStatus("idle");
  };

  const analyzeCurrentPage = async (force = false) => {
    const pdfDocument = options.getPdfDocument();
    if (!pdfDocument) {
      clear();
      options.onStatus("needs-pdf");
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
    if (!detection) return;

    const currentRevision = revision;
    detection.status = "analyzing";
    options.onDetections(pageAnalysis.detections);
    options.onStatus("recognizing");

    try {
      await nextTask();
      const recognized = await positionRecognizer.recognize(
        pageAnalysis.imageData,
        detection.pixelBox,
      );
      if (currentRevision !== revision) return;
      if (!recognized || !recognized.reliable) {
        throw new Error("The full chess position could not be read reliably.");
      }

      const correspondingByGame = new Map();
      for (const candidate of positionIndex || []) {
        if (
          candidate.placementKey === recognized.placement &&
          !correspondingByGame.has(candidate.gameIndex)
        ) {
          correspondingByGame.set(candidate.gameIndex, {
            ...candidate,
            orientation: recognized.orientation,
            mismatches: 0,
          });
        }
      }
      const result = {
        ...recognized,
        confidence: "high",
        correspondingCandidates: [...correspondingByGame.values()],
      };

      detection.result = result;
      const outcome = await options.onResult(result, detection);
      if (currentRevision !== revision) return;
      detection.status = outcome?.status || "matched";
      options.onDetections(pageAnalysis.detections);
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
    warmUp: positionRecognizer.warmUp,
    refreshOverlays() {
      options.onDetections(pageAnalysis?.detections || []);
    },
  };
}
