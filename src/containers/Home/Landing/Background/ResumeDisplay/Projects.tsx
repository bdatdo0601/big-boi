import React from 'react';
import ProfileCard from '@/components/ProfileCard';
import { useProjects } from '@/components/Vitae';

const Projects: React.FC = () => {
  const projects = useProjects();

  return (
    <ProfileCard header={<h3>Projects</h3>}>
      {projects.map(project => (
        <div key={project.name} className="text-left pl-2 border-l-4 text-input flex flex-col gap-1 mb-4">
          <h5>
            {project.name} ({project.startDate} - {project.endDate})
          </h5>
          <p>{project.description}</p>
          <ul className="list-disc pl-4 flex flex-col gap-0.5">
            {project.highlights.map((highlight: string) => (
              <li className="italic" key={highlight}>
                {highlight}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </ProfileCard>
  );
};

export default Projects;
