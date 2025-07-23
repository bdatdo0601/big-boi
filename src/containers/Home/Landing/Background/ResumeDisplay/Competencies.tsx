import { get } from 'lodash';
import { ChipButton } from '@/components/ChipButton';
import ProfileCard from '@/components/ProfileCard';
import { useLanguages, useSkills } from '@/components/Vitae';

export const Competencies: React.FC = () => {
  const skills = useSkills();
  const languages = useLanguages();

  return (
    <ProfileCard header={<h3>Competencies</h3>}>
      {skills.map(skillset => (
        <div
          key={skillset.name}
          className="flex flex-col gap-2 text-left pl-3 border-l-4 border-primary-foreground mt-2 mb-6"
        >
          <h5 className="mb-2">
            {skillset.name} ({skillset.level})
          </h5>
          <div className="flex flex-wrap gap-1">
            {get(skillset, 'keywords', []).map((keyword: string) => (
              <ChipButton key={keyword} label={keyword} />
            ))}
          </div>
        </div>
      ))}
      <div className="flex flex-col gap-2 text-left pl-3 border-l-4 border-primary-foreground my-2.5">
        <h5>Languages</h5>
        <div className="flex flex-wrap gap-1 mb-1">
          {languages.map(language => (
            <ChipButton key={language.language} label={`${language.language} (${language.fluency})`} />
          ))}
        </div>
      </div>
    </ProfileCard>
  );
};
