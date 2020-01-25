import React, { useContext, useEffect } from "react";
import { Grid } from "@material-ui/core";
import PropTypes from "prop-types";
import LayoutContext from "../../../context/layout";
import MainInfo from "./mainInfo";
import ContactInfo from "./contactInfo";

const keywordListMap = ["Puns Admirer", "Tech Enthusiast", "Programmer", "Software Engineer @ STW"];

export default function Landing({ keywords }) {
  const { setDefaultPadding } = useContext(LayoutContext);
  useEffect(() => {
    setDefaultPadding(false);
  }, [setDefaultPadding]);
  return (
    <Grid className="px-2" container justify="center" alignItems="center" alignContent="center" spacing={10}>
      <Grid style={{ height: 0 }} item xs={12} md={12} lg={4} />
      <Grid item xs={12} md={12} lg={4}>
        <MainInfo className="px-8 py-12" keywords={keywords} />
      </Grid>
      <Grid item style={{ zIndex: 1, marginTop: 72 }} xs={12} md={12} lg={4}>
        <ContactInfo />
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
