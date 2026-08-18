import { site } from '../../site.config.js';

export const metadata = { title: 'Contact' };

// +972545609139 -> +972 54 560 9139. The tel: link keeps the unspaced form.
function readablePhone(e164) {
  const m = e164.match(/^(\+\d{3})(\d{2})(\d{3})(\d{4})$/);
  return m ? `${m[1]} ${m[2]} ${m[3]} ${m[4]}` : e164;
}

// Show the profile itself rather than a "Visit" label, so the row reads the
// same way the email row does.
function readableUrl(href) {
  return href.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

export default function ContactPage() {
  const linkedin = site.social.find((s) => s.label === 'LinkedIn');

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
          <span>Phone</span>
          <a href={`tel:${site.phone}`}>{readablePhone(site.phone)}</a>
        </div>

        <div className="contact__row">
          <span>Based in</span>
          <p>{site.location.join(', ')}</p>
        </div>

        {linkedin && (
          <div className="contact__row">
            <span>LinkedIn</span>
            <a href={linkedin.href} target="_blank" rel="noopener noreferrer">
              {readableUrl(linkedin.href)}
            </a>
          </div>
        )}
      </div>
    </article>
  );
}
