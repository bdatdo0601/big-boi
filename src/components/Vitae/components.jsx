import React from "react";

import {
  withAwards,
  withBasic,
  withEducation,
  withInterests,
  withLanguages,
  withProjects,
  withPublications,
  withReferences,
  withResume,
  withSkills,
  withVolunteer,
  withWork,
} from "./hocs";

export const WithResume = withResume(({ children, resume }) => children({ resume }));

export const WithBasic = withBasic(({ children, basic }) => children({ basic }));

export const WithWork = withWork(({ children, work }) => children({ work }));

export const WithVolunteer = withVolunteer(({ children, volunteer }) => children({ volunteer }));

export const WithEducation = withEducation(({ children, education }) => children({ education }));

export const WithAwards = withAwards(({ children, awards }) => children({ awards }));

export const WithInterests = withInterests(({ children, interests }) => children({ interests }));

export const WithLanguages = withLanguages(({ children, languages }) => children({ languages }));

export const WithProjects = withProjects(({ children, projects }) => children({ projects }));

export const WithPublications = withPublications(({ children, publications }) => children({ publications }));

export const WithReferences = withReferences(({ children, references }) => children({ references }));

export const WithSkills = withSkills(({ children, skills }) => children({ skills }));
