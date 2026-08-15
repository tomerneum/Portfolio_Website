import Hero from '../components/Hero.js';
import ProjectGrid from '../components/ProjectGrid.js';
import { getProjects, resolveImage } from '../lib/content.js';
import { videoExists } from '../lib/videos.js';
import { hero, site } from '../site.config.js';

export default function Home() {
  const projects = getProjects();

  const heroVideo = videoExists(hero.video) ? hero.video : null;
  const heroPoster = hero.poster ? resolveImage(hero.poster) : projects[0]?.cover || null;

  return (
    <>
      <Hero video={heroVideo} poster={heroPoster} />

      <section className="intro" id="work">
        <p className="intro__label">Selected work</p>
        <p className="intro__lead">
          Thirteen projects in industrial design, computational modelling and digital fabrication.
        </p>
      </section>

      <ProjectGrid projects={projects} />

      <section className="cta">
        <h2>Have something you want made?</h2>
        <a className="cta__link" href={`mailto:${site.email}`}>
          {site.email}
        </a>
      </section>
    </>
  );
}
