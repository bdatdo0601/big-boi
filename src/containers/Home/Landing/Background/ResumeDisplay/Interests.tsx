import { get } from 'lodash';
import React from 'react';
import { ChipButton } from '@/components/ChipButton';
import ProfileCard from '@/components/ProfileCard';
import { useInterests } from '@/components/Vitae';

const Interests: React.FC = () => {
  const interests = useInterests();

  return (
    <ProfileCard header={<h4>Interests</h4>}>
      {interests.map(interest => (
        <div
          key={interest.name}
          className="flex flex-col gap-2 text-left pl-3 border-l-4 border-primary-foreground mt-2 mb-6"
        >
          <h5 className="mb-1">{interest.name}</h5>
          <div className="flex flex-wrap gap-1">
            {get(interest, 'keywords', []).map((keyword: string) => (
              <ChipButton key={keyword} label={keyword} />
            ))}
          </div>
        </div>
      ))}
    </ProfileCard>
  );
};

export default Interests;
