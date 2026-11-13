// Minimal pure-TypeScript QR Code Generator (Byte mode, ECC Level L, Versions 1-4)
// Used to generate real scannable sample QR code images on canvas for jsQR verification.

const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) {
    GF_EXP[i] = GF_EXP[i - 255];
  }
})();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return GF_EXP[GF_LOG[a] + GF_LOG[b]];
}

function rsGeneratorPoly(degree: number): number[] {
  let poly = [1];
  for (let i = 0; i < degree; i++) {
    const next = new Array(poly.length + 1).fill(0);
    const factor = GF_EXP[i];
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j];
      next[j + 1] ^= gfMul(poly[j], factor);
    }
    poly = next;
  }
  return poly;
}

function rsRemainder(data: number[], ecCount: number): number[] {
  const gen = rsGeneratorPoly(ecCount);
  const res = new Array(ecCount).fill(0);
  for (const byte of data) {
    const factor = byte ^ res.shift()!;
    res.push(0);
    for (let i = 0; i < ecCount; i++) {
      res[i] ^= gfMul(gen[i + 1], factor);
    }
  }
  return res;
}

interface VersionSpec {
  version: number;
  size: number;
  dataBytes: number;
  ecBytes: number;
  alignPos: number[];
}

// Level L specs (single block for Versions 1-4)
const SPECS: VersionSpec[] = [
  { version: 1, size: 21, dataBytes: 19, ecBytes: 7, alignPos: [] },
  { version: 2, size: 25, dataBytes: 34, ecBytes: 10, alignPos: [6, 18] },
  { version: 3, size: 29, dataBytes: 55, ecBytes: 15, alignPos: [6, 22] },
  { version: 4, size: 33, dataBytes: 80, ecBytes: 20, alignPos: [6, 26] },
];

export function encodeQrMatrix(text: string): boolean[][] {
  const bytes = Array.from(new TextEncoder().encode(text));
  const spec = SPECS.find((s) => bytes.length + 2 <= s.dataBytes) || SPECS[SPECS.length - 1];
  const clampedBytes = bytes.slice(0, spec.dataBytes - 2);

  // Bit stream: 0100 (byte mode), 8-bit length, payload, 0000 terminator
  const bits: number[] = [];
  const pushBits = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) {
      bits.push((val >> i) & 1);
    }
  };

  pushBits(0b0100, 4);
  pushBits(clampedBytes.length, 8);
  for (const b of clampedBytes) pushBits(b, 8);
  pushBits(0, Math.min(4, spec.dataBytes * 8 - bits.length));
  while (bits.length % 8 !== 0) bits.push(0);

  const codewords: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let b = 0; b < 8; b++) byte = (byte << 1) | bits[i + b];
    codewords.push(byte);
  }
  const padBytes = [0xec, 0x11];
  let padIdx = 0;
  while (codewords.length < spec.dataBytes) {
    codewords.push(padBytes[padIdx % 2]);
    padIdx++;
  }

  const ec = rsRemainder(codewords, spec.ecBytes);
  const fullCodewords = [...codewords, ...ec];

  const size = spec.size;
  const grid: (boolean | null)[][] = Array.from({ length: size }, () =>
    Array(size).fill(null)
  );
  const reserved: boolean[][] = Array.from({ length: size }, () =>
    Array(size).fill(false)
  );

  const setModule = (r: number, c: number, dark: boolean, isFunc = true) => {
    if (r < 0 || r >= size || c < 0 || c >= size) return;
    grid[r][c] = dark;
    if (isFunc) reserved[r][c] = true;
  };

  const drawFinder = (top: number, left: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const rr = top + r;
        const cc = left + c;
        if (rr < 0 || rr >= size || cc < 0 || cc >= size) continue;
        const inOuter = r >= 0 && r <= 6 && c >= 0 && c <= 6;
        const dark =
          inOuter &&
          (r === 0 ||
            r === 6 ||
            c === 0 ||
            c === 6 ||
            (r >= 2 && r <= 4 && c >= 2 && c <= 4));
        setModule(rr, cc, dark, true);
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // Alignment patterns
  if (spec.alignPos.length > 0) {
    for (const ar of spec.alignPos) {
      for (const ac of spec.alignPos) {
        if (reserved[ar][ac]) continue;
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            const dark =
              Math.max(Math.abs(dr), Math.abs(dc)) === 2 || (dr === 0 && dc === 0);
            setModule(ar + dr, ac + dc, dark, true);
          }
        }
      }
    }
  }

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    setModule(6, i, i % 2 === 0, true);
    setModule(i, 6, i % 2 === 0, true);
  }

  // Dark module
  setModule(size - 8, 8, true, true);

  // Reserve format info cells
  for (let i = 0; i < 9; i++) {
    if (i !== 6) {
      reserved[8][i] = true;
      reserved[i][8] = true;
    }
  }
  for (let i = 0; i < 8; i++) {
    reserved[8][size - 1 - i] = true;
    reserved[size - 1 - i][8] = true;
  }

  // Place data bits (mask 0: (r + c) % 2 === 0)
  const bitStream: number[] = [];
  for (const cw of fullCodewords) {
    for (let i = 7; i >= 0; i--) bitStream.push((cw >> i) & 1);
  }

  let bitIdx = 0;
  let upward = true;
  for (let col = size - 1; col >= 1; col -= 2) {
    if (col === 6) col--;
    for (let step = 0; step < size; step++) {
      const r = upward ? size - 1 - step : step;
      for (const dc of [0, -1]) {
        const c = col + dc;
        if (!reserved[r][c]) {
          const rawBit = bitIdx < bitStream.length ? bitStream[bitIdx++] : 0;
          const masked = rawBit ^ ((r + c) % 2 === 0 ? 1 : 0);
          grid[r][c] = masked === 1;
        }
      }
    }
    upward = !upward;
  }

  // Format bits for ECC Level L (01) + Mask 0 (000) -> 15-bit BCH + XOR 0x5412
  // Precomputed 15-bit format string for Level L, Mask 0: 111011111000100
  const formatBits = 0b111011111000100;
  for (let i = 0; i < 15; i++) {
    const dark = ((formatBits >> (14 - i)) & 1) === 1;
    // Around top-left finder
    if (i < 6) grid[8][i] = dark;
    else if (i < 8) grid[8][i + 1] = dark;
    else grid[14 - i][8] = dark;

    // Split top-right & bottom-left
    if (i < 8) grid[size - 1 - i][8] = dark;
    else grid[8][size - 15 + i] = dark;
  }

  return grid.map((row) => row.map((cell) => Boolean(cell)));
}

export function renderQrToDataUrl(text: string, scale = 8, margin = 4): string {
  const matrix = encodeQrMatrix(text);
  const size = matrix.length;
  const total = (size + margin * 2) * scale;
  const canvas = document.createElement('canvas');
  canvas.width = total;
  canvas.height = total;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, total, total);
  ctx.fillStyle = '#0F172A';

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (matrix[r][c]) {
        ctx.fillRect((c + margin) * scale, (r + margin) * scale, scale, scale);
      }
    }
  }
  return canvas.toDataURL('image/png');
}
