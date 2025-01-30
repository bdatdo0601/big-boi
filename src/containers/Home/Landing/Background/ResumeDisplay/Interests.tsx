import { Card, Chip } from "@mui/material";
import { get } from "lodash";
import React from "react";
import { useInterests } from "@/components/Vitae";
import ProfileCard from "@/components/ProfileCard";
import { ChipButton } from "@/components/ChipButton";

interface Interest {
  name: string;
  keywords?: string[];
}

const Interests: React.FC = () => {
  const interests = useInterests();

  return (
    <ProfileCard
      header={<h2 className="text-xl text-input">Interests</h2>
      }
    >
      {interests.map((interest: Interest) => (
        <div
          key={interest.name}
          className="flex flex-col gap-2 text-left pl-3 border-l-4 border-primary-foreground mt-2 mb-6"
        >
          <h3 className="text-md text-input mb-1">
            {interest.name}
          </h3>
          <div className="flex flex-wrap gap-1">
            {get(interest, "keywords", []).map((keyword: string) => (
              <ChipButton
                key={keyword}
                label={keyword}
              />
            ))}
          </div>
        </div>
      ))}
    </ProfileCard>
  );
};

export default Interests;