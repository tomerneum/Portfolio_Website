import Link from 'next/link';
import VideoTile from './VideoTile.js';

function Tile({ project, priority }) {
  const { slug, title, accent, cover, video, hasVideo, videoPoster, href } = project;

  // A featured tile carries its own href; a project tile links to its page.
  const link = href || `/work/${slug}`;

  // Prefer a real project video; otherwise fall back to the cover's own
  // motion, which exists when the original cover was an animated GIF.
  const src = hasVideo ? video : cover?.video || null;

  // The encoded poster matches the video's first frame exactly, so the swap
  // from still to motion is invisible. Without one, use the project cover.
  const poster = (hasVideo && videoPoster) || cover?.src;
  const posterSrcSet = hasVideo && videoPoster ? null : cover?.srcSet;

  return (
    <article className="tile" style={{ '--accent': accent }}>
      <Link href={link} className="tile__link">
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
 * Every tile is the same size: one uniform landscape shape, two to a row.
 * With an odd number of projects the final row holds a single tile and the
 * space beside it stays empty - keeping one shape throughout matters more
 * than filling that last slot.
 */
export default function ProjectGrid({ projects, id }) {
  return (
    <section className="grid" id={id}>
      {projects.map((project, index) => (
        <Tile key={project.slug} project={project} priority={index < 2} />
      ))}
    </section>
  );
}
