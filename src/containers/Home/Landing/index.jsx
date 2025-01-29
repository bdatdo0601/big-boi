import React, { useContext, useMemo } from "react";
import { useMediaQuery } from "@mui/material";
import { isArray } from "lodash";
import PropTypes from "prop-types";
import LayoutContext from "../../../context/layout";
import MainInfo from "./mainInfo";
import ContactInfo from "./contactInfo";
import WelcomeInfo from "./welcomeInfo";
import ActionLogsInfo from "./actionLogsInfo";

export default function Landing({ keywords, contacts, bio }) {
  const { globalAnimation } = useContext(LayoutContext);
  const isFullSize = useMediaQuery("(min-width:1280px)");
  const contactInfo = useMemo(
    () => ({
      key: "contact-info",
      Component: ContactInfo,
      props: { animation: globalAnimation, contacts },
      span: {
        xs: 12,
        md: 12,
        lg: 12,
      },
    }),
    [globalAnimation, contacts]
  );
  const mainInfo = useMemo(
    () => ({
      key: "main-info",
      Component: MainInfo,
      props: {
        animation: globalAnimation,
        keywords,
        containerStyle: { marginBottom: "5rem" },
      },
      span: {
        xs: 12,
        md: 12,
        lg: 12,
      },
    }),
    [globalAnimation, keywords]
  );
  const actionLogsInfo = useMemo(
    () => ({
      key: "action-log-info",
      Component: ActionLogsInfo,
      props: { animation: globalAnimation, keywords },
      span: {
        xs: 12,
        md: 12,
        lg: 12,
      },
    }),
    [globalAnimation, keywords]
  );
  const welcomeInfo = useMemo(
    () => ({
      key: "welcome-info",
      Component: WelcomeInfo,
      props: { bio },
      span: {
        xs: 12,
        md: 12,
        lg: 12,
      },
    }),
    [bio]
  );
  const items = useMemo(
    () => [mainInfo, welcomeInfo, contactInfo, actionLogsInfo],
    [welcomeInfo, mainInfo, contactInfo, isFullSize, actionLogsInfo]
  );
  return (
    <div className="w-full max-w-[1600px] mx-auto">
      <div className="min-h-[80vh] mb-8 text-center flex flex-col items-center justify-center gap-32">
        {items.map((item) => (
          <div
            key={isArray(item) ? item[0].key : item.key}
            className="px-4 w-full"
          >
            {isArray(item) ? (
              <div className="flex flex-col items-center justify-between gap-8">
                {item.map(({ Component, props, key }) => (
                  <div key={key} className="px-4 w-full">
                    <Component {...props} />
                  </div>
                ))}
              </div>
            ) : (
              <item.Component {...item.props} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

Landing.propTypes = {
  keywords: PropTypes.arrayOf(PropTypes.string),
  contacts: PropTypes.arrayOf(PropTypes.object),
  bio: PropTypes.arrayOf(PropTypes.string),
};

Landing.defaultProps = {
  keywords: [],
  contacts: [],
  bio: [],
};
