import React, { useContext, useMemo } from "react";
import { Grid, useMediaQuery } from "@mui/material";
import PropTypes from "prop-types";
import LayoutContext from "../../../context/layout";
import MainInfo from "./mainInfo";
import ContactInfo from "./contactInfo";
import WelcomeInfo from "./welcomeInfo";

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
  const welcomeInfo = useMemo(() => ({ key: "welcome-info", Component: WelcomeInfo, props: { bio } }), [bio]);
  const items = useMemo(
    () => (isFullSize ? [welcomeInfo, mainInfo, contactInfo] : [mainInfo, welcomeInfo, contactInfo]),
    [welcomeInfo, mainInfo, contactInfo, isFullSize]
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
      {items.map(({ Component, props, key }) => (
        <Grid item xs={12} md={12} lg={4} key={key} style={{ paddingLeft: 0 }}>
          <Component {...props} />
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
