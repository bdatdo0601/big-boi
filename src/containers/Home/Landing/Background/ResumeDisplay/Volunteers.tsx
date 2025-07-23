import { Step, StepContent, StepIcon, StepLabel, Stepper } from '@mui/material';
import React from 'react';
import Avatar from '@/components/Avatar';
import ProfileCard from '@/components/ProfileCard';
import { useVolunteer } from '@/components/Vitae';

const Volunteer: React.FC = () => {
  const volunteerWorks = useVolunteer();

  return (
    <ProfileCard header={<h3>Volunteers</h3>}>
      <Stepper orientation="vertical" className="text-left" nonLinear>
        {volunteerWorks.map(item => (
          <Step key={item.organization + item.position} active expanded>
            <StepIcon icon={null} />
            <StepLabel icon={<Avatar width={50} height={50} alt={item.organization} />}>
              <div className="text-input flex flex-col gap-1">
                <h4>{item.organization}</h4>
                <span className="flex flex-wrap gap-2">
                  <h5>{item.position}</h5>
                  <h5>{' | '}</h5>
                  <h5>{item.website}</h5>
                </span>
                <h6 className="italic">{item.summary}</h6>
                <time className="text-sm italic">
                  {item.startDate} - {item.endDate}
                </time>
              </div>
            </StepLabel>
            <StepContent>
              <ul className="list-disc pl-2 flex flex-col gap-1.5">
                {item.highlights.map((highlight: string) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </ProfileCard>
  );
};

export default Volunteer;
