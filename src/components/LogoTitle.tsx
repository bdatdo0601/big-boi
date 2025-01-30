import React from "react";
import { getDomainWithoutSubdomain } from "../utils";
import { WEBSITE_TITLE } from "../utils/constants";
import { capitalize } from "lodash";

interface LogoTitleProps {
  isSubdomainRoute?: boolean;
  subdomain?: string;
}

export const LogoTitle: React.FC<LogoTitleProps> = ({
  isSubdomainRoute,
  subdomain,
}) => {
  return (
    <a
      className="text-primary text-2xl font-bold flex flex-row gap-1"
      href={getDomainWithoutSubdomain()}
    >
      {WEBSITE_TITLE}
      {isSubdomainRoute && (
        <a
          className="text-input text-2xl font-bold"
          href={window.location.href}
        >
          : {capitalize(subdomain)}
        </a>
      )}
    </a>
  );
};
