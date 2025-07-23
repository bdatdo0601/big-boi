import { render } from '@testing-library/react';
import * as React from 'react';

import { mockResume } from '../../../__mocks__/vitae';
import { ResumeContext, ResumeProvider } from '../../../components/Vitae';

describe('The <ResumeProvider> component', () => {
  const initialProps = {
    resume: mockResume,
  };

  const runContext = () => {
    let contextValue;

    render(
      <ResumeProvider {...initialProps}>
        <ResumeContext.Consumer>
          {value => {
            contextValue = value.resume;
            return null;
          }}
        </ResumeContext.Consumer>
      </ResumeProvider>
    );
    return contextValue;
  };

  it('Will render its children with the resume context added', () => {
    expect(runContext()).toEqual(mockResume);
  });
});
