import React from "react";
import {
  Avatar,
  Step,
  StepIcon,
  StepLabel,
  Stepper,
} from "@mui/material";
import { useEducation } from "@/components/Vitae";
import ProfileCard from "@/components/ProfileCard";

interface EducationItem {
  institution: string;
  studyType: string;
  area: string;
  gpa: string;
  startDate: string;
  endDate: string;
}

export const Education: React.FC = () => {
  const educations = useEducation() as EducationItem[];

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
                <Avatar sx={{ width: 50, height: 50 }}>
                  {item.institution[0] || ""}
                </Avatar>
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
