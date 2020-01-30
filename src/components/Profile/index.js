import React, { useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { useSpring, animated } from "react-spring";
import { Typography } from "@material-ui/core";
import MAIN_PICTURE from "../../assets/main_picture.jpg";
import LayoutContext from "../../context/layout";
import { useDrag } from "react-use-gesture";

import "./index.less";

export default function Profile({ image, name, wrapperStyle, imageStyle }) {
  const { isDark, setDefaultPadding } = useContext(LayoutContext);
  const [imageProps, setImageProps] = useSpring(() => ({
    from: { opacity: 0, transform: [0, -100] },
    transform: [0, 0],
    opacity: 1,
    marginBottom: 32,
    borderRadius: "50%",
    border: `${isDark ? "#fff" : "#000"} solid 5px`,
    ...imageStyle,
    config: {
      mass: 2,
    },
  }));
  useEffect(() => {
    setDefaultPadding(false);
  }, [setDefaultPadding]);
  // Set the drag hook and define component movement based on gesture data
  const bind = useDrag(({ down, movement: [mx, my] }) => {
    setImageProps({
      transform: down ? [mx, my] : [0, 0],
    });
  });
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
      <animated.img
        className="w-56 h-56 profile-image"
        src={image}
        alt="main_picture"
        style={{ ...imageProps, transform: imageProps.transform.interpolate((x, y) => `translate(${x}px, ${y}px)`) }}
        {...bind()}
      />
      <Typography variant="h3">{name}</Typography>
    </div>
  );
}

Profile.propTypes = {
  image: PropTypes.string,
  name: PropTypes.string,
  title: PropTypes.string,
  wrapperStyle: PropTypes.object,
  imageStyle: PropTypes.object,
};

Profile.defaultProps = {
  image: MAIN_PICTURE,
  name: "Dat Do",
  title: "Software Engineer @ STW",
  wrapperStyle: {},
  imageStyle: {},
};
