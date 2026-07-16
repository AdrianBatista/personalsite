import test from "node:test";
import assert from "node:assert/strict";
import { Pgn } from "./vendor/cm-pgn/src/Pgn.js";
import { splitPgnRecords } from "./pgn-records.js";

const headers = (number) => `[Event "Chapter 1 (${number})"]
[Site "Local"]
[Date "2026.07.16"]
[Round "${number}"]
[White "Chapter 1 (${number})"]
[Black "Game ${number}"]
[Result "*"]`;

test("splits standard PGNs with conventional blank lines", () => {
  const database = `${headers(1)}

1. e4 e5 *

${headers(2)}

1. d4 d5 *`;

  assert.equal(splitPgnRecords(database).length, 2);
});

test("splits compact exports without blank lines between records", () => {
  const database = `${headers(1)}
1. e4 e5 *
${headers(2)}
1. d4 d5 *
${headers(3)}
1. c4 e5 *
${headers(4)}
1. Nf3 d5 *`;

  const records = splitPgnRecords(database);
  assert.equal(records.length, 4);
  assert.deepEqual(
    records.map((record) => new Pgn(record).header.tags.Black),
    ["Game 1", "Game 2", "Game 3", "Game 4"],
  );
});

test("does not split on blank lines or tag-like text inside movetext comments", () => {
  const database = `${headers(1)}

1. e4 e5

{A multiline comment
[Event "Not another game"]
still belongs to game one.}
2. Nf3 Nc6 *
${headers(2)}
1. d4 d5 *`;

  const records = splitPgnRecords(database);
  assert.equal(records.length, 2);
  assert.match(records[0], /Not another game/);
});

test("preserves every record in a large compact database", () => {
  const database = Array.from(
    { length: 122 },
    (_, index) => `${headers(index + 1)}\n1. e4 e5 *`,
  ).join("\n");
  const records = splitPgnRecords(database);

  assert.equal(records.length, 122);
  assert.equal(new Pgn(records[1]).header.tags.Black, "Game 2");
  assert.equal(new Pgn(records[121]).header.tags.Black, "Game 122");
});

test("normalizes zero and lowercase castling notation outside comments", () => {
  const database = `${headers(1)}
1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. 0-0 Be7
6. Re1 b5 7. Bb3 d6 8. c3 0-0 9. h3 *
${headers(2)}
1. d4 d5 2. Nc3 Nf6 3. Bf4 e6 4. Qd2 Be7 5. o-o-o 0-0
{Keep the original 0-0 text in this comment.} *`;

  const records = splitPgnRecords(database);
  assert.equal(records.length, 2);
  assert.doesNotThrow(() => new Pgn(records[0]));
  assert.doesNotThrow(() => new Pgn(records[1]));
  assert.match(records[0], /5\. O-O Be7/);
  assert.match(records[1], /5\. O-O-O O-O/);
  assert.match(records[1], /original 0-0 text/);
});
