import Hero from '../components/Hero.js';
import ProjectGrid from '../components/ProjectGrid.js';
import { getProjects, getHomeTiles, resolveImage } from '../lib/content.js';
import { videoExists } from '../lib/videos.js';
import { hero, site } from '../site.config.js';

export default function Home() {
  const projects = getProjects();
  const tiles = getHomeTiles();

  const heroVideo = videoExists(hero.video) ? hero.video : null;
  // Poster falls back to the first real project cover, not a featured link tile.
  const heroPoster = hero.poster ? resolveImage(hero.poster) : projects[0]?.cover || null;

  return (
    <>
      <Hero video={heroVideo} poster={heroPoster} />

      {/* The grid carries the scroll anchor now that the intro block is gone. */}
      <ProjectGrid projects={tiles} id="work" />

      <section className="cta">
        <h2>Have something you want made?</h2>
        <a className="cta__link" href={`mailto:${site.email}`}>
          {site.email}
        </a>
      </section>
    </>
  );
}
