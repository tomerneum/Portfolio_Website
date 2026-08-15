/**
 * Converts the animated GIFs that came from Adobe Portfolio into H.264 MP4.
 *
 * These GIFs are the motion previews on the original site and they are by far
 * the heaviest thing on it — around 120 MB for thirteen clips. As silent
 * looping MP4s they are typically far smaller and start playing sooner, which
 * is the whole point of moving off Portfolio.
 *
 * Each animated entry in image-manifest.json gains:
 *   video  - the encoded /img/<name>.mp4
 *   src    - a WebP poster frame, shown until the video can play
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const ffmpeg = require('ffmpeg-static');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'public', 'images');
const OUT = path.join(ROOT, 'public', 'img');
const MANIFEST = path.join(ROOT, 'image-manifest.json');

(async () => {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  const animated = Object.entries(manifest).filter(([, v]) => v.animated);

  if (!animated.length) {
    console.log('No animated images to convert.');
    return;
  }

  let before = 0;
  let after = 0;
  let converted = 0;

  for (const [file, entry] of animated) {
    const base = file.replace(/\.[^.]+$/, '');
    const input = path.join(SRC, file);
    const mp4 = path.join(OUT, `${base}.mp4`);
    const poster = path.join(OUT, `${base}-poster.webp`);

    if (!fs.existsSync(input)) {
      console.log(`  skip ${base} (source missing)`);
      continue;
    }

    const srcBytes = fs.statSync(input).size;

    try {
      execFileSync(
        ffmpeg,
        [
          '-y',
          '-i', input,
          '-an',
          // yuv420p needs even dimensions; GIFs are frequently odd-sized.
          '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
          '-c:v', 'libx264',
          '-profile:v', 'main',
          '-pix_fmt', 'yuv420p',
          '-crf', '27',
          '-preset', 'slow',
          '-movflags', '+faststart',
          mp4,
        ],
        { stdio: ['ignore', 'ignore', 'pipe'] }
      );
    } catch (e) {
      const detail = String(e.stderr || e.message).trim().split('\n').slice(-2).join(' ');
      console.log(`  FAILED ${base}: ${detail.slice(0, 160)}`);
      continue;
    }

    // First frame of the GIF becomes the poster, so the tile is never empty.
    try {
      await sharp(input).webp({ quality: 80 }).toFile(poster);
      entry.src = `/img/${base}-poster.webp`;
    } catch {
      // Poster is optional; the video's own first frame still shows.
    }

    const outBytes = fs.statSync(mp4).size;
    before += srcBytes;
    after += outBytes;
    converted++;

    entry.video = `/img/${base}.mp4`;

    console.log(
      `  ${base.slice(0, 20)}… ${(srcBytes / 1048576).toFixed(1)} MB -> ${(outBytes / 1048576).toFixed(2)} MB`
    );
  }

  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));

  console.log(
    `\nConverted ${converted}/${animated.length}: ${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(1)} MB`
  );
  console.log('image-manifest.json updated.');
})();
