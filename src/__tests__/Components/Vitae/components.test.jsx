import * as React from "react";
import { render } from "@testing-library/react";

import {
  ResumeProvider,
  WithResume,
  WithBasic,
  WithWork,
  WithVolunteer,
  WithEducation,
  WithAwards,
  WithPublications,
  WithSkills,
  WithInterests,
  WithReferences,
  WithLanguages,
  WithProjects,
} from "../../../components/Vitae";

import { mockResume } from "../../../__mocks__/vitae";

const components = {
  WithResume: {
    component: WithResume,
    expect: mockResume,
  },
  WithBasic: {
    component: WithBasic,
    expect: mockResume.basic,
  },
  WithWork: {
    component: WithWork,
    expect: mockResume.work,
  },
  WithVolunteer: {
    component: WithVolunteer,
    expect: mockResume.volunteer,
  },
  WithEducation: {
    component: WithEducation,
    expect: mockResume.education,
  },
  WithAwards: {
    component: WithAwards,
    expect: mockResume.awards,
  },
  WithPublications: {
    component: WithPublications,
    expect: mockResume.publications,
  },
  WithSkills: {
    component: WithSkills,
    expect: mockResume.skills,
  },
  WithInterests: {
    component: WithInterests,
    expect: mockResume.interests,
  },
  WithReferences: {
    component: WithReferences,
    expect: mockResume.references,
  },
  WithLanguages: {
    component: WithLanguages,
    expect: mockResume.languages,
  },
  WithProjects: {
    component: WithProjects,
    expect: mockResume.projects,
  },
};

Object.keys(components).forEach(componentName =>
  describe(`The ${componentName} component`, () => {
    const information = components[componentName];

    const runContext = () => {
      let contextValue = null;

      const Component = information.component;

      render(
        <ResumeProvider resume={mockResume}>
          <Component>
            {value => {
              contextValue = value;
              return null;
            }}
          </Component>
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
