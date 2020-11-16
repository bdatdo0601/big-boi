import React, { useContext, useMemo } from "react";
import { Grid } from "@material-ui/core";
import PropTypes from "prop-types";
import { useMediaQuery } from "@material-ui/core";
import LayoutContext from "../../../context/layout";
import MainInfo from "./mainInfo";
import ContactInfo from "./contactInfo";
import WelcomeInfo from "./welcomeInfo";

const keywordListMap = ["Puns Admirer", "Tech Enthusiast", "Programmer", "Software Engineer @ STW"];

export default function Landing({ keywords }) {
  const { globalAnimation } = useContext(LayoutContext);
  const isFullSize = useMediaQuery("(min-width:1280px)");
  const contactInfo = useMemo(
    () => ({ key: "contact-info", Component: ContactInfo, props: { animation: globalAnimation } }),
    [globalAnimation]
  );
  const mainInfo = useMemo(
    () => ({
      key: "main-info",
      Component: MainInfo,
      props: { animation: globalAnimation, keywords, containerStyle: { marginBottom: "5rem" } },
    }),
    [globalAnimation, keywords]
  );
  const welcomeInfo = useMemo(() => ({ key: "welcome-info", Component: WelcomeInfo, props: {} }), []);
  const items = useMemo(
    () => (isFullSize ? [welcomeInfo, mainInfo, contactInfo] : [mainInfo, welcomeInfo, contactInfo]),
    [welcomeInfo, mainInfo, contactInfo, isFullSize]
  );
  return (
    <Grid
      className="px-2"
      container
      justify={isFullSize ? "center" : "flex-start"}
      alignItems="center"
      alignContent="center"
      spacing={10}
      style={{ minHeight: "80vh", marginBottom: "2rem" }}
    >
      {items.map(({ Component, props, key }) => (
        <Grid item xs={12} md={12} lg={4} key={key}>
          <Component {...props} />
        </Grid>
      ))}
    </Grid>
  );
}

Landing.propTypes = {
  keywords: PropTypes.arrayOf(PropTypes.string),
};

Landing.defaultProps = {
  keywords: keywordListMap,
};
