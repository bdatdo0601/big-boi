import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";
import BLANK_INDEX_CARD from "../../../assets/blank-index-card.jpg";
import DataStack from "../../../components/DataStack";
import LandingProfile from "../../../components/Profile";

const MainInfo = ({ keywords, containerStyle, className, animation }) => (
  <div
    className={`px-4 ${className}`}
    style={{
      display: "flex",
      justifyContent: "space-between",
      justifyItems: "center",
      alignItems: "center",
      alignContent: "center",
      flexDirection: "column",
      ...containerStyle,
    }}
  >
    <LandingProfile containerStyle={{ zIndex: 1 }} imageStyle={{ zIndex: 1 }} animation={animation} />
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
);

MainInfo.propTypes = {
  className: PropTypes.string,
  keywords: PropTypes.arrayOf(PropTypes.string),
  containerStyle: PropTypes.object,
  animation: PropTypes.bool,
};

MainInfo.defaultProps = {
  className: "",
  keywords: [],
  containerStyle: {},
  animation: false,
};

export default MainInfo;
