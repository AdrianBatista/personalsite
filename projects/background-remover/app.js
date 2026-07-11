import { getLanguage } from "/js/i18n.js";

/**
 * Handles local image selection and drag-and-drop feedback only.
 * Background removal and file download are intentionally not implemented.
 */

const STATUS_LABELS = {
  en: {
    waiting: "Waiting for an image",
    pending: "Image selected. Converter pending.",
  },
  pt: {
    waiting: "Aguardando uma imagem",
    pending: "Imagem selecionada. Conversor pendente.",
  },
};

function formatFileSize(size) {
  if (!Number.isFinite(size) || size <= 0) return "—";
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function getStatusLabel(key) {
  const lang = getLanguage() === "pt" ? "pt" : "en";
  return STATUS_LABELS[lang][key];
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

  if (!input || !dropzone || !preview || !previewWrap || !emptyState || !fileName || !fileSize || !error || !resultStatus) return;

  let previewUrl = "";
  let dragDepth = 0;
  let hasSelectedImage = false;

  function clearPreviewUrl() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      previewUrl = "";
    }
  }

  function showImage(file) {
    if (!file) return;

    if (!file || !file.type.startsWith("image/")) {
      error.hidden = false;
      return;
    }

    error.hidden = true;
    clearPreviewUrl();
    previewUrl = URL.createObjectURL(file);
    preview.src = previewUrl;
    preview.alt = file.name;
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    hasSelectedImage = true;
    resultStatus.textContent = getStatusLabel("pending");
    emptyState.hidden = true;
    previewWrap.hidden = false;
    dropzone.classList.add("has-image");
  }

  input.addEventListener("change", () => showImage(input.files[0]));

  ["dragenter", "dragover"].forEach((eventName) => {
    dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      if (eventName === "dragenter") dragDepth += 1;
      dropzone.classList.add("is-dragging");
    });
  });

  dropzone.addEventListener("dragleave", (event) => {
    event.preventDefault();
    dragDepth = Math.max(0, dragDepth - 1);
    if (dragDepth === 0) dropzone.classList.remove("is-dragging");
  });

  dropzone.addEventListener("drop", (event) => {
    event.preventDefault();
    dragDepth = 0;
    dropzone.classList.remove("is-dragging");

    const [file] = event.dataTransfer.files;
    showImage(file);
  });

  const langToggle = document.getElementById("lang-toggle");
  if (langToggle) {
    langToggle.addEventListener("click", () => {
      resultStatus.textContent = getStatusLabel(hasSelectedImage ? "pending" : "waiting");
    });
  }

  window.addEventListener("pagehide", clearPreviewUrl, { once: true });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initBackgroundRemover);
} else {
  initBackgroundRemover();
}
