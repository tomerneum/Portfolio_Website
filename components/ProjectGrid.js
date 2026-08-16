import Link from 'next/link';
import VideoTile from './VideoTile.js';

function Tile({ project, wide, priority }) {
  const { slug, title, accent, cover, video, hasVideo, videoPoster } = project;

  // Prefer a real project video; otherwise fall back to the cover's own
  // motion, which exists when the original cover was an animated GIF.
  const src = hasVideo ? video : cover?.video || null;

  // The encoded poster matches the video's first frame exactly, so the swap
  // from still to motion is invisible. Without one, use the project cover.
  const poster = (hasVideo && videoPoster) || cover?.src;
  const posterSrcSet = hasVideo && videoPoster ? null : cover?.srcSet;

  return (
    <article className={wide ? 'tile tile--wide' : 'tile'} style={{ '--accent': accent }}>
      <Link href={`/work/${slug}`} className="tile__link">
        <div className="tile__media">
          <VideoTile
            src={src}
            poster={poster}
            posterSrcSet={posterSrcSet}
            alt={title}
            eager={priority}
          />
        </div>

        <div className="tile__overlay" aria-hidden="true" />

        <div className="tile__caption">
          <h2 className="tile__title">{title}</h2>
        </div>
      </Link>
    </article>
  );
}

/**
 * Lays the grid out as complete rows: one full-width tile, then two rows of
 * paired half-width tiles, repeating.
 *
 * Working it out here rather than with nth-child rules means a row can never
 * be left half-filled - a lone trailing tile is promoted to full width
 * instead of sitting next to a hole. Every tile stays landscape; the variety
 * comes from scale, not from cropping wide photos into tall frames.
 */
function layout(projects) {
  const rows = [];
  let i = 0;
  let step = 0;

  while (i < projects.length) {
    const remaining = projects.length - i;

    if (step === 0 || remaining === 1) {
      rows.push([{ project: projects[i], wide: true, index: i }]);
      i += 1;
    } else {
      rows.push([
        { project: projects[i], wide: false, index: i },
        { project: projects[i + 1], wide: false, index: i + 1 },
      ]);
      i += 2;
    }

    step = (step + 1) % 3;
  }

  return rows.flat();
}

export default function ProjectGrid({ projects, id }) {
  const tiles = layout(projects);

  return (
    <section className="grid" id={id}>
      {tiles.map(({ project, wide, index }) => (
        <Tile key={project.slug} project={project} wide={wide} priority={index < 2} />
      ))}
    </section>
  );
}
