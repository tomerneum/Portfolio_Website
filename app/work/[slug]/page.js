import Link from 'next/link';
import { notFound } from 'next/navigation';
import Modules from '../../../components/Modules.js';
import { getProject, getProjects } from '../../../lib/content.js';

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const firstText = project.modules.find((m) => m.type === 'text');
  return {
    title: project.title,
    description: firstText ? firstText.text.slice(0, 180) : undefined,
  };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const all = getProjects();
  const index = all.findIndex((p) => p.slug === project.slug);
  const next = all[(index + 1) % all.length];

  return (
    <article className="project" style={{ '--accent': project.accent }}>
      <header className="project__head">
        <p className="project__meta">{project.meta}</p>
        <h1 className="project__title">{project.title}</h1>
      </header>

      <Modules
        modules={project.modules}
        localVideo={project.hasVideo ? project.video : null}
        poster={project.cover}
      />

      <nav className="project__next">
        <span>Next project</span>
        <Link href={`/work/${next.slug}`}>{next.title}</Link>
      </nav>
    </article>
  );
}
