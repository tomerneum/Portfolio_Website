import { site } from '../site.config.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__base">
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
        <span className="footer__he">{site.nameHe}</span>
      </div>
    </footer>
  );
}
