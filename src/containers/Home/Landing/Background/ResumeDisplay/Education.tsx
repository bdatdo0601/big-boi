import React from "react";
import {
  Step,
  StepIcon,
  StepLabel,
  Stepper,
} from "@mui/material";
import { useEducation } from "@/components/Vitae";
import ProfileCard from "@/components/ProfileCard";
import Avatar from "@/components/Avatar";

export const Education: React.FC = () => {
  const educations = useEducation();

  return (
    <ProfileCard
      header={
        <h3>
          Education
        </h3>
      }
    >
      <Stepper orientation="vertical" className="text-left" nonLinear>
        {educations.map((item) => (
          <Step key={item.institution}>
            <StepIcon icon={null} />
            <StepLabel
              icon={
                <Avatar width={50} height={50} alt={item.institution} />
              }
            >
              <div className="text-input flex flex-col gap-1">
                <h4>{item.institution}</h4>
                <h5>{item.studyType}: {item.area} (GPA: {item.gpa})</h5>
                <time className="italic">{item.startDate} - {item.endDate}</time>
              </div>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </ProfileCard>
  );
};
