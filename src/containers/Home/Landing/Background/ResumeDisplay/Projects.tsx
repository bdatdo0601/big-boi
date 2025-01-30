import React from "react";
import { useProjects } from "@/components/Vitae";
import ProfileCard from "@/components/ProfileCard";

const Projects: React.FC = () => {
  const projects = useProjects();

  return (
    <ProfileCard
      header={<h2 className="text-xl text-input">Projects</h2>}
    >
      {projects.map((project) => (
         <div key={project.name} className="text-left pl-2 border-l-4 text-input flex flex-col gap-1 mb-4">
         <h6 className="text-md font-bold">{project.name} ({project.startDate} - {project.endDate})</h6>
         <p className="text-sm font-normal italic">{project.description}</p>
         <ul className="list-disc pl-4 flex flex-col gap-0.5">
         {project.highlights.map((highlight: string) => (
            <li className="text-sm text-input" key={highlight}>
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