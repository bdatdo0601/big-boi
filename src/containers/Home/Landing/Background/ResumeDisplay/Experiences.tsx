import {
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
import Avatar from "@/components/Avatar";

const Experiences: React.FC = () => {
  const experiences = useWork();
  return (
    <ProfileCard
      header={
        <h3>Experiences</h3>
      }
    >
      <Stepper orientation="vertical" className="text-left" nonLinear>
        {experiences.map((item) => (
          <Step key={item.company + item.position} active expanded>
            <StepIcon icon={null} />
            <StepLabel
              icon={
                <Avatar width={50} height={50} alt={item.company} src={item.icon}/>
              }
            >
              <div className="text-input flex flex-col gap-1">
                <h4>{item.company}</h4>
                <span className="flex flex-wrap gap-2">
                  <h5>{item.position}</h5>
                  <h5>{" | "}</h5>
                  <h5 className="italic">
                    {item.summary} {item.website && `- ${item.website}`}
                  </h5>
                </span>
                <time className="text-base italic">{item.startDate} - {item.endDate}</time>
              </div>
            </StepLabel>
            <StepContent>
              <ul className="list-disc pl-2 flex flex-col gap-1">
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

export default Experiences;