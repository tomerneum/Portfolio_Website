import Link from 'next/link';
import VideoTile from './VideoTile.js';

function Tile({ project, priority }) {
  const { slug, title, meta, accent, cover, video, hasVideo, videoPoster } = project;

  // Prefer a real project video; otherwise fall back to the cover's own
  // motion, which exists when the original cover was an animated GIF.
  const src = hasVideo ? video : cover?.video || null;

  // The encoded poster matches the video's first frame exactly, so the swap
  // from still to motion is invisible. Without one, use the project cover.
  const poster = (hasVideo && videoPoster) || cover?.src;
  const posterSrcSet = hasVideo && videoPoster ? null : cover?.srcSet;

  return (
    <article className="tile" style={{ '--accent': accent }}>
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
          {meta && <p className="tile__meta">{meta}</p>}
        </div>
      </Link>
    </article>
  );
}

export default function ProjectGrid({ projects, id }) {
  return (
    <section className="grid" id={id}>
      {projects.map((p, i) => (
        <Tile key={p.slug} project={p} priority={i < 2} />
      ))}
    </section>
  );
}
