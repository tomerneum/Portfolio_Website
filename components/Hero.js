import VideoTile from './VideoTile.js';
import { site, hero } from '../site.config.js';

export default function Hero({ video, poster }) {
  return (
    <section className="hero">
      <div className="hero__media">
        <VideoTile
          src={video}
          poster={poster?.src}
          posterSrcSet={poster?.srcSet}
          alt=""
          eager
          className="videoTile--full"
        />
        <div className="hero__scrim" />
      </div>

      <div className="hero__content">
        <h1 className="hero__statement">{site.statement}</h1>
        <div className="hero__byline">
          <span>{site.name}</span>
          <span>{site.role}</span>
        </div>
      </div>

      <a className="hero__scroll" href="#work" aria-label="Scroll to work">
        <span />
      </a>
    </section>
  );
}
