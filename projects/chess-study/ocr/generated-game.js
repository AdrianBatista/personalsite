function escapePgnTag(value) {
  return String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

export function appendPgnRecord(existingPgn, record) {
  const existing = String(existingPgn || "").trim();
  const next = String(record || "").trim();
  return existing ? `${existing}\n\n${next}` : next;
}

export function buildOcrPositionPgn(
  fen,
  { pageNumber = 1, diagramNumber = 1 } = {},
) {
  const page = Math.max(1, Number(pageNumber) || 1);
  const diagram = Math.max(1, Number(diagramNumber) || 1);

  return [
    '[Event "PDF diagram"]',
    '[Site "?"]',
    '[Date "????.??.??"]',
    '[Round "?"]',
    '[White "Recognized position"]',
    `[Black "${escapePgnTag(`Page ${page}`)}"]`,
    '[Result "*"]',
    '[SetUp "1"]',
    `[FEN "${escapePgnTag(fen)}"]`,
    `[Source "${escapePgnTag(`PDF page ${page}, diagram ${diagram}`)}"]`,
    "",
    "*",
  ].join("\n");
}
