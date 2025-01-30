import { useResume } from '@/components/Vitae';
import withResumeProvider from '@/components/Vitae/withResumeProvider';
import { Email, GitHub, Language, Phone, Place } from '@mui/icons-material';
import { take } from 'lodash';
import React from 'react';
import "./index.css";

type MaterialIconComponent = React.FC<{ sx: { fontSize: number } }>

const ResumeIcon = (IconComponent: MaterialIconComponent): React.FC => () => <IconComponent sx={{ fontSize: 12 }} />

const ResumeContactItem: React.FC<{ IconComponent: MaterialIconComponent, name?: string }> = ({ IconComponent, name }) => {
  const Icon = ResumeIcon(IconComponent);
  if (!name) return null;
  return (
    <span className='flex flex-row gap-[1mm] items-center text-xs'>
      <Icon />
      <span>{name}</span>
    </span>
  )
}

const PaperResumeRenderer: React.FC<{ ref: any }> = ({ ref }) => {
  const resume = useResume();
  return (
    <div ref={ref} className="w-[8.5in] h-[11in] p-[5mm] mx-auto bg-white text-black shadow-lg">
      <div className="printable font-sans text-base leading-relaxed flex-col flex gap-[1mm]">
        <header className="text-center flex-col flex">
          <h1 className="text-2xl font-extrabold">{resume.basic.name.toLocaleUpperCase()}</h1>
          <p className='flex items-center justify-center text-center gap-[1mm]'>
            <ResumeContactItem IconComponent={Email} name={resume.basic.email} />
            <span className='text-xs'>{" | "}</span>
            <ResumeContactItem IconComponent={GitHub} name={resume.basic.profiles.find(item => item.network === "GitHub")?.username} />
            <span className='text-xs'>{" | "}</span>
            <ResumeContactItem IconComponent={Language} name={resume.basic.website.replace(/^https?:\/\/|\/$/g, '')} />
            <span className='text-xs'>{" | "}</span>
            <ResumeContactItem IconComponent={Phone} name={resume.basic.phone} />
            <span className='text-xs'>{" | "}</span>
            <ResumeContactItem IconComponent={Place} name={`${resume.basic.location.city}, ${resume.basic.location.region}`} />
          </p>
        </header>
        <section>
          <h2 className="text-sm font-bold border-b-2 border-black mb-1 text-center">{"Competencies".toLocaleUpperCase()}</h2>
          <table className="flex flex-col">
            <tbody>
              {resume.skills.map(skillset => (
                <tr key={skillset.name} className='flex gap-2'>
                  <th className='text-xs font-bold w-1/5 text-left text-nowrap'>{skillset.name}:</th>
                  <td className='text-xs w-4/5'>{skillset.keywords.join(", ")}</td>
                </tr>
              ))}
              <tr className='flex gap-2'>
                <th className='text-xs font-bold w-1/5 text-left text-nowrap'>Language:</th>
                <td className='text-xs w-1/5'>{resume.languages.map(item => item.language).join(", ")}</td>
              </tr>
            </tbody>
          </table>
        </section>
        <section>
          <h2 className="text-sm font-bold border-b-2 border-black mb-1 text-center">{"Experience".toLocaleUpperCase()}</h2>
          <div className='flex flex-col gap-1'>
            {take(resume.work, 3).map(workItem => (
              <div key={workItem.company + workItem.position}>
                <span className='flex flex-row justify-between'>
                  <span className='flex flex-row gap-1'>
                    <span className='text-sm font-bold'>{workItem.position}</span>
                    <span className='text-sm'>{" | "}</span>
                    <span className='text-sm'>{workItem.company}</span>
                  </span>
                  <span className='flex flex-row justify-between'>
                    <span className='flex flex-row gap-1'>
                      <span className='text-sm italic'>{workItem.startDate} - {workItem.endDate}</span>
                    </span>
                  </span>
                </span>
                <ul className='list-disc pl-4'>
                  {workItem.highlights.map(item => <li className='text-xs' key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-sm font-bold border-b-2 border-black mb-1 text-center">{"Research & Side Projects".toLocaleUpperCase()}</h2>
          <div className='flex flex-col'>
            {take(resume.projects, 4).map(projectItem => (
              <div key={projectItem.name}>
                <span className='flex flex-row justify-between'>
                  <span className='flex flex-row gap-1'>
                    <span className='text-sm font-bold'>{projectItem.name}</span>
                    {projectItem.entity && (
                      <>
                        <span className='text-sm'>{" | "}</span>
                        <span className='text-sm'>{projectItem.entity}</span>
                      </>
                    )}
                  </span>
                  <span className='flex flex-row justify-between'>
                    <span className='flex flex-row gap-1'>
                      <span className='text-sm italic'>{projectItem.startDate} - {projectItem.endDate}</span>
                    </span>
                  </span>
                </span>
                <ul className='list-none'>
                  <li className='text-xs'>{projectItem.description}</li>
                </ul>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-sm font-bold border-b-2 border-black mb-1 text-center">{"Education".toLocaleUpperCase()}</h2>
          <div className='flex flex-col gap-1'>
            {resume.education.map(educationItem => (
              <div key={educationItem.institution}>
                <span className='flex flex-row justify-between'>
                  <span className='flex flex-row gap-1'>
                    <span className='text-sm font-bold'>{educationItem.studyType}: {educationItem.area}</span>
                    <span className='text-sm'>{" | "}</span>
                    <span className='text-sm'>{educationItem.institution}</span>
                  </span>
                  <span className='flex flex-row justify-between'>
                    <span className='flex flex-row gap-1'>
                      <span className='text-sm italic'>{educationItem.startDate} - {educationItem.endDate}</span>
                    </span>
                  </span>
                </span>
                <span className='flex flex-row justify-between'>
                  <span className='text-xs italic'>Minors: {(educationItem.minors || ["Applied Mathematics", "Computer Networking"]).join(" & ")}</span>
                  <span className='text-xs italic'>GPA: {educationItem.gpa}</span>
                </span>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-sm font-bold border-b-2 border-black mb-1 text-center">{"Awards & Affilliations".toLocaleUpperCase()}</h2>
          <div className='flex flex-col gap-1'>
            {resume.awards.map(awardItem => (
              <div key={awardItem.title}>
                <span className='flex flex-row justify-between'>
                  <span className='flex flex-row gap-1'>
                    <span className='text-sm font-bold'>{awardItem.title}</span>
                    <span className='text-sm'>{" | "}</span>
                    <span className='text-sm'>{awardItem.entity}</span>
                  </span>
                  <span className='flex flex-row justify-between'>
                    <span className='flex flex-row gap-1'>
                      <span className='text-sm'>{awardItem.snippet}</span>
                      <span className='text-sm'>{" | "}</span>
                      <span className='text-sm italic'>{awardItem.year}</span>
                    </span>
                  </span>
                </span>
              </div>
            ))}
            {resume.custom.affiliations.map(affiliationItem => (
              <div key={affiliationItem.title}>
              <span className='flex flex-row justify-between'>
                <span className='flex flex-row gap-1'>
                  <span className='text-sm font-bold'>{affiliationItem.title}</span>
                  <span className='text-sm'>{" | "}</span>
                  <span className='text-sm'>{affiliationItem.entity}</span>
                </span>
                <span className='flex flex-row justify-between'>
                  <span className='flex flex-row gap-1'>
                    <span className='text-sm italic'>{affiliationItem.year}</span>
                  </span>
                </span>
              </span>
            </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default withResumeProvider(PaperResumeRenderer);
