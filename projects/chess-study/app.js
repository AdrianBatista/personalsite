import {
  GlobalWorkerOptions,
  getDocument,
  PasswordResponses,
} from "./vendor/pdfjs/build/pdf.min.mjs";
import { Pgn } from "./vendor/cm-pgn/src/Pgn.js";
import {
  Chessboard,
  COLOR,
  FEN,
  INPUT_EVENT_TYPE,
} from "./vendor/cm-chessboard/src/Chessboard.js";
import {
  MARKER_TYPE,
  Markers,
} from "./vendor/cm-chessboard/src/extensions/markers/Markers.js";
import { Accessibility } from "./vendor/cm-chessboard/src/extensions/accessibility/Accessibility.js";
import {
  PROMOTION_DIALOG_RESULT_TYPE,
  PromotionDialog,
} from "./vendor/cm-chessboard/src/extensions/promotion-dialog/PromotionDialog.js";
import { getLanguage } from "/js/i18n.js";
import {
  clearStoredSession,
  loadStoredSession,
  saveStoredSession,
} from "./storage.js";
import { splitPgnRecords } from "./pgn-records.js";
import {
  addMoveToGame,
  isPromotionMove,
  replacePgnRecord,
  validateMoveFromFen,
} from "./pgn-editor.js";
import { createOcrController } from "./ocr/ocr-controller.js";
import { buildPositionIndex } from "./ocr/position-index.js";
import {
  appendPgnRecord,
  buildFreeAnalysisPgn,
  buildOcrPositionPgn,
} from "./ocr/generated-game.js";
import {
  createEngineController,
  evaluationToWhiteShare,
  formatEvaluation,
} from "./engine-analysis.js";
import { classifyMove } from "./move-classification.js";

const PROJECT_PATH = "/projects/chess-study/";
const PDF_ASSET_PATH = `${PROJECT_PATH}vendor/pdfjs/`;
const BOARD_ASSET_PATH = `${PROJECT_PATH}vendor/cm-chessboard/assets/`;
const OCR_MODEL_PATH = `${PROJECT_PATH}vendor/fenshot/model/chess-tiles-v2.onnx`;
const OCR_WASM_PATH = `${PROJECT_PATH}vendor/onnxruntime-web/`;
const ENGINE_WORKER_PATH = `${PROJECT_PATH}vendor/stockfish/stockfish-18-lite-single.js`;
const MAX_PDF_SIZE = 180 * 1024 * 1024;
const MAX_PGN_SIZE = 30 * 1024 * 1024;
const DEFAULT_PDF_SETTINGS = Object.freeze({
  pageNumber: 1,
  column: "full",
  zoom: 1,
  splitRatio: 0.5,
  innerMargin: 0.01,
  outerMargin: 0.02,
});

GlobalWorkerOptions.workerSrc = `${PDF_ASSET_PATH}build/pdf.worker.min.mjs`;

const TEXT = {
  en: {
    unknown: "Unknown",
    untitled: "Untitled game",
    loadingPgn: "Reading PGN…",
    pgnReady: (count, invalid) =>
      invalid
        ? `${count} games loaded; ${invalid} could not be parsed.`
        : `${count} games loaded.`,
    invalidPgn: "This file does not contain a supported PGN game.",
    pgnTooLarge: "The PGN is too large for this browser workspace.",
    loadingPdf: "Opening PDF…",
    renderingPdf: "Rendering book column…",
    pdfReady: (pages) => `PDF ready · ${pages} pages.`,
    invalidPdf: "Choose a valid PDF file.",
    pdfTooLarge: "The PDF is too large for this browser workspace.",
    pdfPassword: "Enter the PDF password:",
    pdfPasswordAgain: "Incorrect password. Try again:",
    pdfError: "The PDF could not be opened.",
    pageRegion: (page, pages, column) => `Page ${page} of ${pages} · ${column}`,
    left: "Left column",
    right: "Right column",
    full: "Full page",
    start: "Start",
    movePosition: (label, san) => `${label} ${san}`,
    restored: "Previous local study restored.",
    cleared: "Local study cleared.",
    clearConfirm: "Clear the loaded files and locally stored study?",
    storageError:
      "The study is working, but this browser could not save it locally.",
    fileError: "This file could not be read.",
    droppedUnknown: "Drop a PDF or PGN file.",
    droppedPgnRequired: "Drop a PGN file on the chess board.",
    droppedPdfRequired: "Drop a PDF file on the book panel.",
    replacePdf: "Replace PDF",
    replacePgn: "Replace PGN",
    loadPdf: "Load PDF",
    loadPgn: "Load PGN",
    noValidGames: "No valid games were found.",
    result: "Result",
    ocrScanning: "Scanning the current PDF page for chess diagrams…",
    ocrReady: (count) =>
      `${count} chess ${count === 1 ? "diagram" : "diagrams"} detected. Select one to recognize its position.`,
    ocrNone: "No chess diagram was detected on this page.",
    ocrRecognizing: "Reading every piece and comparing the position with the PGN…",
    ocrMatched: (game, move) => `Matched ${game}${move ? ` · ${move}` : ""}.`,
    ocrAmbiguous: "Choose the matching PGN position.",
    ocrMultipleMatches: (count) =>
      `This position appears in ${count} PGN games. Choose which game to open.`,
    ocrCreated: (game) =>
      `No matching PGN position was found. Created and opened ${game}.`,
    ocrError: "The current page could not be analyzed.",
    ocrRecognitionError: "The selected diagram could not be recognized.",
    ocrDiagramLabel: (number) => `Analyze detected chess diagram ${number}`,
    ocrStart: "Starting position",
    ocrDifferences: (count) =>
      `${count} ${count === 1 ? "square difference" : "square differences"}`,
    illegalMove: "That move is not legal in this position.",
    moveAdded: (move) => `${move} added to the PGN.`,
    variationAdded: (move) => `${move} added as a PGN variation.`,
    existingMove: (move) => `${move} is already in the PGN.`,
    engineOff: "Engine off",
    engineLoading: "Loading Stockfish…",
    engineAnalyzing: (depth, target) =>
      `Analyzing · depth ${depth || 0}/${target}`,
    engineComplete: (depth) => `Analysis complete · depth ${depth}`,
    engineError: "The local chess engine could not be started.",
    engineEmpty: "Start the engine to calculate the best continuations.",
    engineWaiting: "Calculating principal variations…",
    engineEqual: "Equal position",
    engineWhiteAdvantage: (score) => `White advantage ${score}`,
    engineBlackAdvantage: (score) => `Black advantage ${score}`,
    moveQuality: {
      brilliant: "Brilliant",
      great: "Great",
      best: "Best",
      excellent: "Excellent",
      good: "Good",
      inaccuracy: "Inaccuracy",
      mistake: "Mistake",
      missedWin: "Missed win",
      blunder: "Blunder",
    },
  },
  pt: {
    unknown: "Desconhecido",
    untitled: "Partida sem título",
    loadingPgn: "Lendo PGN…",
    pgnReady: (count, invalid) =>
      invalid
        ? `${count} partidas carregadas; ${invalid} não puderam ser interpretadas.`
        : `${count} partidas carregadas.`,
    invalidPgn: "Este arquivo não contém uma partida PGN compatível.",
    pgnTooLarge: "O PGN é grande demais para este ambiente no navegador.",
    loadingPdf: "Abrindo PDF…",
    renderingPdf: "Renderizando coluna do livro…",
    pdfReady: (pages) => `PDF pronto · ${pages} páginas.`,
    invalidPdf: "Escolha um arquivo PDF válido.",
    pdfTooLarge: "O PDF é grande demais para este ambiente no navegador.",
    pdfPassword: "Digite a senha do PDF:",
    pdfPasswordAgain: "Senha incorreta. Tente novamente:",
    pdfError: "Não foi possível abrir o PDF.",
    pageRegion: (page, pages, column) => `Página ${page} de ${pages} · ${column}`,
    left: "Coluna esquerda",
    right: "Coluna direita",
    full: "Página inteira",
    start: "Início",
    movePosition: (label, san) => `${label} ${san}`,
    restored: "O estudo local anterior foi restaurado.",
    cleared: "O estudo local foi removido.",
    clearConfirm: "Limpar os arquivos carregados e o estudo salvo localmente?",
    storageError:
      "O estudo está funcionando, mas o navegador não conseguiu salvá-lo localmente.",
    fileError: "Não foi possível ler este arquivo.",
    droppedUnknown: "Solte um arquivo PDF ou PGN.",
    droppedPgnRequired: "Solte um arquivo PGN no tabuleiro.",
    droppedPdfRequired: "Solte um arquivo PDF no painel do livro.",
    replacePdf: "Trocar PDF",
    replacePgn: "Trocar PGN",
    loadPdf: "Carregar PDF",
    loadPgn: "Carregar PGN",
    noValidGames: "Nenhuma partida válida foi encontrada.",
    result: "Resultado",
    ocrScanning: "Procurando diagramas de xadrez na página atual do PDF…",
    ocrReady: (count) =>
      `${count} ${count === 1 ? "diagrama detectado" : "diagramas detectados"}. Selecione um para reconhecer a posição.`,
    ocrNone: "Nenhum diagrama de xadrez foi detectado nesta página.",
    ocrRecognizing: "Lendo todas as peças e comparando a posição com o PGN…",
    ocrMatched: (game, move) =>
      `Correspondência encontrada: ${game}${move ? ` · ${move}` : ""}.`,
    ocrAmbiguous: "Escolha a posição correspondente no PGN.",
    ocrMultipleMatches: (count) =>
      `Esta posição aparece em ${count} partidas do PGN. Escolha qual partida abrir.`,
    ocrCreated: (game) =>
      `Nenhuma posição correspondente foi encontrada. ${game} foi criada e aberta.`,
    ocrError: "Não foi possível analisar a página atual.",
    ocrRecognitionError: "Não foi possível reconhecer o diagrama selecionado.",
    ocrDiagramLabel: (number) => `Analisar diagrama de xadrez ${number}`,
    ocrStart: "Posição inicial",
    ocrDifferences: (count) =>
      `${count} ${count === 1 ? "diferença de casa" : "diferenças de casas"}`,
    illegalMove: "Esse lance não é válido nesta posição.",
    moveAdded: (move) => `${move} foi adicionado ao PGN.`,
    variationAdded: (move) => `${move} foi adicionado como variante no PGN.`,
    existingMove: (move) => `${move} já existe no PGN.`,
    engineOff: "Engine desligada",
    engineLoading: "Carregando Stockfish…",
    engineAnalyzing: (depth, target) =>
      `Analisando · profundidade ${depth || 0}/${target}`,
    engineComplete: (depth) => `Análise concluída · profundidade ${depth}`,
    engineError: "Não foi possível iniciar a engine local.",
    engineEmpty: "Inicie a engine para calcular as melhores continuações.",
    engineWaiting: "Calculando variantes principais…",
    engineEqual: "Posição equilibrada",
    engineWhiteAdvantage: (score) => `Vantagem das Brancas ${score}`,
    engineBlackAdvantage: (score) => `Vantagem das Pretas ${score}`,
    moveQuality: {
      brilliant: "Brilhante",
      great: "Ótimo",
      best: "Melhor",
      excellent: "Excelente",
      good: "Bom",
      inaccuracy: "Imprecisão",
      mistake: "Erro",
      missedWin: "Chance perdida",
      blunder: "Capivarada",
    },
  },
};

