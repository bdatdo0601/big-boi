import React from "react";

import {
  useResume,
  useBasic,
  useWork,
  useVolunteer,
  useEducation,
  useAwards,
  usePublications,
  useSkills,
  useInterests,
  useReferences,
  useLanguages,
  useProjects,
} from "./hooks";

export const withResume = (Component) => (props) => <Component {...props} resume={useResume()} />;

export const withBasic = (Component) => (props) => <Component {...props} basic={useBasic()} />;

export const withWork = (Component) => (props) => <Component {...props} work={useWork()} />;

export const withVolunteer = (Component) => (props) => <Component {...props} volunteer={useVolunteer()} />;

export const withEducation = (Component) => (props) => <Component {...props} education={useEducation()} />;

export const withAwards = (Component) => (props) => <Component {...props} awards={useAwards()} />;

export const withPublications = (Component) => (props) => <Component {...props} publications={usePublications()} />;

export const withSkills = (Component) => (props) => <Component {...props} skills={useSkills()} />;

export const withInterests = (Component) => (props) => <Component {...props} interests={useInterests()} />;

export const withReferences = (Component) => (props) => <Component {...props} references={useReferences()} />;

export const withLanguages = (Component) => (props) => <Component {...props} languages={useLanguages()} />;

export const withProjects = (Component) => (props) => <Component {...props} projects={useProjects()} />;
