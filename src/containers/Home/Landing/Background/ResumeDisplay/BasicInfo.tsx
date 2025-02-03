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
          <h3>
            {get(basicInfo, "name")}
          </h3>
          <span className="flex flex-row gap-1 mx-auto text-center mt-1 flex-wrap justify-center">
            <h5 className="">
              {get(basicInfo, "label")}
            </h5>
            <h5>{" | "}</h5>
            <h5 className="">
              {`${get(basicInfo, "location.city")} ${get(
                basicInfo,
                "location.postalCode"
              )}`}
            </h5>
          </span>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <p className="text-input text-justify mb-4 max-sm:mt-12 mt-8">
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
