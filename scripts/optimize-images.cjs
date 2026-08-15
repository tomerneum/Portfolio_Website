// Generates responsive WebP variants for every downloaded image so the site
// ships tens of megabytes instead of hundreds. Originals stay in public/images;
// the site references the variants in public/img.
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'public', 'images');
const OUT = path.join(ROOT, 'public', 'img');
const WIDTHS = [480, 960, 1600, 2400];

fs.mkdirSync(OUT, { recursive: true });

const files = fs.readdirSync(SRC).filter((f) => /\.(jpe?g|png|gif|webp)$/i.test(f));

(async () => {
  let done = 0;
  const manifest = {};
  const CONCURRENCY = 4;
  let cursor = 0;

  async function worker() {
    while (cursor < files.length) {
      const file = files[cursor++];
      const base = file.replace(/\.[^.]+$/, '');
      const isGif = /\.gif$/i.test(file);
      const srcPath = path.join(SRC, file);

      try {
        const meta = await sharp(srcPath).metadata();
        const entry = { w: meta.width, h: meta.height, variants: [], animated: isGif && (meta.pages || 1) > 1 };

        // Animated GIFs are left alone - re-encoding them here would drop the
        // animation, and they get replaced by real video files anyway.
        if (entry.animated) {
          entry.src = '/images/' + file;
          manifest[file] = entry;
          done++;
          continue;
        }

        for (const w of WIDTHS) {
          if (meta.width && meta.width < w * 0.9) continue;
          const name = `${base}-${w}.webp`;
          const dest = path.join(OUT, name);
          if (!fs.existsSync(dest)) {
            await sharp(srcPath).resize({ width: w, withoutEnlargement: true }).webp({ quality: 82 }).toFile(dest);
          }
          entry.variants.push({ w, src: '/img/' + name });
        }

        // Always emit at least one variant, even for small source images.
        if (!entry.variants.length) {
          const name = `${base}.webp`;
          const dest = path.join(OUT, name);
          if (!fs.existsSync(dest)) await sharp(srcPath).webp({ quality: 82 }).toFile(dest);
          entry.variants.push({ w: meta.width || 960, src: '/img/' + name });
        }

        entry.src = entry.variants[entry.variants.length - 1].src;
        manifest[file] = entry;
        done++;
        if (done % 20 === 0) console.log(`  ${done}/${files.length}`);
      } catch (e) {
        console.log('  FAIL', file, e.message);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  fs.writeFileSync(path.join(ROOT, 'image-manifest.json'), JSON.stringify(manifest, null, 2));

  const size = (dir) =>
    fs.readdirSync(dir).reduce((n, f) => n + fs.statSync(path.join(dir, f)).size, 0) / 1048576;
  console.log(`done: ${done}/${files.length}`);
  console.log(`originals: ${size(SRC).toFixed(1)} MB -> webp: ${size(OUT).toFixed(1)} MB`);
})();
