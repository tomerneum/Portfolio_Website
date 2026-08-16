/**
 * Turns source video files into web-ready loops for the grid.
 *
 * Drop your master files (any format ffmpeg reads) into videos-src/ named
 * after the project slug — e.g. videos-src/impossible-ceramics.mov — then run:
 *
 *   npm run videos
 *
 * Each one is encoded twice:
 *   public/videos/<slug>.mp4       H.264, silent, capped length - the grid loop
 *   public/videos/<slug>.poster.jpg first frame, used until the video is ready
 *
 * The three settings that actually make playback feel instant:
 *   -movflags +faststart   moves the index to the front so the browser can
 *                          start playing before the file has finished loading
 *   -an                    drops audio entirely; browsers only allow silent
 *                          autoplay, and the track is dead weight
 *   -pix_fmt yuv420p       the only chroma layout every browser decodes
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

// Bundled binary, so this works without a system ffmpeg install.
const ffmpeg = require('ffmpeg-static');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'videos-src');
const OUT = path.join(ROOT, 'public', 'videos');

// Grid loops stay short and small; the point is motion, not detail.
const MAX_SECONDS = 12;
const HEIGHT = 720;
const CRF = 26;

/**
 * Per-project framing, applied before scaling.
 *
 * Grid tiles are 3:2 landscape. A portrait source dropped straight in gets
 * centre-cropped by CSS, which usually slices off whatever matters. Naming an
 * ffmpeg crop window here bakes the right framing into the file, so it
 * survives re-encoding instead of living only in someone's memory.
 *
 * Format: 'w:h:x:y' in ffmpeg crop syntax (iw/ih = input width/height).
 */
const FRAMING = {
  // 1080x1440 portrait. A centre crop cuts the glasses off at the bottom and
  // keeps the face; this window sits lower, holding the spout, the pour and
  // both glasses - the actual product story.
  'easypour-pitcher': 'iw:iw*2/3:0:ih*0.45',
};

/**
 * Per-project length overrides, in seconds.
 *
 * MAX_SECONDS keeps ordinary product loops short, but a reel is a sequence of
 * cuts - trimming it to the default would drop shots partway through. Name a
 * length here to let a clip run to its natural end.
 */
const DURATION = {
  'freelance-rendering-and-animation': 20,
};

if (!fs.existsSync(SRC)) {
  fs.mkdirSync(SRC, { recursive: true });
  console.log(`Created ${SRC}`);
  console.log('Put your source videos there, named after each project slug, then re-run.');
  process.exit(0);
}

fs.mkdirSync(OUT, { recursive: true });

const sources = fs
  .readdirSync(SRC)
  .filter((f) => /\.(mp4|mov|m4v|avi|mkv|webm|gif)$/i.test(f));

if (!sources.length) {
  console.log(`No source videos in ${SRC}. Nothing to do.`);
  process.exit(0);
}

let built = 0;
for (const file of sources) {
  const slug = file.replace(/\.[^.]+$/, '');
  const input = path.join(SRC, file);
  const mp4 = path.join(OUT, `${slug}.mp4`);
  const poster = path.join(OUT, `${slug}.poster.jpg`);

  console.log(`\n${slug}`);

  try {
    execFileSync(
      ffmpeg,
      [
        '-y',
        '-i', input,
        '-t', String(DURATION[slug] || MAX_SECONDS),
        '-an',
        '-vf', [FRAMING[slug] && `crop=${FRAMING[slug]}`, `scale=-2:${HEIGHT}:flags=lanczos`]
          .filter(Boolean)
          .join(','),
        '-c:v', 'libx264',
        '-profile:v', 'high',
        '-pix_fmt', 'yuv420p',
        '-crf', String(CRF),
        '-preset', 'slow',
        '-movflags', '+faststart',
        mp4,
      ],
      { stdio: ['ignore', 'ignore', 'pipe'] }
    );
    const mb = (fs.statSync(mp4).size / 1048576).toFixed(1);
    console.log(`  mp4    ${mb} MB`);
  } catch (e) {
    console.log(`  FAILED to encode: ${e.message.split('\n')[0]}`);
    continue;
  }

  try {
    execFileSync(
      ffmpeg,
      ['-y', '-i', mp4, '-frames:v', '1', '-q:v', '4', '-vf', `scale=-2:${HEIGHT}`, poster],
      { stdio: ['ignore', 'ignore', 'pipe'] }
    );
    console.log('  poster ok');
  } catch {
    console.log('  poster failed (the project cover image will be used instead)');
  }

  built++;
}

console.log(`\nEncoded ${built}/${sources.length} videos into public/videos.`);
console.log('Run `npm run build` (or redeploy) to pick them up.');
