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
        <span className="text-xl text-input">
          Education
        </span>
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
                <h6 className="text-xl font-bold">{item.institution}</h6>
                <p className="text-md font-normal">{item.studyType}: {item.area} (GPA: {item.gpa})</p>
                <p className="text-sm italic">{item.startDate} - {item.endDate}</p>
              </div>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </ProfileCard>
  );
};
