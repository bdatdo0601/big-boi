import {
  Avatar,
  Step,
  StepContent,
  StepIcon,
  StepLabel,
  Stepper,
} from "@mui/material";
import React from "react";
import {
  useWork,
} from "@/components/Vitae";
import ProfileCard from "@/components/ProfileCard";

interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  summary: string;
  website?: string;
  highlights: string[];
}

const Experiences: React.FC = () => {
  const experiences: WorkExperience[] = useWork();
  return (
    <ProfileCard
      header={
        <h2 className="text-xl font-bold text-input">Experiences</h2>
      }
    >
      <Stepper orientation="vertical" className="text-left" nonLinear>
        {experiences.map((item: WorkExperience) => (
          <Step key={item.company + item.position} active expanded>
            <StepIcon icon={null} />
            <StepLabel
              icon={
                <Avatar sx={{ width: 50, height: 50 }}>
                  {item.company[0] || ""}
                </Avatar>
              }
            >
              <div className="text-input flex flex-col gap-1">
                <h3 className="text-xl font-bold">{item.company}</h3>
                <span className="flex flex-wrap gap-2">
                  <p className="text-md font-normal">{item.position}</p>
                  <span>{" | "}</span>
                  <p className="text-md font-normal italic">
                    {item.summary} {item.website && `- ${item.website}`}
                  </p>
                </span>
                <p className="text-sm italic">{item.startDate} - {item.endDate}</p>
              </div>
            </StepLabel>
            <StepContent>
              <ul className="list-disc pl-2 flex flex-col gap-1.5">
                {item.highlights.map((highlight: string) => (
                  <li key={highlight} className="text-sm text-input">{highlight}</li>
                ))}
              </ul>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </ProfileCard>
  );
};

export default Experiences;