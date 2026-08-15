import ProjectGrid from '../../components/ProjectGrid.js';
import { getProjects } from '../../lib/content.js';

export const metadata = { title: 'Work' };

export default function WorkPage() {
  const projects = getProjects();
  return (
    <>
      <header className="pageHead">
        <h1>Work</h1>
        <p>{projects.length} projects</p>
      </header>
      <ProjectGrid projects={projects} />
    </>
  );
}