const NAG_SYMBOLS = {
  $1: "!",
  $2: "?",
  $3: "!!",
  $4: "??",
  $5: "!?",
  $6: "?!",
  $10: "=",
  $13: "∞",
  $14: "⩲",
  $15: "⩱",
  $16: "±",
  $17: "∓",
};

const state = {
  board: null,
  boardOrientation: "white",
  games: [],
  positionIndex: [],
  selectedGameIndex: -1,
  selectedMove: null,
  analysisFen: FEN.start,
  pgnText: "",
  pgnFileName: "",
  pdfBlob: null,
  pdfFileName: "",
  pdfDocument: null,
  pdfLoadingTask: null,
  pdfRenderTask: null,
  pdfRenderGeometry: null,
  pdfSettings: { ...DEFAULT_PDF_SETTINGS },
  restoring: false,
  storageWarningShown: false,
  pendingBoardMove: null,
  pendingBoardMoveTimer: null,
  promotionPending: false,
  creatingAnalysisGame: false,
  engineStatus: "off",
  engineLines: [],
  engineMeta: { depth: 0, targetDepth: 16 },
};

let elements;
let statusTimer;
let saveTimer;
let resizeTimer;
let ocrTimer;
let ocrController;
let engineController;
let moveAnalysisController;
let moveAnalysisToken = 0;

function labels() {
  return TEXT[getLanguage() === "pt" ? "pt" : "en"];
}

function queryElements() {
  return {
    pdfInput: document.getElementById("pdf-file"),
    pgnInput: document.getElementById("pgn-file"),
    pdfActionLabel: document.getElementById("pdf-action-label"),
    pgnActionLabel: document.getElementById("pgn-action-label"),
    clearStudy: document.getElementById("clear-study"),
    status: document.getElementById("study-status"),
    tabs: Array.from(document.querySelectorAll("[data-panel-target]")),
    panels: Array.from(document.querySelectorAll("[data-panel]")),
    gameSearch: document.getElementById("game-search"),
    gameCount: document.getElementById("game-count"),
    gameList: document.getElementById("game-list"),
    gamesEmpty: document.getElementById("games-empty"),
    gamesNoResults: document.getElementById("games-no-results"),
    boardEmpty: document.getElementById("board-empty"),
    boardContent: document.getElementById("board-content"),
    boardPanel: document.getElementById("board-panel"),
    chessboard: document.getElementById("chessboard"),
    flipBoard: document.getElementById("flip-board"),
    whitePlayer: document.getElementById("white-player"),
    whiteElo: document.getElementById("white-elo"),
    blackPlayer: document.getElementById("black-player"),
    blackElo: document.getElementById("black-elo"),
    gameResult: document.getElementById("game-result"),
    gameEvent: document.getElementById("game-event"),
    gameDate: document.getElementById("game-date"),
    gameRound: document.getElementById("game-round"),
    moveFirst: document.getElementById("move-first"),
    movePrevious: document.getElementById("move-previous"),
    moveNext: document.getElementById("move-next"),
    moveLast: document.getElementById("move-last"),
    moveStatus: document.getElementById("move-status"),
    notation: document.getElementById("notation"),
    positionDescription: document.getElementById("position-description"),
    engineDepth: document.getElementById("engine-depth"),
    engineStatus: document.getElementById("engine-status"),
    engineEvaluation: document.getElementById("engine-evaluation"),
    engineEmpty: document.getElementById("engine-empty"),
    engineLines: document.getElementById("engine-lines"),
    advantageMeter: document.getElementById("advantage-meter"),
    advantageWhiteFill: document.getElementById("advantage-white-fill"),
    advantageScore: document.getElementById("advantage-score"),
    boardMoveQuality: document.getElementById("board-move-quality"),
    bookEmpty: document.getElementById("book-empty"),
    bookContent: document.getElementById("book-content"),
    bookFileName: document.getElementById("book-file-name"),
    pdfPrevious: document.getElementById("pdf-previous"),
    pdfNext: document.getElementById("pdf-next"),
    pdfPage: document.getElementById("pdf-page"),
    pdfPageCount: document.getElementById("pdf-page-count"),
    pdfColumnButtons: Array.from(
      document.querySelectorAll("[data-pdf-column]"),
    ),
    pdfZoomOut: document.getElementById("pdf-zoom-out"),
    pdfZoomIn: document.getElementById("pdf-zoom-in"),
    pdfFit: document.getElementById("pdf-fit"),
    ocrScan: document.getElementById("ocr-scan"),
    ocrStatus: document.getElementById("ocr-status"),
    pdfSplit: document.getElementById("pdf-split"),
    pdfInnerMargin: document.getElementById("pdf-inner-margin"),
    pdfOuterMargin: document.getElementById("pdf-outer-margin"),
    splitOutput: document.getElementById("split-output"),
    innerOutput: document.getElementById("inner-output"),
    outerOutput: document.getElementById("outer-output"),
    pdfResetCalibration: document.getElementById("pdf-reset-calibration"),
    bookPosition: document.getElementById("book-position"),
    pdfViewport: document.getElementById("pdf-viewport"),
    pdfCanvas: document.getElementById("pdf-canvas"),
    pdfPageStage: document.getElementById("pdf-page-stage"),
    pdfDiagramLayer: document.getElementById("pdf-diagram-layer"),
    pdfLoading: document.getElementById("pdf-loading"),
    bookPanel: document.getElementById("book-panel"),
    ocrCandidateDialog: document.getElementById("ocr-candidate-dialog"),
    ocrCandidateList: document.getElementById("ocr-candidate-list"),
    ocrDialogIntro: document.getElementById("ocr-dialog-intro"),
    ocrDialogClose: document.getElementById("ocr-dialog-close"),
  };
}

function showStatus(message, isError = false, duration = 4200) {
  window.clearTimeout(statusTimer);
  elements.status.textContent = message;
  elements.status.classList.toggle("is-error", isError);
  elements.status.classList.add("is-visible");
  statusTimer = window.setTimeout(() => {
    elements.status.classList.remove("is-visible");
  }, duration);
}

function engineStatusText() {
  if (state.engineStatus === "loading") return labels().engineLoading;
  if (state.engineStatus === "analyzing") {
    return labels().engineAnalyzing(
      state.engineMeta.depth,
      state.engineMeta.targetDepth,
    );
  }
  if (state.engineStatus === "complete") {
    return labels().engineComplete(state.engineMeta.depth);
  }
  if (state.engineStatus === "error") return labels().engineError;
  return labels().engineOff;
}

