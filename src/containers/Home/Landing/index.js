import React, { useContext, useEffect } from "react";
import { Grid } from "@material-ui/core";
import PropTypes from "prop-types";
import LayoutContext from "../../../context/layout";
import MainInfo from "./mainInfo";
import ContactInfo from "./contactInfo";

const keywordListMap = ["Puns Admirer", "Tech Enthusiast", "Programmer", "Software Engineer @ STW"];

export default function Landing({ keywords }) {
  const { setDefaultPadding, globalAnimation } = useContext(LayoutContext);
  useEffect(() => {
    setDefaultPadding(false);
  }, [setDefaultPadding]);
  return (
    <Grid
      className="px-2"
      container
      justify="center"
      alignItems="center"
      alignContent="flex-start"
      spacing={10}
      style={{ maxHeight: 1200, minHeight: "95vh" }}
    >
      <Grid style={{ height: 0, padding: 0 }} item xs={12} md={12} lg={4} />
      <Grid item xs={12} md={12} lg={4}>
        <MainInfo className="px-8 py-12" keywords={keywords} animation={globalAnimation} />
      </Grid>
      <Grid item style={{ zIndex: 1, marginTop: 72 }} xs={12} md={12} lg={4}>
        <ContactInfo animation={globalAnimation} />
      </Grid>
    </Grid>
  );
}

Landing.propTypes = {
  keywords: PropTypes.arrayOf(PropTypes.string),
};

Landing.defaultProps = {
  keywords: keywordListMap,
};
