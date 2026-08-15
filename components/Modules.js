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
 * A project video. Prefers a self-hosted mp4 (instant, silent, looping) and
 * falls back to the YouTube embed when no local file has been added yet.
 */
function Video({ module, localSrc, poster }) {
  if (localSrc) {
    return (
      <div className="mod mod--video">
        <VideoTile src={localSrc} poster={poster?.src} posterSrcSet={poster?.srcSet} fit="contain" />
      </div>
    );
  }

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

export default function Modules({ modules, localVideo, poster }) {
  // Only the first video module gets replaced by the local preview file;
  // any additional ones stay on their original embed.
  let usedLocal = false;

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
          const src = !usedLocal && localVideo ? localVideo : null;
          if (src) usedLocal = true;
          return <Video key={i} module={m} localSrc={src} poster={poster} />;
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
