import sharp from "sharp";

const [input, output] = process.argv.slice(2);

if (!input || !output) {
  throw new Error("Usage: node scripts/removeChroma.mjs <input.png> <output.webp>");
}

const { data, info } = await sharp(input)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const borderRed = [];
const borderGreen = [];
const borderBlue = [];
const sample = (x, y) => {
  const offset = (y * info.width + x) * 4;
  borderRed.push(data[offset]);
  borderGreen.push(data[offset + 1]);
  borderBlue.push(data[offset + 2]);
};

for (let x = 0; x < info.width; x += 4) {
  sample(x, 0);
  sample(x, info.height - 1);
}
for (let y = 0; y < info.height; y += 4) {
  sample(0, y);
  sample(info.width - 1, y);
}

const median = (values) => values.sort((a, b) => a - b)[Math.floor(values.length / 2)];
const keyRed = median(borderRed);
const keyGreen = median(borderGreen);
const keyBlue = median(borderBlue);

for (let index = 0; index < data.length; index += 4) {
  const red = data[index];
  const green = data[index + 1];
  const blue = data[index + 2];

  const distance = Math.hypot(red - keyRed, green - keyGreen, blue - keyBlue);
  const normalized = Math.max(0, Math.min(1, (distance - 28) / 97));
  const alpha = normalized * normalized * (3 - 2 * normalized);

  if (alpha < 0.025) {
    data[index] = 0;
    data[index + 1] = 0;
    data[index + 2] = 0;
    data[index + 3] = 0;
    continue;
  }

  // Remove magenta spill from antialiased edge pixels.
  if (alpha < 0.98) {
    data[index] = Math.max(0, Math.min(255, (red - keyRed * (1 - alpha)) / alpha));
    data[index + 1] = Math.max(0, Math.min(255, (green - keyGreen * (1 - alpha)) / alpha));
    data[index + 2] = Math.max(0, Math.min(255, (blue - keyBlue * (1 - alpha)) / alpha));
  }
  data[index + 3] = Math.round(alpha * 255);
}

await sharp(data, { raw: info })
  .resize({ height: 1200, fit: "inside", withoutEnlargement: true })
  .webp({ quality: 88, alphaQuality: 100, effort: 6 })
  .toFile(output);

const metadata = await sharp(output).metadata();
if (!metadata.hasAlpha) throw new Error(`Transparency validation failed for ${output}`);

console.log(`${output}: ${metadata.width}x${metadata.height}, alpha=${metadata.hasAlpha}`);