function updateAdvantageMeter(evaluation) {
  const share = evaluationToWhiteShare(evaluation);
  const score = formatEvaluation(evaluation);
  const value = evaluation
    ? evaluation.type === "mate"
      ? Math.sign(evaluation.value) * 10
      : Math.max(-10, Math.min(10, evaluation.value / 100))
    : 0;
  const valueText = !evaluation
    ? labels().engineEqual
    : evaluation.value > 0
      ? labels().engineWhiteAdvantage(score)
      : evaluation.value < 0
        ? labels().engineBlackAdvantage(score)
        : labels().engineEqual;

  elements.advantageWhiteFill.style.setProperty(
    "--white-share",
    String(share / 100),
  );
  elements.advantageMeter.classList.toggle(
    "is-black-orientation",
    state.boardOrientation === "black",
  );
  elements.advantageMeter.classList.toggle(
    "is-white-leading",
    Boolean(evaluation && evaluation.value > 0),
  );
  elements.advantageMeter.classList.toggle(
    "is-black-leading",
    Boolean(evaluation && evaluation.value < 0),
  );
  elements.advantageMeter.setAttribute("aria-valuenow", String(value));
  elements.advantageMeter.setAttribute("aria-valuetext", valueText);
  elements.advantageScore.textContent = evaluation ? score : "—";
}

function renderEngineAnalysis() {
  elements.engineStatus.textContent = engineStatusText();
  elements.engineLines.textContent = "";

  const primaryLine = state.engineLines[0];
  updateAdvantageMeter(primaryLine?.evaluation || null);
  elements.engineEvaluation.textContent = primaryLine
    ? formatEvaluation(primaryLine.evaluation)
    : "—";
  elements.engineEmpty.hidden = state.engineLines.length > 0;
  elements.engineEmpty.textContent = ["loading", "analyzing"].includes(
    state.engineStatus,
  )
    ? labels().engineWaiting
    : labels().engineEmpty;

  state.engineLines.forEach((line) => {
    const item = document.createElement("li");
    const score = document.createElement("span");
    const variation = document.createElement("span");
    item.className = "engine-line";
    score.className = "engine-line-score";
    score.textContent = formatEvaluation(line.evaluation);
    variation.className = "engine-line-pv";
    variation.textContent = line.san || line.pv.join(" ");
    variation.title = variation.textContent;
    item.append(score, variation);
    elements.engineLines.append(item);
  });
}

function setEngineState(status) {
  state.engineStatus = status;
  if (status === "error") {
    showStatus(labels().engineError, true, 7000);
  }
  renderEngineAnalysis();
}

function receiveEngineAnalysis(lines, meta) {
  state.engineLines = lines;
  state.engineMeta = meta;
  state.engineStatus = meta.status;
  renderEngineAnalysis();
}

function analyzeCurrentPosition(fen = null, game = null) {
  const selectedGame = game || state.games[state.selectedGameIndex];
  const currentFen = selectedGame
    ? fen || state.selectedMove?.fen || selectedGame.startFen || FEN.start
    : fen || state.analysisFen || FEN.start;
  state.engineLines = [];
  state.engineMeta = {
    depth: 0,
    targetDepth: Number(elements.engineDepth.value),
  };
  renderEngineAnalysis();
  engineController.analyze({
    fen: currentFen,
    depth: state.engineMeta.targetDepth,
    multiPv: 3,
    chess960: Boolean(selectedGame?.pgn.history.props.chess960),
  });
}

function updateBoardMoveQuality() {
  const badge = elements.boardMoveQuality;
  const move = state.selectedMove;
  const quality = move?.quality;
  if (!quality || !move.to) {
    badge.hidden = true;
    return;
  }

  const file = move.to.charCodeAt(0) - 97;
  const rank = Number(move.to[1]);
  const x = state.boardOrientation === "white" ? file : 7 - file;
  const y = state.boardOrientation === "white" ? 8 - rank : rank - 1;
  badge.className = `board-move-quality quality-${quality.className}`;
  badge.textContent = quality.symbol;
  badge.title = labels().moveQuality[quality.key];
  badge.style.setProperty("--quality-file", String(x));
  badge.style.setProperty("--quality-rank", String(y));
  badge.hidden = false;
}

function mainLineMoves(game) {
  const moves = [];
  let move = game.moves[0];
  while (move) {
    moves.push(move);
    move = move.next;
  }
  return moves;
}

function analyzeMoveQualityPosition(fen, chess960, token) {
  return new Promise((resolve, reject) => {
    let latestLines = [];
    const onAnalysis = (lines, meta) => {
      if (token !== moveAnalysisToken) return;
      latestLines = lines;
      if (meta.status === "complete") resolve(latestLines);
    };
    const onState = (status) => {
      if (token !== moveAnalysisToken) return;
      if (status === "error") reject(new Error("Move analysis failed"));
    };
    moveAnalysisController.callbacks = { onAnalysis, onState };
    moveAnalysisController.controller.analyze({
      fen,
      depth: Math.min(12, Number(elements.engineDepth.value) || 12),
      multiPv: 2,
      chess960,
    });
  });
}

async function classifyGameMoves(game) {
  const token = ++moveAnalysisToken;
  const moves = mainLineMoves(game);
  if (!moves.length || moves.every((move) => move.quality)) return;
  const chess960 = Boolean(game.pgn.history.props.chess960);
  let beforeLines;

  try {
    beforeLines = await analyzeMoveQualityPosition(game.startFen, chess960, token);
    for (const move of moves) {
      if (token !== moveAnalysisToken || state.games[state.selectedGameIndex] !== game) return;
      const afterLines = await analyzeMoveQualityPosition(move.fen, chess960, token);
      move.quality = classifyMove({
        move,
        beforeLines,
        afterEvaluation: afterLines[0]?.evaluation,
        afterLines,
      });
      beforeLines = afterLines;
      renderNotation();
      updateBoardMoveQuality();
    }
  } catch (error) {
    if (token === moveAnalysisToken) console.warn("Move classification stopped.", error);
  }
}

function setFileActionLabels() {
  elements.pdfActionLabel.textContent = state.pdfBlob
    ? labels().replacePdf
    : labels().loadPdf;
  elements.pgnActionLabel.textContent = state.pgnText
    ? labels().replacePgn
    : labels().loadPgn;
}

function setOcrStatus(status, details = {}) {
  elements.ocrScan.disabled = !state.pdfDocument;
  elements.ocrStatus.classList.toggle(
    "is-ready",
    status === "ready" || status === "matched" || status === "created",
  );
  elements.ocrStatus.classList.toggle(
    "is-error",
    status === "error" || status === "recognition-error",
  );

  const messages = {
    idle: "",
    "needs-pdf": "",
    scanning: labels().ocrScanning,
    ready: labels().ocrReady(details.count || 0),
    none: labels().ocrNone,
    recognizing: labels().ocrRecognizing,
    ambiguous: labels().ocrAmbiguous,
    error: labels().ocrError,
    "recognition-error": labels().ocrRecognitionError,
  };
  elements.ocrStatus.textContent = messages[status] || "";
}

function scheduleOcrAnalysis(force = false) {
  window.clearTimeout(ocrTimer);
  ocrTimer = window.setTimeout(
    () => ocrController?.analyzeCurrentPage(force),
    force ? 0 : 220,
  );
}

function renderOcrDetections(detections) {
  elements.pdfDiagramLayer.textContent = "";
  const geometry = state.pdfRenderGeometry;
  if (!geometry || geometry.pageNumber !== state.pdfSettings.pageNumber) return;

  const visibleLeft = geometry.crop.x;
  const visibleRight = geometry.crop.x + geometry.crop.width;
  const visibleWidth = geometry.crop.width * geometry.renderScale;
  const visibleHeight = geometry.baseHeight * geometry.renderScale;

  detections.forEach((detection, index) => {
    const box = detection.pageBox;
    const intersectionLeft = Math.max(box.x, visibleLeft);
    const intersectionRight = Math.min(box.x + box.width, visibleRight);
    if (intersectionRight <= intersectionLeft) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "pdf-diagram-target";
    button.classList.toggle(
      "is-analyzing",
      detection.status === "analyzing",
    );
    button.classList.toggle("is-matched", detection.status === "matched");
    button.classList.toggle("is-created", detection.status === "created");
    button.classList.toggle(
      "is-ambiguous",
      detection.status === "ambiguous",
    );
    button.classList.toggle("is-failed", detection.status === "failed");
    button.dataset.diagramId = detection.id;
    button.dataset.diagramNumber = String(index + 1);
    button.setAttribute("aria-label", labels().ocrDiagramLabel(index + 1));
    button.style.left = `${Math.max(
      0,
      (intersectionLeft - visibleLeft) * geometry.renderScale,
    )}px`;
    button.style.top = `${Math.max(0, box.y * geometry.renderScale)}px`;
    button.style.width = `${Math.min(
      visibleWidth,
      (intersectionRight - intersectionLeft) * geometry.renderScale,
    )}px`;
    button.style.height = `${Math.min(
      visibleHeight,
      box.height * geometry.renderScale,
    )}px`;
    button.addEventListener("click", () =>
      ocrController?.recognizeDetection(detection.id),
    );
    elements.pdfDiagramLayer.append(button);
  });
}

