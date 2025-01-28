import { getDomainWithoutSubdomain } from "../utils";
import { WEBSITE_TITLE } from "../utils/constants";

export const LogoTitle = () => {
  return <a
    className="text-primary text-2xl font-bold"
    href={getDomainWithoutSubdomain()}
  >
    {WEBSITE_TITLE}
  </a>;
};
