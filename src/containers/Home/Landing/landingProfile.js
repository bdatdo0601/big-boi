import React, { useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { useSpring, animated } from "react-spring";
import { Typography } from "@material-ui/core";
import MAIN_PICTURE from "../../../assets/main_picture.jpg";
import LayoutContext from "../../../context/layout";

export default function LandingProfile({ image, name, wrapperStyle, imageStyle }) {
  const { isDark, setDefaultPadding } = useContext(LayoutContext);
  const imageProps = useSpring({
    from: { opacity: 0, transform: "translateY(-100)" },
    transform: "translateY(0)",
    opacity: 1,
    marginBottom: 32,
    width: 200,
    height: 200,
    borderRadius: "50%",
    border: `${isDark ? "#fff" : "#000"} solid 5px`,
    ...imageStyle,
  });
  useEffect(() => {
    setDefaultPadding(false);
  }, [setDefaultPadding]);
  return (
    <div
      style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 72,
        marginBottom: 32,
        ...wrapperStyle,
      }}
    >
      <animated.img src={image} alt="main_picture" style={imageProps} />
      <Typography variant="h3">{name}</Typography>
    </div>
  );
}

LandingProfile.propTypes = {
  image: PropTypes.string,
  name: PropTypes.string,
  title: PropTypes.string,
  wrapperStyle: PropTypes.object,
  imageStyle: PropTypes.object,
};

LandingProfile.defaultProps = {
  image: MAIN_PICTURE,
  name: "Dat Do",
  title: "Software Engineer @ STW",
  wrapperStyle: {},
  imageStyle: {},
};
