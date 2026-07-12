import { removeBackground } from "@imgly/background-removal";
import { getLanguage } from "/js/i18n.js";

/**
 * Client-side neural background removal powered by IMG.LY's IS-Net model.
 * The selected image stays in the browser. Runtime and model assets are
 * downloaded on first use and then reused from the browser cache.
 */

const STATUS_LABELS = {
  en: {
    waiting: "Waiting for an image",
    selected: "Image ready to process",
    processing: "Removing background locally...",
    loading: (percent) => `Loading AI model... ${percent}%`,
    fallback: "GPU unavailable. Continuing on CPU...",
    ready: "Background removed locally",
    error: "Unable to process this image",
  },
  pt: {
    waiting: "Aguardando uma imagem",
    selected: "Imagem pronta para processar",
    processing: "Removendo o fundo localmente...",
    loading: (percent) => `Carregando modelo de IA... ${percent}%`,
    fallback: "GPU indisponível. Continuando na CPU...",
    ready: "Fundo removido localmente",
    error: "Não foi possível processar esta imagem",
  },
};

function getLabels() {
  return STATUS_LABELS[getLanguage() === "pt" ? "pt" : "en"];
}

function formatFileSize(size) {
  if (!Number.isFinite(size) || size <= 0) return "—";
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function findImageFile(fileList) {
  return Array.from(fileList || []).find(
    (file) => file?.type?.startsWith("image/"),
  ) || null;
}

function initBackgroundRemover() {
  const input = document.getElementById("image-upload");
  const dropzone = document.getElementById("upload-dropzone");
  const preview = document.getElementById("upload-preview");
  const previewWrap = document.getElementById("upload-preview-wrap");
  const emptyState = document.getElementById("upload-empty-state");
  const fileName = document.getElementById("upload-file-name");
  const fileSize = document.getElementById("upload-file-size");
  const error = document.getElementById("upload-error");
  const resultStatus = document.getElementById("result-status");
  const resultPreview = document.getElementById("result-preview");
  const resultEmptyState = document.getElementById("result-empty-state");
  const resultProcessing = document.getElementById("result-processing");
  const processButton = document.getElementById("process-button");
  const downloadButton = document.getElementById("download-button");

  if (
    !input || !dropzone || !preview || !previewWrap || !emptyState ||
    !fileName || !fileSize || !error || !resultStatus || !resultPreview ||
    !resultEmptyState || !resultProcessing || !processButton || !downloadButton
  ) {
    return;
  }

  let sourcePreviewUrl = "";
  let resultObjectUrl = "";
  let currentFile = null;
  let currentState = "waiting";
  let currentJobId = 0;
  let dragDepth = 0;

  function revokeUrl(url) {
    if (url) URL.revokeObjectURL(url);
  }

  function setSourceUrl(url) {
    revokeUrl(sourcePreviewUrl);
    sourcePreviewUrl = url;
    preview.src = url;
  }

  function setResultUrl(url) {
    revokeUrl(resultObjectUrl);
    resultObjectUrl = url;
    resultPreview.src = url;
  }

  function setState(nextState, statusOverride = "") {
    currentState = nextState;
    const labels = getLabels();
    resultStatus.textContent = statusOverride || labels[nextState] || labels.waiting;
    resultProcessing.hidden = nextState !== "processing";
    resultEmptyState.hidden = nextState === "processing" || nextState === "ready";
    resultPreview.hidden = nextState !== "ready";
    processButton.disabled = !currentFile || nextState === "processing";
    downloadButton.disabled = nextState !== "ready" || !resultObjectUrl;
    processButton.setAttribute("aria-disabled", String(processButton.disabled));
    downloadButton.setAttribute("aria-disabled", String(downloadButton.disabled));
  }

  function clearResult() {
    revokeUrl(resultObjectUrl);
    resultObjectUrl = "";
    resultPreview.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    resultPreview.alt = "";
    downloadButton.dataset.downloadName = "";
  }

  function handleSelection(file) {
    if (!file?.type?.startsWith("image/")) {
      error.hidden = false;
      error.textContent = getLanguage() === "pt"
        ? "Escolha um arquivo de imagem válido."
        : "Choose a valid image file.";
      return;
    }

    currentJobId += 1;
    currentFile = file;
    error.hidden = true;
    clearResult();
    setSourceUrl(URL.createObjectURL(file));
    preview.alt = file.name;
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    emptyState.hidden = true;
    previewWrap.hidden = false;
    dropzone.classList.add("has-image");
    setState("selected");
  }

  function createProgressHandler(jobId) {
    return (_key, current, total) => {
      if (jobId !== currentJobId || currentState !== "processing" || total <= 0) return;
      const percent = Math.min(100, Math.max(0, Math.round((current / total) * 100)));
      resultStatus.textContent = getLabels().loading(percent);
    };
  }

  async function runEngine(file, jobId, device) {
    return removeBackground(file, {
      device,
      model: "isnet_fp16",
      output: { format: "image/png", quality: 1 },
      progress: createProgressHandler(jobId),
    });
  }

  async function startProcessing() {
    if (!currentFile || currentState === "processing") return;

    currentJobId += 1;
    const jobId = currentJobId;
    const file = currentFile;
    clearResult();
    setState("processing");

    try {
      let blob;
      const canUseGpu = "gpu" in navigator;

      try {
        blob = await runEngine(file, jobId, canUseGpu ? "gpu" : "cpu");
      } catch (gpuError) {
        if (!canUseGpu || jobId !== currentJobId) throw gpuError;
        setState("processing", getLabels().fallback);
        blob = await runEngine(file, jobId, "cpu");
      }

      if (jobId !== currentJobId) return;
      if (!blob) throw new Error("The background-removal engine returned no image.");

      const outputUrl = URL.createObjectURL(blob);
      setResultUrl(outputUrl);
      resultPreview.alt = `${file.name} — background removed`;
      downloadButton.dataset.downloadName = `${file.name.replace(/\.[^.]+$/, "") || "image"}-removed.png`;
      setState("ready");
    } catch (processingError) {
      if (jobId !== currentJobId) return;
      console.error(processingError);
      setState("error");
    }
  }

  function handleFileList(fileList) {
    const file = findImageFile(fileList);
    if (file) handleSelection(file);
    else handleSelection(null);
  }

  input.addEventListener("change", () => handleFileList(input.files));

  ["dragenter", "dragover"].forEach((eventName) => {
    dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (eventName === "dragenter") dragDepth += 1;
      dropzone.classList.add("is-dragging");
    });
  });

  dropzone.addEventListener("dragleave", (event) => {
    event.preventDefault();
    event.stopPropagation();
    dragDepth = Math.max(0, dragDepth - 1);
    if (dragDepth === 0) dropzone.classList.remove("is-dragging");
  });

  dropzone.addEventListener("drop", (event) => {
    event.preventDefault();
    event.stopPropagation();
    dragDepth = 0;
    dropzone.classList.remove("is-dragging");
    handleFileList(event.dataTransfer.files);
  });

  processButton.addEventListener("click", startProcessing);

  downloadButton.addEventListener("click", () => {
    if (!resultObjectUrl) return;
    const link = document.createElement("a");
    link.href = resultObjectUrl;
    link.download = downloadButton.dataset.downloadName || "background-removed.png";
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
  });

  document.addEventListener("languageChange", () => setState(currentState));

  window.addEventListener("pagehide", () => {
    currentJobId += 1;
    revokeUrl(sourcePreviewUrl);
    revokeUrl(resultObjectUrl);
  });

  setState("waiting");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initBackgroundRemover);
} else {
  initBackgroundRemover();
}
