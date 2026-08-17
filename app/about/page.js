import Modules from '../../components/Modules.js';
import VideoTile from '../../components/VideoTile.js';
import { getPage } from '../../lib/content.js';
import { site, aboutReel } from '../../site.config.js';

export const metadata = { title: 'About' };

export default function AboutPage() {
  const page = getPage('about');

  const linkedin = site.social.find((s) => s.label === 'LinkedIn');

  return (
    <article className="project about">
      <header className="project__head">
        <p className="project__meta">{site.role}</p>
        <h1 className="project__title">{site.name}</h1>
      </header>

      {page ? <Modules modules={page.modules} /> : null}

      {aboutReel?.video && (
        <section className="about__reel">
          <VideoTile src={aboutReel.video} poster={aboutReel.poster} alt="Clients" fit="contain" />
        </section>
      )}

      <section className="about__contact">
        <h2>Get in touch</h2>
        <a href={`mailto:${site.email}`}>{site.email}</a>
        {linkedin && (
          <a href={linkedin.href} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        )}
      </section>
    </article>
  );
}
