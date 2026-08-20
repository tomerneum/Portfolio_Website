import { configurators } from '../../site.config.js';

export const metadata = {
  title: 'Configurators',
  description:
    'Live parametric tools — adjust the model in your browser and get production-ready output.',
};

export default function ConfiguratorsPage() {
  return (
    <article className="project configurators">
      <header className="project__head">
        <p className="project__meta">Live parametric tools</p>
        <h1 className="project__title">Configurators</h1>
      </header>

      {configurators.map((c) => (
        <section className="configurator" key={c.slug} id={c.slug}>
          <div className="configurator__intro">
            <h2 className="configurator__title">{c.title}</h2>
            {c.subtitle && <p className="configurator__subtitle">{c.subtitle}</p>}
            {c.blurb && <p className="configurator__blurb">{c.blurb}</p>}
          </div>

          <div className="configurator__frame">
            {/* The app owns its own layout and pointer handling, so it is
                framed edge to edge and left to scroll and orbit internally. */}
            <iframe
              src={c.url}
              title={c.title}
              loading="lazy"
              allow="fullscreen"
            />
          </div>

          {/* A full-window fallback: a 3D tool is easier to drive with the
              whole viewport, and it keeps working if framing is ever blocked. */}
          <a className="configurator__open" href={c.url} target="_blank" rel="noopener noreferrer">
            Open in a new tab
          </a>
        </section>
      ))}
    </article>
  );
}