function candidateMoveText(candidate) {
  if (candidate.isStart) return labels().ocrStart;
  return `${moveLabel(candidate)} ${candidate.san || ""}`.trim();
}

async function applyOcrCandidate(candidate) {
  if (!candidate) return;
  selectGame(candidate.gameIndex, candidate.moveId);
  if (
    candidate.orientation &&
    candidate.orientation !== state.boardOrientation
  ) {
    state.boardOrientation = candidate.orientation;
    await state.board.setOrientation(
      candidate.orientation === "black" ? COLOR.black : COLOR.white,
      false,
    );
  }
  updateMobilePanel("board");
  if (elements.ocrCandidateDialog.open) {
    elements.ocrCandidateDialog.close();
  }
  const game = state.games[candidate.gameIndex];
  const moveText = candidateMoveText(candidate);
  elements.ocrStatus.classList.add("is-ready");
  elements.ocrStatus.classList.remove("is-error");
  elements.ocrStatus.textContent = labels().ocrMatched(
    gameTitle(game),
    moveText,
  );
  showStatus(labels().ocrMatched(gameTitle(game), moveText));
}

async function createGameFromOcr(result, detection) {
  const record = buildOcrPositionPgn(result.fen, {
    pageNumber: state.pdfSettings.pageNumber,
    diagramNumber: detection.index + 1,
  });
  const gameIndex = state.games.length;
  const nextPgn = appendPgnRecord(state.pgnText, record);
  await loadPgnContent(nextPgn, state.pgnFileName || "ocr-positions.pgn", {
    selectedGameIndex: gameIndex,
    skipOcrAnalysis: true,
  });

  if (result.orientation !== state.boardOrientation) {
    state.boardOrientation = result.orientation;
    await state.board.setOrientation(
      result.orientation === "black" ? COLOR.black : COLOR.white,
      false,
    );
  }

  const game = state.games[gameIndex];
  const message = labels().ocrCreated(gameTitle(game));
  elements.ocrStatus.classList.add("is-ready");
  elements.ocrStatus.classList.remove("is-error");
  elements.ocrStatus.textContent = message;
  updateMobilePanel("board");
  showStatus(message, false, 6500);
  scheduleSave();
}

function showOcrCandidates(result) {
  elements.ocrCandidateList.textContent = "";
  const exactMatches = result.correspondingCandidates || [];
  const candidates = exactMatches;
  elements.ocrDialogIntro.textContent =
    exactMatches.length > 1
      ? labels().ocrMultipleMatches(exactMatches.length)
      : labels().ocrAmbiguous;

  candidates.forEach((candidate) => {
    const game = state.games[candidate.gameIndex];
    const button = document.createElement("button");
    button.type = "button";
    button.className = "ocr-candidate-button";

    const title = document.createElement("span");
    title.className = "ocr-candidate-title";
    title.textContent = gameTitle(game);
    const meta = document.createElement("span");
    meta.className = "ocr-candidate-meta";
    meta.textContent = `${candidateMoveText(candidate)} · ${labels().ocrDifferences(
      candidate.mismatches,
    )}`;
    button.append(title, meta);
    button.addEventListener("click", () => applyOcrCandidate(candidate));
    elements.ocrCandidateList.append(button);
  });

  setOcrStatus("ambiguous");
  if (!elements.ocrCandidateDialog.open) {
    elements.ocrCandidateDialog.showModal();
  }
}

async function handleOcrResult(result, detection) {
  const exactMatches = result.correspondingCandidates || [];
  if (exactMatches.length === 1) {
    await applyOcrCandidate(exactMatches[0]);
    return { status: "matched" };
  }
  if (exactMatches.length > 1) {
    showOcrCandidates(result);
    return { status: "ambiguous" };
  }
  await createGameFromOcr(result, detection);
  return { status: "created" };
}

function formatHeader(value) {
  if (!value || value === "?") return "—";
  return String(value);
}

function gameTitle(game) {
  const white = formatHeader(game.headers.White);
  const black = formatHeader(game.headers.Black);
  if (white === "—" && black === "—") return labels().untitled;
  return `${white} — ${black}`;
}

function moveLabel(move) {
  if (!move) return labels().start;
  const number = Math.ceil(move.ply / 2);
  return move.ply % 2 === 1 ? `${number}.` : `${number}...`;
}

