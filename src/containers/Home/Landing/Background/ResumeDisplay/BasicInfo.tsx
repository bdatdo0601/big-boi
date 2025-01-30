import { EmailOutlined, Facebook, GitHub, LinkedIn, Twitter } from "@mui/icons-material";
import { get } from "lodash";
import { useBasic } from "@/components/Vitae";
import ProfileCard from "@/components/ProfileCard";
import { ChipButton } from "@/components/ChipButton";

interface IconMapperType {
  [key: string]: typeof Facebook | typeof GitHub | typeof LinkedIn | typeof Twitter;
}
const IconMapper: IconMapperType = {
  Facebook,
  LinkedIn,
  Twitter,
  GitHub,
};

export const BasicInfo: React.FC = () => {
  const basicInfo = useBasic();
  return (
    <ProfileCard
      header={
        <div className="text-input w-full px-4 py-2 rounded-lg text-center flex flex-col">
          <h1 className="text-xl font-medium text-input">
            {get(basicInfo, "name")}
          </h1>
          <span className="flex flex-row gap-1 mx-auto text-center mt-1 flex-wrap">
            <h2 className="text-xs font-normal text-input">
              {get(basicInfo, "label")}
            </h2>
            <span className="text-input text-xs">{" | "}</span>
            <span className="text-xs">
              {`${get(basicInfo, "location.city")} ${get(
                basicInfo,
                "location.postalCode"
              )}`}
            </span>
          </span>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <p className="text-base text-input text-justify mb-4 max-sm:mt-8 mt-4">
          {get(basicInfo, "summary")}
        </p>
        <div className="flex flex-row gap-2 flex-wrap">
          {get(basicInfo, "profiles", []).map((item) => {
            const Icon = IconMapper[item.network];
            return (
              <ChipButton key={item.username} label={item.username} icon={<Icon sx={{ fontSize: 18 }} />} url={item.url} />
            );
          })}
          <ChipButton label={get(basicInfo, "email")} icon={<EmailOutlined sx={{ fontSize: 18 }} />} url={`mailto:${get(basicInfo, "email")}`} />
        </div>
      </div>
    </ProfileCard>
  );
};
