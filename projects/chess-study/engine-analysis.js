import { Chess } from "./vendor/chess-mjs/src/Chess.js";

export function parseEngineInfo(line) {
  if (!String(line).startsWith("info ")) return null;

  const depthMatch = line.match(/\bdepth (\d+)/);
  const scoreMatch = line.match(/\bscore (cp|mate) (-?\d+)/);
  const pvMatch = line.match(/\bpv (.+)$/);
  if (!depthMatch || !scoreMatch || !pvMatch) return null;

  return {
    depth: Number(depthMatch[1]),
    multipv: Number(line.match(/\bmultipv (\d+)/)?.[1] || 1),
    scoreType: scoreMatch[1],
    scoreValue: Number(scoreMatch[2]),
    nodes: Number(line.match(/\bnodes (\d+)/)?.[1] || 0),
    nps: Number(line.match(/\bnps (\d+)/)?.[1] || 0),
    pv: pvMatch[1].trim().split(/\s+/),
  };
}

export function normalizeEvaluationForWhite(info, fen) {
  const activeColor = String(fen).trim().split(/\s+/)[1];
  return {
    type: info.scoreType,
    value: info.scoreValue * (activeColor === "b" ? -1 : 1),
  };
}

export function formatEvaluation(evaluation) {
  if (!evaluation) return "—";
  if (evaluation.type === "mate") {
    if (evaluation.value === 0) return "#0";
    return `${evaluation.value > 0 ? "+" : "−"}#${Math.abs(evaluation.value)}`;
  }
  const pawns = evaluation.value / 100;
  if (Math.abs(pawns) < 0.005) return "0.00";
  return `${pawns > 0 ? "+" : "−"}${Math.abs(pawns).toFixed(2)}`;
}

export function evaluationToWhiteShare(evaluation) {
  if (!evaluation) return 50;
  if (evaluation.type === "mate") {
    if (evaluation.value === 0) return 50;
    return evaluation.value > 0 ? 100 : 0;
  }
  const pawns = evaluation.value / 100;
  return Math.max(0, Math.min(100, 50 + 45 * Math.tanh(pawns / 4)));
}

export function uciVariationToSan(fen, variation, chess960 = false) {
  const chess = new Chess(fen, { chess960: Boolean(chess960) });
  const moves = [];

  for (const uci of variation) {
    const match = String(uci).match(
      /^([a-h][1-8])([a-h][1-8])([qrbn])?$/,
    );
    if (!match) break;
    try {
      const move = chess.move(
        {
          from: match[1],
          to: match[2],
          ...(match[3] ? { promotion: match[3] } : {}),
        },
        { sloppy: true },
      );
      if (!move) break;
      moves.push(move.san);
    } catch {
      break;
    }
  }

  return moves.join(" ");
}

export function createEngineController({
  workerUrl,
  onState = () => {},
  onAnalysis = () => {},
  WorkerClass = globalThis.Worker,
}) {
  let worker = null;
  let uciAcknowledged = false;
  let waitingForReady = false;
  let requestedSearch = null;
  let preparingSearch = null;
  let activeSearch = null;
  let acceptingOutput = false;
  let lines = new Map();

  const post = (command) => worker?.postMessage(command);

  function resetWorkerState() {
    worker = null;
    uciAcknowledged = false;
    waitingForReady = false;
    requestedSearch = null;
    preparingSearch = null;
    activeSearch = null;
    acceptingOutput = false;
    lines = new Map();
  }

  function emitLines(status = "analyzing") {
    const results = Array.from(lines.values())
      .sort((left, right) => left.multipv - right.multipv)
      .map((info) => ({
        ...info,
        evaluation: normalizeEvaluationForWhite(info, activeSearch.fen),
        san: uciVariationToSan(
          activeSearch.fen,
          info.pv,
          activeSearch.chess960,
        ),
      }));
    onAnalysis(results, {
      status,
      depth: Math.max(0, ...results.map((line) => line.depth)),
      targetDepth: activeSearch.depth,
    });
  }

  function startPreparedSearch() {
    activeSearch = preparingSearch;
    preparingSearch = null;
    lines = new Map();
    acceptingOutput = true;
    onAnalysis([], {
      status: "analyzing",
      depth: 0,
      targetDepth: activeSearch.depth,
    });
    onState("analyzing");
    post(`position fen ${activeSearch.fen}`);
    post(`go depth ${activeSearch.depth}`);
  }

  function prepareSearch() {
    if (!uciAcknowledged || waitingForReady || !requestedSearch) return;
    preparingSearch = requestedSearch;
    requestedSearch = null;
    acceptingOutput = false;
    waitingForReady = true;
    post("stop");
    post(`setoption name MultiPV value ${preparingSearch.multiPv}`);
    post(
      `setoption name UCI_Chess960 value ${preparingSearch.chess960 ? "true" : "false"}`,
    );
    post("isready");
  }

  function handleLine(rawLine) {
    const line = String(rawLine).trim();
    if (!line) return;

    if (line === "uciok") {
      uciAcknowledged = true;
      post("setoption name Hash value 16");
      prepareSearch();
      return;
    }

    if (line === "readyok" && waitingForReady) {
      waitingForReady = false;
      if (requestedSearch) {
        prepareSearch();
      } else if (preparingSearch) {
        startPreparedSearch();
      }
      return;
    }

    if (line.startsWith("bestmove ") && acceptingOutput) {
      acceptingOutput = false;
      emitLines("complete");
      onState("complete");
      return;
    }

    if (!acceptingOutput || !activeSearch) return;
    const info = parseEngineInfo(line);
    if (!info || info.multipv > activeSearch.multiPv) return;
    const previous = lines.get(info.multipv);
    if (!previous || info.depth >= previous.depth) {
      lines.set(info.multipv, info);
      emitLines();
    }
  }

  function ensureWorker() {
    if (worker) return;
    onState("loading");
    try {
      worker = new WorkerClass(workerUrl);
      worker.addEventListener("message", (event) => {
        String(event.data)
          .split(/\r?\n/)
          .forEach(handleLine);
      });
      const activeWorker = worker;
      worker.addEventListener("error", (event) => {
        activeWorker.terminate();
        if (worker === activeWorker) resetWorkerState();
        acceptingOutput = false;
        onState("error", event.message || "Stockfish worker failed.");
      });
      post("uci");
    } catch (error) {
      onState("error", error.message);
    }
  }

  function analyze({ fen, depth = 16, multiPv = 3, chess960 = false }) {
    requestedSearch = {
      fen,
      depth: Math.min(24, Math.max(8, Number(depth) || 16)),
      multiPv: Math.min(5, Math.max(1, Number(multiPv) || 3)),
      chess960: Boolean(chess960),
    };
    onState(worker ? "analyzing" : "loading");
    ensureWorker();
    prepareSearch();
  }

  function stop() {
    requestedSearch = null;
    preparingSearch = null;
    activeSearch = null;
    acceptingOutput = false;
    waitingForReady = false;
    post("stop");
    onState("stopped");
  }

  function destroy() {
    stop();
    post("quit");
    worker?.terminate();
    resetWorkerState();
  }

  return { analyze, destroy, stop };
}
