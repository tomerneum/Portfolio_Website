import { site } from '../../site.config.js';

export const metadata = { title: 'Contact' };

export default function ContactPage() {
  return (
    <article className="project">
      <header className="project__head">
        <p className="project__meta">Available for freelance and collaboration</p>
        <h1 className="project__title">Contact</h1>
      </header>

      <div className="contact">
        <div className="contact__row">
          <span>Email</span>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </div>
        <div className="contact__row">
          <span>Based in</span>
          <p>{site.location.join(', ')}</p>
        </div>
        {site.social.map((s) => (
          <div className="contact__row" key={s.label}>
            <span>{s.label}</span>
            <a href={s.href} target="_blank" rel="noopener noreferrer">
              Visit
            </a>
          </div>
        ))}
      </div>
    </article>
  );
}
