import VideoTile from './VideoTile.js';

function Figure({ image, sizes }) {
  if (!image?.src) return null;

  // Former GIFs now play as silent looping video, keeping their aspect ratio
  // so surrounding layout is unchanged.
  if (image.video) {
    return (
      <div
        className="mod__motion"
        style={{ aspectRatio: image.width && image.height ? `${image.width} / ${image.height}` : '16 / 9' }}
      >
        <VideoTile src={image.video} poster={image.src} alt="" />
      </div>
    );
  }

  return (
    <img
      className="mod__img"
      src={image.src}
      srcSet={image.srcSet || undefined}
      sizes={sizes}
      alt=""
      loading="lazy"
      decoding="async"
      width={image.width || undefined}
      height={image.height || undefined}
    />
  );
}

/**
 * A project video, kept exactly as it was on the original site.
 *
 * Local mp4s are grid-thumbnail material only - they are short, silent loops.
 * The embed here is the full piece with sound, so it stays put even when a
 * project also has a local preview file.
 */
function Video({ module }) {
  if (!module.youtubeId) return null;

  const params = new URLSearchParams({ rel: '0', modestbranding: '1' });
  if (module.start) params.set('start', String(module.start));

  return (
    <div className="mod mod--video">
      <div className="embed">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${module.youtubeId}?${params}`}
          title="Project video"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

export default function Modules({ modules }) {
  return (
    <div className="mods">
      {modules.map((m, i) => {
        if (m.type === 'text') {
          return (
            <div className="mod mod--text" key={i}>
              {m.text.split(/\n{2,}|\n/).filter(Boolean).map((para, j) => (
                <p key={j}>{para}</p>
              ))}
            </div>
          );
        }

        if (m.type === 'image') {
          return (
            <div className="mod mod--image" key={i}>
              <Figure image={m.images[0]} sizes="(max-width: 900px) 100vw, 1200px" />
            </div>
          );
        }

        if (m.type === 'gallery') {
          return (
            <div className="mod mod--gallery" key={i}>
              {m.images.map((img, j) => (
                <figure
                  key={j}
                  className="mod__cell"
                  // Preserve each image's aspect ratio so the row heights match.
                  style={{ flexGrow: img.w && img.h ? img.w / img.h : 1, flexBasis: img.w && img.h ? `${(img.w / img.h) * 220}px` : '320px' }}
                >
                  <Figure image={img} sizes="(max-width: 900px) 100vw, 50vw" />
                </figure>
              ))}
            </div>
          );
        }

        if (m.type === 'video') {
          return <Video key={i} module={m} />;
        }

        if (m.type === 'spline') {
          return (
            <div className="mod mod--video" key={i}>
              <div className="embed">
                <iframe src={m.url} title="3D model" loading="lazy" allowFullScreen />
              </div>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
