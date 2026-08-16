/**
 * Replaces a project's grid cover with a crop of one of its own images.
 *
 * Adobe Portfolio's auto-generated 16:9 covers sometimes miss the point of a
 * project. This takes any image already in public/images, crops it, emits the
 * usual WebP variants, and repoints content.json at the result.
 *
 *   node scripts/set-cover.cjs <slug> <source-filename> [top] [height]
 *
 * `top`/`height` are pixel offsets into the source. Omit them for a centred
 * 3:2 crop at full width.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'public', 'images');
const OUT = path.join(ROOT, 'public', 'img');
const WIDTHS = [480, 960, 1600, 2400];

const [slug, file, topArg, heightArg] = process.argv.slice(2);

if (!slug || !file) {
  console.error('usage: node scripts/set-cover.cjs <slug> <source-filename> [top] [height]');
  process.exit(1);
}

(async () => {
  const input = path.join(SRC, file);
  if (!fs.existsSync(input)) {
    console.error(`no such image: ${input}`);
    process.exit(1);
  }

  const meta = await sharp(input).metadata();
  const width = meta.width;
  const height = heightArg ? Number(heightArg) : Math.round(width / 1.5);
  const top = topArg !== undefined ? Number(topArg) : Math.max(0, Math.round((meta.height - height) / 2));

  if (top + height > meta.height) {
    console.error(`crop runs past the bottom: ${top}+${height} > ${meta.height}`);
    process.exit(1);
  }

  const base = `${slug}-cover`;
  const cropped = path.join(SRC, `${base}.jpg`);

  await sharp(input).extract({ left: 0, top, width, height }).jpeg({ quality: 92 }).toFile(cropped);
  console.log(`cropped ${meta.width}x${meta.height} -> ${width}x${height} at y=${top}`);

  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'image-manifest.json'), 'utf8'));
  const entry = { w: width, h: height, variants: [], animated: false };

  for (const w of WIDTHS) {
    if (width < w * 0.9) continue;
    const name = `${base}-${w}.webp`;
    await sharp(cropped).resize({ width: w, withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(OUT, name));
    entry.variants.push({ w, src: `/img/${name}` });
  }

  if (!entry.variants.length) {
    const name = `${base}.webp`;
    await sharp(cropped).webp({ quality: 82 }).toFile(path.join(OUT, name));
    entry.variants.push({ w: width, src: `/img/${name}` });
  }

  entry.src = entry.variants[entry.variants.length - 1].src;
  manifest[`${base}.jpg`] = entry;
  fs.writeFileSync(path.join(ROOT, 'image-manifest.json'), JSON.stringify(manifest, null, 2));

  const contentPath = path.join(ROOT, 'content.json');
  const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
  const project = content.projects.find((p) => p.slug === slug);
  if (!project) {
    console.error(`no project with slug "${slug}"`);
    process.exit(1);
  }
  project.cover = `/images/${base}.jpg`;
  fs.writeFileSync(contentPath, JSON.stringify(content, null, 2));

  console.log(`${slug} cover -> ${entry.src} (${entry.variants.length} variants)`);
})();
