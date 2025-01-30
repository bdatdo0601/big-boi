import { get } from "lodash";
import {
  useSkills,
  useLanguages,
} from "@/components/Vitae";
import ProfileCard from "@/components/ProfileCard";
import { ChipButton } from "@/components/ChipButton";

export const Competencies: React.FC = () => {
  const skills = useSkills();
  const languages = useLanguages();

  return (
    <ProfileCard
      header={
        <h2 className="text-xl text-input font-medium">Competencies</h2>
      }
    >
      {skills.map((skillset) => (
        <div
          key={skillset.name}
          className="flex flex-col gap-2 text-left pl-3 border-l-4 border-primary-foreground mt-2 mb-6"
        >
          <h3 className="text-md text-input mb-1">
            {skillset.name} ({skillset.level})
          </h3>
          <div className="flex flex-wrap gap-1">
            {get(skillset, "keywords", []).map((keyword: string) => (
              <ChipButton
                key={keyword}
                label={keyword}
              />
            ))}
          </div>
        </div>
      ))}
      <div
        className="flex flex-col gap-2 text-left pl-3 border-l-4 border-primary-foreground my-2.5"
      >
        <h3 className="text-md text-input">
          Languages
        </h3>
        <div className="flex flex-wrap gap-1 mb-1">
          {languages.map((language) => (
            <ChipButton
              key={language.language}
              label={`${language.language} (${language.fluency})`}
            />
          ))}
        </div>

      </div>
    </ProfileCard>
  );
};