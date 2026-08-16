import Modules from '../../components/Modules.js';
import { getPage } from '../../lib/content.js';
import { site } from '../../site.config.js';

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
