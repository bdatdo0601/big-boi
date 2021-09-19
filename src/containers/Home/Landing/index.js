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
    () => ({ key: "contact-info", Component: ContactInfo, props: { animation: globalAnimation, contacts } }),
    [globalAnimation, contacts]
  );
  const mainInfo = useMemo(
    () => ({
      key: "main-info",
      Component: MainInfo,
      props: { animation: globalAnimation, keywords, containerStyle: { marginBottom: "5rem" } },
    }),
    [globalAnimation, keywords]
  );
  const actionLogsInfo = useMemo(
    () => ({
      key: "action-log-info",
      Component: ActionLogsInfo,
      props: { animation: globalAnimation, keywords },
    }),
    [globalAnimation, keywords]
  );
  const welcomeInfo = useMemo(() => ({ key: "welcome-info", Component: WelcomeInfo, props: { bio } }), [bio]);
  const items = useMemo(
    () =>
      isFullSize
        ? [welcomeInfo, mainInfo, [actionLogsInfo, contactInfo]]
        : [mainInfo, welcomeInfo, [contactInfo, actionLogsInfo]],
    [welcomeInfo, mainInfo, contactInfo, isFullSize, actionLogsInfo]
  );
  return (
    <Grid
      container
      justifyContent={isFullSize ? "center" : "flex-start"}
      alignItems="center"
      alignContent="center"
      spacing={10}
      style={{ minHeight: "80vh", marginBottom: "2rem" }}
    >
      {items.map(item => (
        <Grid item xs={12} md={12} lg={4} key={isArray(item) ? item[0].key : item.key} style={{ paddingLeft: 0 }}>
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
                <Grid item xs={12} md={12} lg={12} key={key} style={{ paddingLeft: 0 }}>
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
