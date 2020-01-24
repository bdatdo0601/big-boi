import React, { useContext, useEffect } from "react";
import Particles from "react-particles-js";
import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";
import BLANK_INDEX_CARD from "../../../assets/blank-index-card.jpg";
import DataStack from "../../../components/DataStack";
import LayoutContext from "../../../context/layout";
import LandingProfile from "./landingProfile";
import particleConfig from "./particleConfig";

const keywordListMap = ["Puns Admirer", "Tech Enthusiast", "Programmer", "Software Engineer @ STW"];

export default function Landing({ keywords, containerStyle }) {
  const { setDefaultPadding, isDark } = useContext(LayoutContext);
  useEffect(() => {
    setDefaultPadding(false);
  }, [setDefaultPadding]);
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          justifyItems: "center",
          alignItems: "center",
          alignContent: "center",
          flexDirection: "column",
          height: "93vh",
          width: "100%",
          ...containerStyle,
        }}
      >
        <Particles
          style={{ width: "100%", height: "100%", position: "absolute", zIndex: 0, top: 0, left: 0 }}
          params={particleConfig(isDark)}
        />
        <LandingProfile containerStyle={{ zIndex: 1 }} imageStyle={{ zIndex: 1 }} />
        <div style={{ flex: 1, width: "100%" }}>
          <DataStack
            dataList={keywords.map(keyword => (
              <>
                <Typography variant="h4" style={{ fontFamily: "Kalam", color: "black" }}>
                  {keyword}
                </Typography>
              </>
            ))}
            listStyle={{
              marginTop: 100,
              paddingTop: 0,
            }}
            itemContainerStyle={{
              height: 200,
              width: 300,
              cursor: "pointer",
              textAlign: "center",
              zIndex: 3,
            }}
            itemStyle={{
              background: `url(${BLANK_INDEX_CARD})`,
              backgroundSize: "cover",
            }}
          />
        </div>
      </div>
    </>
  );
}

Landing.propTypes = {
  keywords: PropTypes.arrayOf(PropTypes.string),
  containerStyle: PropTypes.object,
};

Landing.defaultProps = {
  keywords: keywordListMap,
  containerStyle: {},
};
