const TAG_PAIR_PATTERN =
  /^\s*\[([A-Za-z][A-Za-z0-9_]*)\s+"(?:\\.|[^"\\])*"\]\s*$/;

const STANDARD_TAGS = new Set([
  "Event",
  "Site",
  "Date",
  "Round",
  "White",
  "Black",
  "Result",
]);

function visibleLineContent(line, startsInsideBraceComment) {
  let visible = "";
  let insideBraceComment = startsInsideBraceComment;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (insideBraceComment) {
      if (character === "}") insideBraceComment = false;
      continue;
    }
    if (character === "{") {
      insideBraceComment = true;
    } else if (character === ";") {
      break;
    } else {
      visible += character;
    }
  }

  return { visible, insideBraceComment };
}

function isTokenBoundary(character) {
  return !character || !/[A-Za-z0-9]/.test(character);
}

function normalizeCastlingNotation(movetext) {
  let normalized = "";
  let insideBraceComment = false;
  let insideLineComment = false;

  for (let index = 0; index < movetext.length; index += 1) {
    const character = movetext[index];
    if (character === "\n") {
      insideLineComment = false;
      normalized += character;
      continue;
    }
    if (insideLineComment) {
      normalized += character;
      continue;
    }
    if (insideBraceComment) {
      normalized += character;
      if (character === "}") insideBraceComment = false;
      continue;
    }
    if (character === "{") {
      insideBraceComment = true;
      normalized += character;
      continue;
    }
    if (character === ";") {
      insideLineComment = true;
      normalized += character;
      continue;
    }

    const previous = movetext[index - 1];
    const longCastle = movetext.slice(index, index + 5);
    const shortCastle = movetext.slice(index, index + 3);
    if (
      /^(?:0|o)-(?:0|o)-(?:0|o)$/i.test(longCastle) &&
      isTokenBoundary(previous) &&
      isTokenBoundary(movetext[index + 5])
    ) {
      normalized += "O-O-O";
      index += 4;
    } else if (
      /^(?:0|o)-(?:0|o)$/i.test(shortCastle) &&
      isTokenBoundary(previous) &&
      isTokenBoundary(movetext[index + 3])
    ) {
      normalized += "O-O";
      index += 2;
    } else {
      normalized += character;
    }
  }

  return normalized;
}

function normalizeRecord(record) {
  const lines = record.trim().split("\n");
  let insideBraceComment = false;
  let lastHeaderLine = -1;
  let foundHeader = false;

  for (let index = 0; index < lines.length; index += 1) {
    const analysis = visibleLineContent(lines[index], insideBraceComment);
    insideBraceComment = analysis.insideBraceComment;
    const visible = analysis.visible.trim();
    if (!visible) continue;

    if (TAG_PAIR_PATTERN.test(visible) && lastHeaderLine < index) {
      foundHeader = true;
      lastHeaderLine = index;
      continue;
    }
    if (foundHeader) break;
  }

  if (!foundHeader || lastHeaderLine < 0) return record.trim();

  const header = lines.slice(0, lastHeaderLine + 1).join("\n").trimEnd();
  const moves = lines.slice(lastHeaderLine + 1).join("\n").trim();
  return moves ? `${header}\n\n${normalizeCastlingNotation(moves)}` : header;
}

/**
 * Splits a PGN database without requiring blank lines between tag pairs,
 * movetext, or adjacent games. A new tag-pair block after movetext always
 * starts a new game. Repeated standard header tags also split header-only
 * records.
 */
export function splitPgnRecords(text) {
  const lines = String(text || "")
    .replace(/^\uFEFF/, "")
    .replace(/\r\n?/g, "\n")
    .split("\n");
  const records = [];
  let currentLines = [];
  let currentTags = new Set();
  let hasMovetext = false;
  let insideBraceComment = false;

  const flush = () => {
    const record = currentLines.join("\n").trim();
    if (record) records.push(normalizeRecord(record));
    currentLines = [];
    currentTags = new Set();
    hasMovetext = false;
  };

  lines.forEach((line) => {
    const analysis = visibleLineContent(line, insideBraceComment);
    insideBraceComment = analysis.insideBraceComment;
    const visible = analysis.visible.trim();
    const tagMatch = visible.match(TAG_PAIR_PATTERN);

    if (tagMatch) {
      const tagName = tagMatch[1];
      const repeatedStandardTag =
        STANDARD_TAGS.has(tagName) && currentTags.has(tagName);
      if (hasMovetext || repeatedStandardTag) flush();
      currentLines.push(line);
      currentTags.add(tagName);
      return;
    }

    if (currentLines.length > 0 || visible) currentLines.push(line);
    if (visible && !visible.startsWith("%")) hasMovetext = true;
  });

  flush();
  return records;
}
