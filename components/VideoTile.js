'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * A silent, looping video that behaves as if it were already loaded.
 *
 * The trick to "instant" is doing three things in the right order:
 *  1. Paint the poster image immediately, so the tile is never empty.
 *  2. Only attach the video source once the tile is near the viewport, so a
 *     grid of a dozen clips doesn't fight for bandwidth on first paint.
 *  3. Cross-fade the video in only once it can actually play, so you never
 *     see a black frame or a stutter.
 *
 * Videos outside the viewport are paused, which keeps the ones you are
 * looking at smooth even on a laptop.
 */
export default function VideoTile({
  src,
  poster,
  posterSrcSet,
  alt = '',
  className = '',
  eager = false,
  fit = 'cover',
}) {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  const [active, setActive] = useState(eager); // source attached?
  const [ready, setReady] = useState(false); // safe to fade in?

  // Attach the source when the tile approaches the viewport, and keep
  // playback tied to visibility from then on.
  useEffect(() => {
    if (!src) return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    // No IntersectionObserver (very old browsers): just load it.
    if (typeof IntersectionObserver === 'undefined') {
      setActive(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          const v = videoRef.current;
          // play() rejects if the browser blocks autoplay; muted playback is
          // allowed everywhere, but a rejected promise must still be caught.
          if (v && v.paused) v.play().catch(() => {});
        } else {
          const v = videoRef.current;
          if (v && !v.paused) v.pause();
        }
      },
      { rootMargin: '300px 0px', threshold: 0.01 }
    );

    io.observe(wrap);
    return () => io.disconnect();
  }, [src]);

  // Respect a user's reduced-motion preference by holding on the poster.
  useEffect(() => {
    if (typeof matchMedia !== 'function') return;
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setActive(false);
      const v = videoRef.current;
      if (v) v.pause();
    }
  }, []);

  return (
    <div ref={wrapRef} className={`videoTile ${className}`} data-ready={ready ? 'true' : 'false'}>
      {poster && (
        <img
          className="videoTile__poster"
          src={poster}
          srcSet={posterSrcSet || undefined}
          sizes="(max-width: 700px) 100vw, 50vw"
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          style={{ objectFit: fit }}
        />
      )}

      {src && active && (
        <video
          ref={videoRef}
          className="videoTile__video"
          autoPlay
          loop
          muted
          playsInline
          // Chrome on iOS historically needed the legacy attribute too.
          webkit-playsinline="true"
          preload="auto"
          poster={poster || undefined}
          onCanPlay={() => setReady(true)}
          onLoadedData={() => setReady(true)}
          style={{ objectFit: fit }}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
