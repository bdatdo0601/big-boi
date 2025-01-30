import {
  Avatar,
  Step,
  StepContent,
  StepIcon,
  StepLabel,
  Stepper,
} from "@mui/material";
import React from "react";
import { useVolunteer } from "@/components/Vitae";
import ProfileCard from "@/components/ProfileCard";

interface VolunteerWork {
  organization: string;
  position: string;
  startDate: string;
  endDate: string;
  summary: string;
  website: string;
  highlights: string[];
}

const Volunteer: React.FC = () => {
  const volunteerWorks = useVolunteer();

  return (
    <ProfileCard
      header={
        <h2 className="text-xl text-input">Volunteers</h2>
      }
    >
      <Stepper orientation="vertical" className="text-left" nonLinear>
        {volunteerWorks.map((item: VolunteerWork) => (
          <Step key={item.organization + item.position} active expanded>
            <StepIcon icon={null} />
            <StepLabel
              icon={
                <Avatar sx={{ width: 50, height: 50 }}>
                  {item.organization[0] || ""}
                </Avatar>
              }
            >
              <div className="text-input flex flex-col gap-1">
                <h3 className="text-xl font-bold">{item.organization}</h3>
                <span className="flex flex-wrap gap-2">
                  <p className="text-md font-normal">{item.position}</p>
                  <span>{" | "}</span>
                  <p className="text-md font-normal">
                    {item.website}
                  </p>
                </span>
                <p className="text-md font-normal italic">
                  {item.summary}
                </p>
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

export default Volunteer;