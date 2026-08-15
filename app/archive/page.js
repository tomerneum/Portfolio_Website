import Modules from '../../components/Modules.js';
import { getPage } from '../../lib/content.js';

export const metadata = { title: 'Archive' };

export default function ArchivePage() {
  const page = getPage('archive');

  return (
    <article className="project">
      <header className="project__head">
        <p className="project__meta">Sketches, studies and offcuts</p>
        <h1 className="project__title">Archive</h1>
      </header>

      {page ? <Modules modules={page.modules} /> : <p className="project__empty">Nothing here yet.</p>}
    </article>
  );
}
