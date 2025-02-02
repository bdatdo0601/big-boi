import { useContext } from 'react';
import { ResumeContext, ResumeSchema } from './provider';

export const useResume = (): ResumeSchema => {
  const context = useContext(ResumeContext);
  if (!context.resume) {
    throw new Error('<ResumeProvider> missing at the root of the application, cannot use the resume context.');
  }

  return context.resume;
};

export const useBasic = () => {
  return useResume().basic;
};

export const useWork = () => {
  return useResume().work;
};

export const useVolunteer = () => {
  return useResume().volunteer;
};

export const useEducation = () => {
  return useResume().education;
};

export const useAwards = () => {
  return useResume().awards;
};

export const usePublications = () => {
  return useResume().publications;
};

export const useSkills = () => {
  return useResume().skills;
};

export const useInterests = () => {
  return useResume().interests;
};

export const useReferences = () => {
  return useResume().references;
};

export const useLanguages = () => {
  return useResume().languages;
};

export const useProjects = () => {
  return useResume().projects;
};

export const useFAQ = () => {
  return useResume().faq;
};
