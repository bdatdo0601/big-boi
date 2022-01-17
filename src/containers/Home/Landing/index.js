import React, { useContext, useMemo } from "react";
import { Grid, useMediaQuery } from "@mui/material";
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
        lg: 4,
      },
    }),
    [globalAnimation, contacts]
  );
  const mainInfo = useMemo(
    () => ({
      key: "main-info",
      Component: MainInfo,
      props: { animation: globalAnimation, keywords, containerStyle: { marginBottom: "5rem" } },
      span: {
        xs: 12,
        md: 12,
        lg: 4,
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
        lg: 4,
      },
    }),
    [bio]
  );
  const items = useMemo(
    () =>
      isFullSize
        ? [welcomeInfo, mainInfo, contactInfo, actionLogsInfo]
        : [mainInfo, welcomeInfo, contactInfo, actionLogsInfo],
    [welcomeInfo, mainInfo, contactInfo, isFullSize, actionLogsInfo]
  );
  return (
    <div style={{ width: "100%", maxWidth: 1900, margin: "0 auto" }}>
      <Grid
        container
        justifyContent={isFullSize ? "center" : "flex-start"}
        alignItems="center"
        alignContent="center"
        spacing={10}
        style={{ minHeight: "80vh", marginBottom: "2rem" }}
      >
        {items.map(item => (
          <Grid
            item
            {...item.span}
            key={isArray(item) ? item[0].key : item.key}
            style={{ paddingLeft: "1rem", paddingRight: "1rem" }}
          >
            {isArray(item) ? (
              <Grid
                container
                justifyContent="space-between"
                direction="column"
                alignItems="center"
                alignContent="center"
                spacing={2}
              >
                {item.map(({ Component, props, key }) => (
                  <Grid
                    item
                    {...item.span}
                    key={key}
                    style={{ paddingLeft: "1rem", paddingRight: "1rem", width: "100%" }}
                  >
                    <Component {...props} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <item.Component {...item.props} />
            )}
          </Grid>
        ))}
      </Grid>
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
