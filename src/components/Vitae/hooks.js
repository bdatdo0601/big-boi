import { useContext } from "react";
import { ResumeContext } from "./provider";

const Sections = {
  Basic: "basic",
  Work: "work",
  Volunteer: "volunteer",
  Education: "education",
  Awards: "awards",
  Publications: "publications",
  Skills: "skills",
  Languages: "languages",
  Interests: "interests",
  References: "references",
  Projects: "projects",
};

const getResumeElement = (element, section) => {
  if (!element[section]) {
    return undefined;
  }
  const got = element[section];
  return got;
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context.resume) {
    throw new Error("<ResumeProvider> missing at the root of the application, cannot use the resume context.");
  }

  return useContext(ResumeContext).resume;
};

export const useBasic = () => {
  return getResumeElement(useResume(), Sections.Basic);
};

export const useWork = () => {
  return getResumeElement(useResume(), Sections.Work);
};

export const useVolunteer = () => {
  return getResumeElement(useResume(), Sections.Volunteer);
};

export const useEducation = () => {
  return getResumeElement(useResume(), Sections.Education);
};

export const useAwards = () => {
  return getResumeElement(useResume(), Sections.Awards);
};

export const usePublications = () => {
  return getResumeElement(useResume(), Sections.Publications);
};

export const useSkills = () => {
  return getResumeElement(useResume(), Sections.Skills);
};

export const useInterests = () => {
  return getResumeElement(useResume(), Sections.Interests);
};

export const useReferences = () => {
  return getResumeElement(useResume(), Sections.References);
};

export const useLanguages = () => {
  return getResumeElement(useResume(), Sections.Languages);
};

export const useProjects = () => {
  return getResumeElement(useResume(), Sections.Projects);
};
