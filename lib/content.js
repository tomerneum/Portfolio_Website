import { projectMeta, featuredOrder, mediaReplacements, featuredTiles } from '../site.config.js';
import { videoExists, videoPoster } from './videos.js';

// Imported statically so the build tracer doesn't pull all of public/ into
// the server bundle the way a dynamic fs.readFileSync would.
import raw from '../content.json';
import manifest from '../image-manifest.json';

/**
 * Turn a "/images/foo.jpg" reference into the responsive srcset built by
 * scripts/optimize-images.js. Falls back to the original when no variant
 * exists (e.g. animated GIFs, which are left untouched).
 */
export function resolveImage(url) {
  if (!url) return null;
  const file = url.split('/').pop();
  // An explicit replacement wins over whatever the manifest holds.
  const swap = mediaReplacements[file];
  if (swap) {
    return {
      src: swap.poster || null,
      srcSet: null,
      width: swap.w || null,
      height: swap.h || null,
      video: swap.video,
    };
  }

  const entry = manifest[file];
  if (!entry) return { src: url, srcSet: null, width: null, height: null, video: null };

  // Animated GIFs were re-encoded to mp4 by scripts/convert-gifs.cjs; `src` is
  // the poster frame and `video` is the clip that replaces it once loaded.
  if (entry.animated) {
    return {
      src: entry.src,
      srcSet: null,
      width: entry.w,
      height: entry.h,
      video: entry.video || null,
    };
  }

  return {
    src: entry.src,
    srcSet: entry.variants.map((v) => `${v.src} ${v.w}w`).join(', '),
    width: entry.w,
    height: entry.h,
    video: null,
  };
}

function decorate(project) {
  const cfg = projectMeta[project.slug] || {};
  const video = cfg.video || null;
  return {
    ...project,
    title: project.displayTitle || project.title,
    meta: cfg.meta || '',
    accent: cfg.accent || '#1c1c1c',
    video,
    hasVideo: videoExists(video),
    // Prefer the video's own first frame; fall back to the project cover.
    videoPoster: videoPoster(video),
    cover: resolveImage(project.cover),
    modules: project.modules.map((m) =>
      m.images ? { ...m, images: m.images.map((i) => ({ ...i, ...resolveImage(i.url) })) } : m
    ),
  };
}

// A hidden project is absent everywhere, not merely unlinked: it leaves the
// grid, the next-project rotation and generateStaticParams, and getProject
// refuses it so /work/<slug> 404s instead of rendering on demand.
function isHidden(slug) {
  return Boolean(projectMeta[slug]?.hidden);
}

export function getProjects() {
  const bySlug = new Map(raw.projects.filter((p) => !isHidden(p.slug)).map((p) => [p.slug, p]));
  const ordered = [];
  for (const slug of featuredOrder) {
    if (bySlug.has(slug)) {
      ordered.push(bySlug.get(slug));
      bySlug.delete(slug);
    }
  }
  ordered.push(...bySlug.values());
  return ordered.map(decorate);
}

// A featured tile carries only what the grid's Tile needs: a title, a cover,
// an accent, and an href to somewhere other than /work/<slug>. It has no
// project body, so it never enters getProjects/generateStaticParams - only
// the home grid, via getHomeTiles.
function decorateFeaturedTile(t) {
  return {
    slug: t.slug,
    title: t.title,
    href: t.href,
    accent: t.accent || '#1c1c1c',
    cover: resolveImage(t.cover),
    video: null,
    hasVideo: false,
    videoPoster: null,
  };
}

// The home grid: the featured project list with any featuredTiles spliced in
// at their declared position. Kept separate from getProjects so project
// routing and the next-project rotation never see these link tiles.
export function getHomeTiles() {
  const tiles = getProjects();
  for (const t of featuredTiles) {
    const at = typeof t.position === 'number' ? Math.min(t.position, tiles.length) : tiles.length;
    tiles.splice(at, 0, decorateFeaturedTile(t));
  }
  return tiles;
}

export function getProject(slug) {
  if (isHidden(slug)) return null;
  const p = raw.projects.find((x) => x.slug === slug);
  return p ? decorate(p) : null;
}

export function getPage(name) {
  const p = raw[name];
  if (!p) return null;
  return {
    ...p,
    modules: p.modules.map((m) =>
      m.images ? { ...m, images: m.images.map((i) => ({ ...i, ...resolveImage(i.url) })) } : m
    ),
  };
}

export function heroPoster(fallbackFrom) {
  return fallbackFrom ? fallbackFrom.cover : null;
}
