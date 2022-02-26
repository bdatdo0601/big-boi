import * as React from "react";
import { render } from "@testing-library/react";

import {
  ResumeProvider,
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
} from "../../../components/Vitae";

import { mockResume } from "../../../__mocks__/vitae";

const hooks = {
  useResume: {
    runner: useResume,
    expect: mockResume,
  },
  useBasic: {
    runner: useBasic,
    expect: mockResume.basic,
  },
  useWork: {
    runner: useWork,
    expect: mockResume.work,
  },
  useVolunteer: {
    runner: useVolunteer,
    expect: mockResume.volunteer,
  },
  useEducation: {
    runner: useEducation,
    expect: mockResume.education,
  },
  useAwards: {
    runner: useAwards,
    expect: mockResume.awards,
  },
  usePublications: {
    runner: usePublications,
    expect: mockResume.publications,
  },
  useSkills: {
    runner: useSkills,
    expect: mockResume.skills,
  },
  useInterests: {
    runner: useInterests,
    expect: mockResume.interests,
  },
  useReferences: {
    runner: useReferences,
    expect: mockResume.references,
  },
  useLanguages: {
    runner: useLanguages,
    expect: mockResume.languages,
  },
  useProjects: {
    runner: useProjects,
    expect: mockResume.projects,
  },
};

Object.keys(hooks).forEach(hookName =>
  describe(`The ${hookName} hook`, () => {
    const information = hooks[hookName];

    const runContext = () => {
      let contextValue = null;

      const Tester = () => {
        contextValue = information.runner();

        return null;
      };

      render(
        <ResumeProvider resume={mockResume}>
          <Tester />
        </ResumeProvider>
      );
      return contextValue;
    };

    const runBadContext = (root = false) => {
      let contextValue;
      let error = null;

      const Tester = () => {
        try {
          contextValue = information.runner();
        } catch (e) {
          error = e;
        }

        return null;
      };

      render(
        <ResumeProvider resume={root ? undefined : { basic: mockResume.basic }}>
          <Tester />
        </ResumeProvider>
      );
      return { contextValue, error };
    };

    it("Return the resume from the given context if it exists", () => {
      const resumeValue = runContext();

      expect(resumeValue).toEqual(information.expect);
    });

    it("Throws an error when called with an invalid context", () => {
      if (hookName === "useResume") {
        expect(runBadContext(true).error).toBeDefined();
      } else if (hookName === "useBasic") {
        expect(runBadContext().contextValue).toEqual(information.expect);
      } else {
        expect(runBadContext().contextValue).toBe(undefined);
      }
    });
  })
);
