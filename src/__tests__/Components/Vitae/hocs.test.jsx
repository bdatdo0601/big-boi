import * as React from "react";
import { render } from "@testing-library/react";

import {
  ResumeProvider,
  withResume,
  withBasic,
  withWork,
  withVolunteer,
  withEducation,
  withAwards,
  withPublications,
  withSkills,
  withInterests,
  withReferences,
  withLanguages,
  withProjects,
} from "../../../components/Vitae";

import { mockResume } from "../../../__mocks__/vitae";

const hocs = {
  withResume: {
    hoc: withResume,
    expect: mockResume,
  },
  withBasic: {
    hoc: withBasic,
    expect: mockResume.basic,
  },
  withWork: {
    hoc: withWork,
    expect: mockResume.work,
  },
  withVolunteer: {
    hoc: withVolunteer,
    expect: mockResume.volunteer,
  },
  withEducation: {
    hoc: withEducation,
    expect: mockResume.education,
  },
  withAwards: {
    hoc: withAwards,
    expect: mockResume.awards,
  },
  withPublications: {
    hoc: withPublications,
    expect: mockResume.publications,
  },
  withSkills: {
    hoc: withSkills,
    expect: mockResume.skills,
  },
  withInterests: {
    hoc: withInterests,
    expect: mockResume.interests,
  },
  withReferences: {
    hoc: withReferences,
    expect: mockResume.references,
  },
  withLanguages: {
    hoc: withLanguages,
    expect: mockResume.languages,
  },
  withProjects: {
    hoc: withProjects,
    expect: mockResume.projects,
  },
};

Object.keys(hocs).forEach(hocName =>
  describe(`The ${hocName} hoc`, () => {
    const information = hocs[hocName];

    const runContext = () => {
      let contextValue = null;

      const Tester = information.hoc(props => {
        contextValue = props;
        return null;
      });

      render(
        <ResumeProvider resume={mockResume}>
          <Tester />
        </ResumeProvider>
      );
      return contextValue;
    };

    it("Return the resume from the given context if it exists", () => {
      const resumeValue = runContext();

      expect(resumeValue).not.toBeNull();
      if (resumeValue) {
        expect(resumeValue[Object.keys(resumeValue)[0]]).toEqual(information.expect);
      }
    });
  })
);
