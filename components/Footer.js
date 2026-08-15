import { site } from '../site.config.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__cols">
        <div className="footer__col">
          <h3>Find me</h3>
          <p>{site.name}</p>
          <p>{site.role}</p>
          {site.location.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        <div className="footer__col">
          <h3>Mail me</h3>
          <p>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </div>

        <div className="footer__col">
          <h3>Follow me</h3>
          {site.social.map((s) => (
            <p key={s.label}>
              <a href={s.href} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
            </p>
          ))}
        </div>
      </div>

      <div className="footer__base">
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
        <span className="footer__he">{site.nameHe}</span>
      </div>
    </footer>
  );
}