function updateMobilePanel(target) {
  elements.tabs.forEach((tab) => {
    const active = tab.dataset.panelTarget === target;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  elements.panels.forEach((panel) => {
    panel.classList.toggle("is-mobile-active", panel.dataset.panel === target);
  });
  if (target === "book") {
    elements.bookPanel.focus({ preventScroll: true });
    window.setTimeout(renderPdfRegion, 0);
  }
}

function createBoard() {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  state.board = new Chessboard(elements.chessboard, {
    position: FEN.start,
    orientation: COLOR.white,
    assetsUrl: BOARD_ASSET_PATH,
    style: {
      cssClass: "default",
      showCoordinates: true,
      pieces: { file: "pieces/standard.svg" },
      animationDuration: reducedMotion ? 0 : 130,
    },
    extensions: [
      {
        class: Accessibility,
        props: {
          language: getLanguage() === "pt" ? "en" : getLanguage(),
          brailleNotationInAlt: true,
          boardAsTable: true,
          movePieceForm: false,
          piecesAsList: false,
          keyboardMoveInput: true,
          visuallyHidden: true,
        },
      },
      { class: Markers, props: { autoMarkers: null } },
      { class: PromotionDialog, props: { language: "en" } },
    ],
  });
  state.board.enableMoveInput(handleBoardMoveInput);
}

function indexMoveTree(moves, prefix, moveById) {
  moves.forEach((move, index) => {
    const id = `${prefix}${index}`;
    move.studyId = id;
    moveById.set(id, move);
    (move.variations || []).forEach((variation, variationIndex) => {
      indexMoveTree(variation, `${id}-v${variationIndex}-`, moveById);
    });
  });
}

function parsePgnText(text) {
  const normalizedText = text.replace(/\r\n?/g, "\n").trim();
  if (!normalizedText) throw new Error(labels().invalidPgn);

  const rawGames = normalizedText.startsWith("[")
    ? splitPgnRecords(normalizedText)
    : [normalizedText];

  const games = [];
  let invalidCount = 0;

  rawGames.forEach((rawPgn, index) => {
    try {
      const pgn = new Pgn(rawPgn, { sloppy: true });
      const moveById = new Map();
      indexMoveTree(pgn.history.moves, `g${index}-m`, moveById);
      const headers = { ...pgn.header.tags };
      const game = {
        id: `game-${index}`,
        recordIndex: index,
        rawPgn,
        pgn,
        headers,
        moves: pgn.history.moves,
        moveById,
        startFen: pgn.history.props.setUpFen || FEN.start,
      };
      game.searchText = [
        headers.White,
        headers.Black,
        headers.Event,
        headers.Date,
        headers.Result,
        headers.ECO,
        headers.Opening,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase();
      games.push(game);
    } catch (error) {
      invalidCount += 1;
      console.warn(`PGN game ${index + 1} could not be parsed.`, error);
    }
  });

  if (!games.length) throw new Error(labels().noValidGames);
  return { games, invalidCount };
}

function currentBoardMoveContext() {
  const game = state.games[state.selectedGameIndex];
  return {
    game,
    gameIndex: state.selectedGameIndex,
    previous: state.selectedMove,
    fen: state.selectedMove?.fen || game?.startFen || state.analysisFen,
  };
}

function boardMoveContextIsCurrent(context) {
  return Boolean(
      context &&
      (context.game
        ? state.games[context.gameIndex] === context.game
        : context.gameIndex === -1 && !state.games.length) &&
      state.selectedGameIndex === context.gameIndex &&
      state.selectedMove === context.previous,
  );
}

function clearPendingBoardMove() {
  window.clearTimeout(state.pendingBoardMoveTimer);
  state.pendingBoardMoveTimer = null;
  state.pendingBoardMove = null;
}

function reindexEditedGame(game) {
  game.moves = game.pgn.history.moves;
  game.moveById = new Map();
  indexMoveTree(game.moves, `g${game.recordIndex}-m`, game.moveById);
}

async function createAnalysisGameAndCommit(context, notation) {
  if (state.creatingAnalysisGame) return;
  state.creatingAnalysisGame = true;

  try {
    const record = buildFreeAnalysisPgn(context.fen || FEN.start);
    await loadPgnContent(record, "free-analysis.pgn", {
      skipOcrAnalysis: true,
    });
    const gameContext = currentBoardMoveContext();
    if (gameContext?.game) commitBoardMove(gameContext, notation);
  } catch (error) {
    console.warn("Free analysis PGN could not be created.", error);
    updateBoardPosition();
    showStatus(error.message || labels().fileError, true);
  } finally {
    state.creatingAnalysisGame = false;
  }
}

function commitBoardMove(context, notation) {
  if (!boardMoveContextIsCurrent(context)) return;

  try {
    if (!context.game) {
      createAnalysisGameAndCommit(context, notation);
      return;
    }
    const result = addMoveToGame(context.game, notation, context.previous);
    if (result.changed) {
      const renderedPgn = context.game.pgn.render();
      context.game.rawPgn = renderedPgn;
      state.pgnText = replacePgnRecord(
        state.pgnText,
        context.game.recordIndex,
        renderedPgn,
      );
      reindexEditedGame(context.game);
      state.positionIndex = buildPositionIndex(state.games);
    }

    state.selectedMove = result.move;
    renderNotation();
    updateMoveControls();
    updateBoardPosition();
    if (result.changed) classifyGameMoves(context.game);
    scheduleSave();

    const message = result.changed
      ? result.isVariation
        ? labels().variationAdded(result.move.san)
        : labels().moveAdded(result.move.san)
      : labels().existingMove(result.move.san);
    showStatus(message);
  } catch (error) {
    console.warn("Board move could not be added to the PGN.", error);
    updateBoardPosition();
    showStatus(labels().illegalMove, true);
  }
}

function queueBoardMove(context, notation) {
  clearPendingBoardMove();
  const pending = { context, notation };
  state.pendingBoardMove = pending;
  // Mouse input emits a finished event. Keyboard input does not, so this
  // timeout commits after its board animation as an accessible fallback.
  state.pendingBoardMoveTimer = window.setTimeout(() => {
    if (state.pendingBoardMove !== pending) return;
    clearPendingBoardMove();
    commitBoardMove(context, notation);
  }, 220);
}

function handleBoardMoveInput(event) {
  const context = currentBoardMoveContext();

  if (event.type === INPUT_EVENT_TYPE.moveInputStarted) {
    if (!context || state.promotionPending) return false;
    const activeColor = context.fen.split(/\s+/)[1];
    return event.piece?.[0] === activeColor;
  }

  if (event.type === INPUT_EVENT_TYPE.validateMoveInput) {
    if (!context) return false;
    const promotion = isPromotionMove(event.piece, event.squareTo);
    const notation = {
      from: event.squareFrom,
      to: event.squareTo,
      ...(promotion ? { promotion: "q" } : {}),
    };
    const legalMove = validateMoveFromFen(
      context.fen,
      notation,
      context.game?.pgn.history.props.chess960 || false,
    );
    if (!legalMove) return false;

    if (promotion) {
      state.promotionPending = true;
      state.board.showPromotionDialog(
        event.squareTo,
        event.piece[0] === "b" ? COLOR.black : COLOR.white,
        (result) => {
          state.promotionPending = false;
          if (
            result.type === PROMOTION_DIALOG_RESULT_TYPE.pieceSelected &&
            boardMoveContextIsCurrent(context)
          ) {
            commitBoardMove(context, {
              from: event.squareFrom,
              to: event.squareTo,
              promotion: result.piece[1],
            });
          } else {
            updateBoardPosition();
          }
        },
      );
      return false;
    }

    queueBoardMove(context, notation);
    return true;
  }

  if (event.type === INPUT_EVENT_TYPE.moveInputFinished) {
    if (state.promotionPending) return;
    const pending = state.pendingBoardMove;
    clearPendingBoardMove();
    if (event.legalMove && pending) {
      commitBoardMove(pending.context, pending.notation);
    } else if (!event.legalMove) {
      updateBoardPosition();
      showStatus(labels().illegalMove, true);
    }
  }
}

function renderGameList() {
  const filter = elements.gameSearch.value.trim().toLocaleLowerCase();
  elements.gameList.textContent = "";
  let visibleCount = 0;

  state.games.forEach((game, index) => {
    if (filter && !game.searchText.includes(filter)) return;
    visibleCount += 1;

    const item = document.createElement("li");
    const button = document.createElement("button");
    const number = document.createElement("span");
    const main = document.createElement("span");
    const title = document.createElement("span");
    const meta = document.createElement("span");
    const result = document.createElement("span");
    const detail = document.createElement("span");

    button.type = "button";
    button.className = "game-card";
    button.dataset.gameIndex = String(index);
    button.setAttribute(
      "aria-current",
      String(index === state.selectedGameIndex),
    );
    number.className = "game-number";
    number.textContent = String(index + 1).padStart(2, "0");
    main.className = "game-card-main";
    title.className = "game-card-title";
    title.textContent = gameTitle(game);
    meta.className = "game-card-meta";
    result.className = "game-card-result";
    result.textContent = formatHeader(game.headers.Result);
    detail.textContent =
      game.headers.Event || game.headers.ECO || game.headers.Date || "";

    meta.append(result, detail);
    main.append(title, meta);
    button.append(number, main);
    item.append(button);
    elements.gameList.append(item);
  });

  elements.gamesNoResults.hidden = visibleCount > 0 || !state.games.length;
}

function setGameSummary(game) {
  elements.whitePlayer.textContent = formatHeader(game.headers.White);
  elements.whiteElo.textContent = game.headers.WhiteElo
    ? `(${game.headers.WhiteElo})`
    : "";
  elements.blackPlayer.textContent = formatHeader(game.headers.Black);
  elements.blackElo.textContent = game.headers.BlackElo
    ? `(${game.headers.BlackElo})`
    : "";
  elements.gameResult.textContent = formatHeader(game.headers.Result);
  elements.gameEvent.textContent = formatHeader(game.headers.Event);
  elements.gameDate.textContent = formatHeader(game.headers.Date);
  elements.gameRound.textContent = formatHeader(game.headers.Round);
}

function appendComment(container, text) {
  if (!text) return;
  const comment = document.createElement("span");
  comment.className = "move-comment";
  comment.textContent = ` {${text}} `;
  container.append(comment);
}

function renderMoveSequence(container, moves, isVariation = false) {
  const sequence = document.createElement("span");
  sequence.className = "move-sequence";
  if (isVariation) sequence.classList.add("move-variation");

  moves.forEach((move, index) => {
    appendComment(sequence, move.commentBefore);

    if (move.ply % 2 === 1 || index === 0) {
      const number = document.createElement("span");
      number.className = "move-number";
      number.textContent = moveLabel(move);
      sequence.append(number);
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = "move-button";
    button.dataset.moveId = move.studyId;
    button.textContent = move.san;
    if (move.quality) {
      const quality = document.createElement("span");
      const qualityName = labels().moveQuality[move.quality.key];
      quality.className = `move-quality quality-${move.quality.className}`;
      quality.textContent = move.quality.symbol;
      quality.title = `${qualityName} · ${move.quality.loss} cp`;
      quality.setAttribute("aria-label", qualityName);
      button.append(quality);
    }
    if (state.selectedMove === move) {
      button.classList.add("is-active");
      button.setAttribute("aria-current", "true");
    }
    sequence.append(button);

    if (move.nag) {
      const nag = document.createElement("span");
      nag.className = "move-nag";
      nag.textContent = NAG_SYMBOLS[move.nag] || move.nag;
      sequence.append(nag);
    }

    appendComment(sequence, move.commentMove);
    appendComment(sequence, move.commentAfter);

    (move.variations || []).forEach((variation) => {
      renderMoveSequence(sequence, variation, true);
    });
  });

  container.append(sequence);
}

function renderNotation() {
  const game = state.games[state.selectedGameIndex];
  elements.notation.textContent = "";
  if (!game) return;

  const startButton = document.createElement("button");
  startButton.type = "button";
  startButton.className = "move-button";
  startButton.dataset.moveId = "start";
  startButton.textContent = labels().start;
  if (!state.selectedMove) {
    startButton.classList.add("is-active");
    startButton.setAttribute("aria-current", "true");
  }
  elements.notation.append(startButton);
  renderMoveSequence(elements.notation, game.moves);
}

function lastMoveFrom(startMove) {
  let move = startMove;
  while (move?.next) move = move.next;
  return move || null;
}

function updateMoveControls() {
  const game = state.games[state.selectedGameIndex];
  const hasGame = Boolean(game);
  const standalone = !hasGame && state.selectedGameIndex === -1;
  const nextMove = state.selectedMove ? state.selectedMove.next : game?.moves[0];
  const lastMove = game
    ? lastMoveFrom(state.selectedMove || game.moves[0])
    : null;

  elements.moveFirst.disabled = !hasGame || !state.selectedMove;
  elements.movePrevious.disabled = !hasGame || !state.selectedMove;
  elements.moveNext.disabled = !hasGame || !nextMove;
  elements.moveLast.disabled =
    !hasGame || !lastMove || state.selectedMove === lastMove;
  elements.flipBoard.disabled = !(hasGame || standalone);
  elements.engineDepth.disabled = !(hasGame || standalone);

  if (!state.selectedMove) {
    elements.moveStatus.textContent = labels().start;
  } else {
    elements.moveStatus.textContent = labels().movePosition(
      moveLabel(state.selectedMove),
      state.selectedMove.san,
    );
  }
}

async function updateBoardPosition() {
  const game = state.games[state.selectedGameIndex];
  if (!state.board) return;
  const fen = game
    ? state.selectedMove?.fen || game.startFen
    : state.analysisFen || FEN.start;
  const animate = !window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  analyzeCurrentPosition(fen, game);
  await state.board.setPosition(fen, animate);
  state.board.removeMarkers();
  if (state.selectedMove?.from && state.selectedMove?.to) {
    state.board.addMarker(MARKER_TYPE.framePrimary, state.selectedMove.from);
    state.board.addMarker(MARKER_TYPE.framePrimary, state.selectedMove.to);
  }
  updateBoardMoveQuality();

  const description = game && state.selectedMove
    ? `${gameTitle(game)}. ${labels().movePosition(
        moveLabel(state.selectedMove),
        state.selectedMove.san,
      )}. FEN ${fen}`
    : `${game ? `${gameTitle(game)}. ` : ""}${labels().start}. FEN ${fen}`;
  elements.positionDescription.textContent = description;
}

function selectMove(moveId, options = {}) {
  clearPendingBoardMove();
  const game = state.games[state.selectedGameIndex];
  if (!game) return;
  state.selectedMove =
    !moveId || moveId === "start" ? null : game.moveById.get(moveId) || null;
  renderNotation();
  updateMoveControls();
  updateBoardPosition();

  if (options.scroll !== false) {
    const active = elements.notation.querySelector(".move-button.is-active");
    active?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }
  scheduleSave();
}

function selectGame(index, moveId = null) {
  clearPendingBoardMove();
  const game = state.games[index];
  if (!game) return;
  state.selectedGameIndex = index;
  state.selectedMove = moveId ? game.moveById.get(moveId) || null : null;
  elements.boardEmpty.hidden = true;
  elements.boardContent.hidden = false;
  setGameSummary(game);
  renderGameList();
  renderNotation();
  updateMoveControls();
  updateBoardPosition();
  classifyGameMoves(game);
  scheduleSave();
}

function setPgnUiLoaded(fileName, gameCount) {
  state.pgnFileName = fileName;
  elements.gamesEmpty.hidden = true;
  elements.gameSearch.disabled = false;
  elements.gameCount.textContent = String(gameCount);
  setFileActionLabels();
}

async function loadPgnContent(text, fileName, restore = {}) {
  showStatus(labels().loadingPgn, false, 120000);
  const { games, invalidCount } = parsePgnText(text);
  state.pgnText = text;
  state.games = games;
  state.positionIndex = buildPositionIndex(games);
  state.selectedGameIndex = -1;
  state.selectedMove = null;
  state.analysisFen = FEN.start;
  elements.gameSearch.value = "";
  setPgnUiLoaded(fileName, games.length);
  renderGameList();

  const selectedIndex = Math.min(
    Math.max(Number(restore.selectedGameIndex) || 0, 0),
    games.length - 1,
  );
  selectGame(selectedIndex, restore.selectedMoveId || null);
  showStatus(labels().pgnReady(games.length, invalidCount));
  if (!restore.skipOcrAnalysis) scheduleOcrAnalysis();
}

async function handlePgnFile(file) {
  if (!file) return;
  if (
    file.size > MAX_PGN_SIZE ||
    (!file.name.toLowerCase().endsWith(".pgn") &&
      file.type &&
      !file.type.includes("text"))
  ) {
    showStatus(
      file.size > MAX_PGN_SIZE ? labels().pgnTooLarge : labels().invalidPgn,
      true,
    );
    return;
  }

  try {
    const text = await file.text();
    await loadPgnContent(text, file.name);
    scheduleSave();
  } catch (error) {
    console.error(error);
    showStatus(error.message || labels().fileError, true, 7000);
  } finally {
    elements.pgnInput.value = "";
  }
}

function resetPgn() {
  moveAnalysisToken += 1;
  moveAnalysisController?.controller.stop();
  state.creatingAnalysisGame = false;
  state.engineStatus = "off";
  state.engineLines = [];
  state.engineMeta = { depth: 0, targetDepth: 16 };
  engineController?.stop();
  state.games = [];
  state.positionIndex = [];
  state.selectedGameIndex = -1;
  state.selectedMove = null;
  state.pgnText = "";
  state.pgnFileName = "";
  elements.gameList.textContent = "";
  elements.gameSearch.value = "";
  elements.gameSearch.disabled = true;
  elements.gameCount.textContent = "0";
  elements.gamesEmpty.hidden = false;
  elements.gamesNoResults.hidden = true;
  elements.boardEmpty.hidden = true;
  elements.boardContent.hidden = false;
  elements.flipBoard.disabled = false;
  state.board?.setPosition(FEN.start, false);
  setFileActionLabels();
  ocrController?.clear();
  setOcrStatus("idle");
  renderEngineAnalysis();
  updateBoardPosition();
}

function pdfColumnName(column) {
  if (column === "right") return labels().right;
  if (column === "full") return labels().full;
  return labels().left;
}

function updatePdfControls() {
  const documentLoaded = Boolean(state.pdfDocument);
  const pageCount = state.pdfDocument?.numPages || 0;
  elements.pdfPage.value = String(state.pdfSettings.pageNumber);
  elements.pdfPage.max = String(pageCount || 1);
  elements.pdfPageCount.textContent = String(pageCount);
  elements.pdfColumnButtons.forEach((button) => {
    button.classList.toggle(
      "is-active",
      button.dataset.pdfColumn === state.pdfSettings.column,
    );
  });
  elements.pdfPrevious.disabled =
    !documentLoaded ||
    (state.pdfSettings.pageNumber === 1 &&
      (state.pdfSettings.column === "left" ||
        state.pdfSettings.column === "full"));
  elements.pdfNext.disabled =
    !documentLoaded ||
    (state.pdfSettings.pageNumber === pageCount &&
      (state.pdfSettings.column === "right" ||
        state.pdfSettings.column === "full"));
  elements.pdfZoomOut.disabled = !documentLoaded || state.pdfSettings.zoom <= 0.6;
  elements.pdfZoomIn.disabled = !documentLoaded || state.pdfSettings.zoom >= 2.4;
  elements.bookPosition.textContent = documentLoaded
    ? labels().pageRegion(
        state.pdfSettings.pageNumber,
        pageCount,
        pdfColumnName(state.pdfSettings.column),
      )
    : "";
}

function updateCalibrationUi() {
  const split = Math.round(state.pdfSettings.splitRatio * 100);
  const inner = Math.round(state.pdfSettings.innerMargin * 100);
  const outer = Math.round(state.pdfSettings.outerMargin * 100);
  elements.pdfSplit.value = String(split);
  elements.pdfInnerMargin.value = String(inner);
  elements.pdfOuterMargin.value = String(outer);
  elements.splitOutput.textContent = `${split}%`;
  elements.innerOutput.textContent = `${inner}%`;
  elements.outerOutput.textContent = `${outer}%`;
}

function calculateCrop(viewport) {
  if (state.pdfSettings.column === "full") {
    return { x: 0, width: viewport.width };
  }

  const splitX = viewport.width * state.pdfSettings.splitRatio;
  const inner = viewport.width * state.pdfSettings.innerMargin;
  const outer = viewport.width * state.pdfSettings.outerMargin;
  if (state.pdfSettings.column === "right") {
    const x = Math.min(splitX + inner, viewport.width - 1);
    return {
      x,
      width: Math.max(1, viewport.width - outer - x),
    };
  }
  return {
    x: outer,
    width: Math.max(1, splitX - inner - outer),
  };
}

async function renderPdfRegion() {
  if (!state.pdfDocument) return;
  state.pdfRenderTask?.cancel();
  elements.pdfLoading.hidden = false;
  elements.pdfLoading.textContent = labels().renderingPdf;
  let renderCompleted = false;

  try {
    const pageNumber = state.pdfSettings.pageNumber;
    const page = await state.pdfDocument.getPage(pageNumber);
    const baseViewport = page.getViewport({ scale: 1 });
    const crop = calculateCrop(baseViewport);
    const availableWidth = Math.max(
      240,
      elements.pdfViewport.clientWidth - 32,
    );
    const fitScale = availableWidth / crop.width;
    const renderScale = fitScale * state.pdfSettings.zoom;
    const viewport = page.getViewport({ scale: renderScale });
    const outputScale = Math.min(window.devicePixelRatio || 1, 2);
    const canvas = elements.pdfCanvas;
    const context = canvas.getContext("2d", { alpha: false });
    const cssWidth = Math.max(1, Math.floor(crop.width * renderScale));
    const cssHeight = Math.max(1, Math.floor(viewport.height));

    canvas.width = Math.max(1, Math.floor(cssWidth * outputScale));
    canvas.height = Math.max(1, Math.floor(cssHeight * outputScale));
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;
    state.pdfRenderGeometry = {
      pageNumber,
      crop,
      renderScale,
      baseWidth: baseViewport.width,
      baseHeight: baseViewport.height,
    };

    const transform = [
      outputScale,
      0,
      0,
      outputScale,
      -crop.x * renderScale * outputScale,
      0,
    ];
    state.pdfRenderTask = page.render({
      canvas,
      canvasContext: context,
      viewport,
      transform,
      background: "#ffffff",
    });
    await state.pdfRenderTask.promise;
    renderCompleted = true;
    elements.pdfViewport.scrollTo({ top: 0, left: 0 });
  } catch (error) {
    if (error?.name !== "RenderingCancelledException") {
      console.error(error);
      showStatus(labels().pdfError, true);
    }
  } finally {
    elements.pdfLoading.hidden = true;
    state.pdfRenderTask = null;
    if (renderCompleted) {
      ocrController?.refreshOverlays();
      scheduleOcrAnalysis();
    }
  }
}

async function fitPdfRegion(save = true) {
  if (!state.pdfDocument) return;
  state.pdfSettings.zoom = DEFAULT_PDF_SETTINGS.zoom;
  updatePdfControls();

  const widthBeforeRender = elements.pdfViewport.clientWidth;
  await renderPdfRegion();
  await new Promise((resolve) => window.requestAnimationFrame(resolve));

  if (
    state.pdfDocument &&
    Math.abs(elements.pdfViewport.clientWidth - widthBeforeRender) > 1
  ) {
    await renderPdfRegion();
  }

  if (save) scheduleSave();
}

function setPdfSettings(settings, render = true) {
  const pageCount = state.pdfDocument?.numPages || 1;
  state.pdfSettings = {
    ...state.pdfSettings,
    ...settings,
  };
  state.pdfSettings.pageNumber = Math.min(
    Math.max(Math.round(state.pdfSettings.pageNumber), 1),
    pageCount,
  );
  state.pdfSettings.zoom = Math.min(
    Math.max(state.pdfSettings.zoom, 0.6),
    2.4,
  );
  updatePdfControls();
  updateCalibrationUi();
  if (render && state.pdfDocument) renderPdfRegion();
  scheduleSave();
}

function navigatePdf(direction) {
  const pageCount = state.pdfDocument?.numPages || 0;
  if (!pageCount) return;
  let { pageNumber, column } = state.pdfSettings;

  if (column === "full") {
    pageNumber += direction;
  } else if (direction > 0) {
    if (column === "left") column = "right";
    else {
      column = "left";
      pageNumber += 1;
    }
  } else if (column === "right") {
    column = "left";
  } else {
    column = "right";
    pageNumber -= 1;
  }

  setPdfSettings({
    pageNumber: Math.min(Math.max(pageNumber, 1), pageCount),
    column,
  });
}

function verifyPdfSignature(buffer) {
  const bytes = new Uint8Array(buffer.slice(0, 5));
  return String.fromCharCode(...bytes) === "%PDF-";
}

async function loadPdfBlob(blob, fileName, restoredSettings = {}) {
  showStatus(labels().loadingPdf, false, 120000);
  ocrController?.clear();
  state.pdfRenderGeometry = null;
  const buffer = await blob.arrayBuffer();
  if (!verifyPdfSignature(buffer)) throw new Error(labels().invalidPdf);

  state.pdfRenderTask?.cancel();
  await state.pdfDocument?.destroy();
  state.pdfLoadingTask?.destroy();
  state.pdfBlob = blob;
  state.pdfFileName = fileName;
  state.pdfSettings = {
    ...DEFAULT_PDF_SETTINGS,
    ...restoredSettings,
    zoom: DEFAULT_PDF_SETTINGS.zoom,
  };

  const loadingTask = getDocument({
    data: new Uint8Array(buffer),
    cMapUrl: `${PDF_ASSET_PATH}cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: `${PDF_ASSET_PATH}standard_fonts/`,
    wasmUrl: `${PDF_ASSET_PATH}wasm/`,
    isEvalSupported: false,
  });
  state.pdfLoadingTask = loadingTask;
  loadingTask.onPassword = (updatePassword, reason) => {
    const promptText =
      reason === PasswordResponses.INCORRECT_PASSWORD
        ? labels().pdfPasswordAgain
        : labels().pdfPassword;
    const password = window.prompt(promptText);
    if (password === null) {
      loadingTask.destroy();
      return;
    }
    updatePassword(password);
  };

  state.pdfDocument = await loadingTask.promise;
  state.pdfSettings.pageNumber = Math.min(
    Math.max(Number(state.pdfSettings.pageNumber) || 1, 1),
    state.pdfDocument.numPages,
  );
  elements.bookEmpty.hidden = true;
  elements.bookContent.hidden = false;
  elements.bookFileName.textContent = fileName;
  updatePdfControls();
  updateCalibrationUi();
  setFileActionLabels();
  await fitPdfRegion(false);
  setOcrStatus("scanning");
  showStatus(labels().pdfReady(state.pdfDocument.numPages));
}

async function handlePdfFile(file) {
  if (!file) return;
  if (
    file.size > MAX_PDF_SIZE ||
    (!file.name.toLowerCase().endsWith(".pdf") &&
      file.type !== "application/pdf")
  ) {
    showStatus(
      file.size > MAX_PDF_SIZE ? labels().pdfTooLarge : labels().invalidPdf,
      true,
    );
    return;
  }

  try {
    await loadPdfBlob(file, file.name);
    scheduleSave();
  } catch (error) {
    console.error(error);
    showStatus(error.message || labels().pdfError, true, 7000);
  } finally {
    elements.pdfInput.value = "";
  }
}

function isPdfFile(file) {
  return (
    file?.name.toLowerCase().endsWith(".pdf") ||
    file?.type === "application/pdf"
  );
}

function isPgnFile(file) {
  return (
    file?.name.toLowerCase().endsWith(".pgn") ||
    file?.type === "application/x-chess-pgn" ||
    file?.type?.includes("text")
  );
}

function addFileDropTarget(target, acceptsFile, handleFile, getErrorMessage) {
  let dragDepth = 0;
  const isFileDrag = (event) => event.dataTransfer?.types.includes("Files");

  target.addEventListener("dragenter", (event) => {
    if (!isFileDrag(event)) return;
    event.preventDefault();
    dragDepth += 1;
    target.classList.add("is-dragging");
  });
  target.addEventListener("dragover", (event) => {
    if (!isFileDrag(event)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    target.classList.add("is-dragging");
  });
  target.addEventListener("dragleave", (event) => {
    if (!isFileDrag(event)) return;
    dragDepth = Math.max(0, dragDepth - 1);
    if (!dragDepth) target.classList.remove("is-dragging");
  });
  target.addEventListener("drop", (event) => {
    event.preventDefault();
    event.stopPropagation();
    dragDepth = 0;
    target.classList.remove("is-dragging");
    const file = Array.from(event.dataTransfer?.files || []).find(acceptsFile);
    if (!file) {
      showStatus(getErrorMessage(), true);
      return;
    }
    handleFile(file);
  });
}

async function resetPdf() {
  const pdfDocument = state.pdfDocument;
  const pdfLoadingTask = state.pdfLoadingTask;

  state.pdfRenderTask?.cancel();
  state.pdfBlob = null;
  state.pdfFileName = "";
  state.pdfDocument = null;
  state.pdfLoadingTask = null;
  state.pdfRenderTask = null;
  state.pdfRenderGeometry = null;
  state.pdfSettings = { ...DEFAULT_PDF_SETTINGS };
  elements.pdfInput.value = "";
  elements.pdfCanvas.width = 1;
  elements.pdfCanvas.height = 1;
  elements.pdfCanvas.style.width = "1px";
  elements.pdfCanvas.style.height = "1px";
  elements.pdfLoading.hidden = true;
  elements.bookFileName.textContent = "";
  elements.bookEmpty.hidden = false;
  elements.bookContent.hidden = true;
  elements.pdfDiagramLayer.textContent = "";
  updatePdfControls();
  updateCalibrationUi();
  setFileActionLabels();
  ocrController?.clear();

  try {
    await pdfDocument?.destroy();
  } catch (error) {
    console.warn("PDF document cleanup did not complete.", error);
  }

  try {
    await pdfLoadingTask?.destroy();
  } catch (error) {
    console.warn("PDF loading task cleanup did not complete.", error);
  }
}

function serializeSession() {
  return {
    savedAt: new Date().toISOString(),
    pgnText: state.pgnText || null,
    pgnFileName: state.pgnFileName || null,
    selectedGameIndex: state.selectedGameIndex,
    selectedMoveId: state.selectedMove?.studyId || null,
    boardOrientation: state.boardOrientation,
    pdfBlob: state.pdfBlob || null,
    pdfFileName: state.pdfFileName || null,
    pdfSettings: { ...state.pdfSettings },
  };
}

function scheduleSave() {
  if (state.restoring) return;
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(async () => {
    if (!state.pgnText && !state.pdfBlob) return;
    try {
      await saveStoredSession(serializeSession());
    } catch (error) {
      console.warn("Study persistence failed.", error);
      if (!state.storageWarningShown) {
        state.storageWarningShown = true;
        showStatus(labels().storageError, true, 6500);
      }
    }
  }, 650);
}

async function restoreSession() {
  state.restoring = true;
  try {
    const session = await loadStoredSession();
    if (!session) return;
    state.boardOrientation =
      session.boardOrientation === "black" ? "black" : "white";
    await state.board.setOrientation(
      state.boardOrientation === "black" ? COLOR.black : COLOR.white,
      false,
    );

    if (session.pgnText) {
      await loadPgnContent(
        session.pgnText,
        session.pgnFileName || "study.pgn",
        {
          selectedGameIndex: session.selectedGameIndex,
          selectedMoveId: session.selectedMoveId,
        },
      );
    }
    if (session.pdfBlob) {
      await loadPdfBlob(
        session.pdfBlob,
        session.pdfFileName || "book.pdf",
        session.pdfSettings || {},
      );
    }
    showStatus(labels().restored);
  } catch (error) {
    console.warn("Stored study could not be restored.", error);
  } finally {
    state.restoring = false;
  }
}

async function clearStudy() {
  if (!window.confirm(labels().clearConfirm)) return;
  window.clearTimeout(saveTimer);
  resetPgn();
  await resetPdf();
  try {
    await clearStoredSession();
  } catch (error) {
    console.warn("Stored session could not be cleared.", error);
  }
  showStatus(labels().cleared);
}

function handleKeyboard(event) {
  const target = event.target;
  const isFormControl =
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement;
  if (isFormControl || event.altKey || event.ctrlKey || event.metaKey) return;

  if (elements.bookPanel.contains(document.activeElement)) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      navigatePdf(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      navigatePdf(1);
    }
    return;
  }

  const game = state.games[state.selectedGameIndex];
  if (!game) return;
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    selectMove(state.selectedMove?.previous?.studyId || "start");
  } else if (event.key === "ArrowRight") {
    const next = state.selectedMove ? state.selectedMove.next : game.moves[0];
    if (next) {
      event.preventDefault();
      selectMove(next.studyId);
    }
  } else if (event.key === "Home") {
    event.preventDefault();
    selectMove("start");
  } else if (event.key === "End") {
    const last = lastMoveFrom(state.selectedMove || game.moves[0]);
    if (last) {
      event.preventDefault();
      selectMove(last.studyId);
    }
  }
}

function addEventListeners() {
  elements.pdfInput.addEventListener("change", () =>
    handlePdfFile(elements.pdfInput.files[0]),
  );
  elements.pgnInput.addEventListener("change", () =>
    handlePgnFile(elements.pgnInput.files[0]),
  );
  elements.clearStudy.addEventListener("click", clearStudy);
  elements.engineDepth.addEventListener("change", () => {
    if (state.games[state.selectedGameIndex]) analyzeCurrentPosition();
  });
  elements.ocrScan.addEventListener("click", () => scheduleOcrAnalysis(true));
  elements.ocrScan.addEventListener("pointerenter", () =>
    ocrController?.warmUp(),
  );
  elements.ocrScan.addEventListener("focus", () => ocrController?.warmUp());
  elements.ocrDialogClose.addEventListener("click", () =>
    elements.ocrCandidateDialog.close(),
  );
  addFileDropTarget(
    elements.boardPanel,
    isPgnFile,
    handlePgnFile,
    () => labels().droppedPgnRequired,
  );
  addFileDropTarget(
    elements.bookPanel,
    isPdfFile,
    handlePdfFile,
    () => labels().droppedPdfRequired,
  );

  elements.tabs.forEach((tab) => {
    tab.addEventListener("click", () =>
      updateMobilePanel(tab.dataset.panelTarget),
    );
  });

  elements.gameSearch.addEventListener("input", renderGameList);
  elements.gameList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-game-index]");
    if (!button) return;
    selectGame(Number(button.dataset.gameIndex));
    updateMobilePanel("board");
  });

  elements.notation.addEventListener("click", (event) => {
    const button = event.target.closest("[data-move-id]");
    if (button) selectMove(button.dataset.moveId);
  });

  elements.moveFirst.addEventListener("click", () => selectMove("start"));
  elements.movePrevious.addEventListener("click", () =>
    selectMove(state.selectedMove?.previous?.studyId || "start"),
  );
  elements.moveNext.addEventListener("click", () => {
    const game = state.games[state.selectedGameIndex];
    const next = state.selectedMove ? state.selectedMove.next : game?.moves[0];
    if (next) selectMove(next.studyId);
  });
  elements.moveLast.addEventListener("click", () => {
    const game = state.games[state.selectedGameIndex];
    const last = lastMoveFrom(state.selectedMove || game?.moves[0]);
    if (last) selectMove(last.studyId);
  });
  elements.flipBoard.addEventListener("click", async () => {
    state.boardOrientation =
      state.boardOrientation === "white" ? "black" : "white";
    await state.board.setOrientation(
      state.boardOrientation === "white" ? COLOR.white : COLOR.black,
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
    renderEngineAnalysis();
    updateBoardMoveQuality();
    scheduleSave();
  });

  elements.pdfPrevious.addEventListener("click", () => navigatePdf(-1));
  elements.pdfNext.addEventListener("click", () => navigatePdf(1));
  elements.pdfPage.addEventListener("change", () =>
    setPdfSettings({ pageNumber: Number(elements.pdfPage.value) || 1 }),
  );
  elements.pdfColumnButtons.forEach((button) => {
    button.addEventListener("click", () =>
      setPdfSettings({ column: button.dataset.pdfColumn }),
    );
  });
  elements.pdfZoomOut.addEventListener("click", () =>
    setPdfSettings({ zoom: state.pdfSettings.zoom - 0.15 }),
  );
  elements.pdfZoomIn.addEventListener("click", () =>
    setPdfSettings({ zoom: state.pdfSettings.zoom + 0.15 }),
  );
  elements.pdfFit.addEventListener("click", () => fitPdfRegion());

  const updateCalibration = () => {
    setPdfSettings({
      splitRatio: Number(elements.pdfSplit.value) / 100,
      innerMargin: Number(elements.pdfInnerMargin.value) / 100,
      outerMargin: Number(elements.pdfOuterMargin.value) / 100,
    });
  };
  elements.pdfSplit.addEventListener("input", updateCalibration);
  elements.pdfInnerMargin.addEventListener("input", updateCalibration);
  elements.pdfOuterMargin.addEventListener("input", updateCalibration);
  elements.pdfResetCalibration.addEventListener("click", () =>
    setPdfSettings({
      splitRatio: DEFAULT_PDF_SETTINGS.splitRatio,
      innerMargin: DEFAULT_PDF_SETTINGS.innerMargin,
      outerMargin: DEFAULT_PDF_SETTINGS.outerMargin,
    }),
  );

  document.addEventListener("keydown", handleKeyboard);
  document.addEventListener("languageChange", () => {
    setFileActionLabels();
    renderGameList();
    renderNotation();
    updateMoveControls();
    updatePdfControls();
    ocrController?.refreshOverlays();
    renderEngineAnalysis();
  });

  document.addEventListener("dragover", (event) => {
    if (event.dataTransfer?.types.includes("Files")) event.preventDefault();
  });
  document.addEventListener("drop", (event) => {
    if (!event.dataTransfer?.files?.length) return;
    event.preventDefault();
  });

  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(renderPdfRegion, 180);
  });
  window.addEventListener("pagehide", () => {
    ocrController?.clear();
    engineController?.destroy();
    moveAnalysisController?.controller.destroy();
    state.pdfRenderTask?.cancel();
    state.pdfLoadingTask?.destroy();
  });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted && state.games[state.selectedGameIndex]) {
      analyzeCurrentPosition();
    }
  });
}

async function init() {
  elements = queryElements();
  engineController = createEngineController({
    workerUrl: ENGINE_WORKER_PATH,
    onState: setEngineState,
    onAnalysis: receiveEngineAnalysis,
  });
  const moveAnalysisCallbacks = { onState: () => {}, onAnalysis: () => {} };
  moveAnalysisController = {
    callbacks: moveAnalysisCallbacks,
    controller: createEngineController({
      workerUrl: ENGINE_WORKER_PATH,
      onState: (...args) => moveAnalysisController.callbacks.onState(...args),
      onAnalysis: (...args) => moveAnalysisController.callbacks.onAnalysis(...args),
    }),
  };
  ocrController = createOcrController({
    getPdfDocument: () => state.pdfDocument,
    getPageNumber: () => state.pdfSettings.pageNumber,
    getPositionIndex: () => state.positionIndex,
    modelUrl: OCR_MODEL_PATH,
    wasmPaths: OCR_WASM_PATH,
    onDetections: renderOcrDetections,
    onStatus: setOcrStatus,
    onResult: handleOcrResult,
  });
  createBoard();
  addEventListeners();
  updateCalibrationUi();
  updatePdfControls();
  updateMoveControls();
  setFileActionLabels();
  setOcrStatus("idle");
  renderEngineAnalysis();
  elements.boardEmpty.hidden = true;
  elements.boardContent.hidden = false;
  updateBoardPosition();
  await restoreSession();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
