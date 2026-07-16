const randomBytes = (length) => {
  if (!globalThis.crypto?.getRandomValues) throw new Error("Secure random generation is unavailable in this browser.");
  return globalThis.crypto.getRandomValues(new Uint8Array(length));
};

const hex = (bytes) => [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
const format = (bytes) => `${hex(bytes.slice(0, 4))}-${hex(bytes.slice(4, 6))}-${hex(bytes.slice(6, 8))}-${hex(bytes.slice(8, 10))}-${hex(bytes.slice(10, 16))}`;

function uuidV4() { const bytes = randomBytes(16); bytes[6] = (bytes[6] & 0x0f) | 0x40; bytes[8] = (bytes[8] & 0x3f) | 0x80; return format(bytes); }

function uuidV7() {
  const bytes = randomBytes(16); let timestamp = BigInt(Date.now());
  for (let index = 5; index >= 0; index -= 1) { bytes[index] = Number(timestamp & 0xffn); timestamp >>= 8n; }
  bytes[6] = (bytes[6] & 0x0f) | 0x70; bytes[8] = (bytes[8] & 0x3f) | 0x80;
  return format(bytes);
}

let v1Counter = 0;
function uuidV1() {
  const unixToGregorian = 12219292800000n;
  const timestamp = (BigInt(Date.now()) + unixToGregorian) * 10000n + BigInt(v1Counter++ % 10000);
  const clockSequence = randomBytes(2); const node = randomBytes(6); node[0] |= 0x01;
  const low = Number(timestamp & 0xffffffffn); const mid = Number((timestamp >> 32n) & 0xffffn); const high = Number((timestamp >> 48n) & 0x0fffn);
  const bytes = new Uint8Array(16);
  bytes.set([(low >>> 24) & 255, (low >>> 16) & 255, (low >>> 8) & 255, low & 255, (mid >>> 8) & 255, mid & 255, 0x10 | ((high >>> 8) & 15), high & 255, 0x80 | (clockSequence[0] & 0x3f), clockSequence[1]], 0); bytes.set(node, 10);
  return format(bytes);
}

const generators = { "1": uuidV1, "4": uuidV4, "7": uuidV7 };
const isPortuguese = () => document.documentElement.lang.startsWith("pt");

function initGenerator() {
  const form = document.getElementById("uuid-form"); const output = document.getElementById("uuid-output"); const status = document.getElementById("uuid-status");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    try {
      const version = form.elements.version.value; const count = Number(form.elements.count.value); const values = Array.from({ length: count }, generators[version]);
      output.value = values.join("\n"); status.textContent = isPortuguese() ? `${count} UUID(s) gerado(s).` : `${count} UUID(s) generated.`;
    } catch (error) { status.textContent = error.message; }
  });
  document.getElementById("copy-uuids").addEventListener("click", async () => {
    if (!output.value) return;
    try { await navigator.clipboard.writeText(output.value); status.textContent = isPortuguese() ? "UUIDs copiados para a área de transferência." : "UUIDs copied to clipboard."; } catch { output.select(); document.execCommand("copy"); status.textContent = isPortuguese() ? "UUIDs copiados para a área de transferência." : "UUIDs copied to clipboard."; }
  });
}
document.addEventListener("DOMContentLoaded", initGenerator);
