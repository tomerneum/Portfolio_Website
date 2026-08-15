import fs from 'node:fs';
import path from 'node:path';

// Video files are looked up at request time rather than baked in at build
// time, so dropping an mp4 into public/videos (or onto a mounted Railway
// volume) is enough to turn a still tile into a playing one.
//
// The directory is a fixed, statically-known path and only the filename
// varies, which keeps Next's build tracer from pulling all of public/ into
// the server bundle.
const VIDEO_DIR = path.join(process.cwd(), 'public', 'videos');

function exists(name) {
  if (!name || name.includes('..') || name.includes('/')) return false;
  try {
    return fs.existsSync(path.join(VIDEO_DIR, name));
  } catch {
    return false;
  }
}

export function videoExists(publicPath) {
  if (!publicPath) return false;
  return exists(publicPath.split('/').pop());
}

/**
 * The poster frame emitted alongside an encoded video. Matching the video's
 * own first frame exactly means the swap from image to video is invisible;
 * without it the caller falls back to the project cover.
 */
export function videoPoster(publicPath) {
  if (!publicPath) return null;
  const name = publicPath.split('/').pop().replace(/\.mp4$/i, '.poster.jpg');
  return exists(name) ? `/videos/${name}` : null;
}
