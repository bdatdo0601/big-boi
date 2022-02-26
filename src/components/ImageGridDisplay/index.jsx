import React from "react";
import PropTypes from "prop-types";
import { animated, useSpring } from "react-spring";
import { useDrag } from "react-use-gesture";

import "./index.less";

export default function ImageGridDisplay({ url, name, animation, style }) {
  const [animateProps, setAnimateProps] = useSpring(() => ({
    transform: [0, 0],
    objectFit: "contain",
    width: "100%",
    ...style,
    from: { transform: animation ? [0, -200] : [0, 0] },
    config: {
      mass: 10,
    },
  }));

  // Set the drag hook and define component movement based on gesture data
  const bind = useDrag(({ down, movement: [mx, my] }) => {
    setAnimateProps({
      transform:
        down && animation
          ? [mx > 0 ? Math.min(mx, 500) : Math.max(mx, -500), my > 0 ? Math.min(my, 500) : Math.max(my, -500)]
          : [0, 0],
      config: { mass: 0.5 },
    });
  });
  return (
    <animated.img
      className="image-grid-display"
      src={url}
      alt={name}
      {...bind()}
      style={{
        ...animateProps,
        transform: animateProps.transform.to((x, y) => `translate(${x}px, ${y}px)`),
      }}
    />
  );
}

ImageGridDisplay.propTypes = {
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  animation: PropTypes.bool,
  style: PropTypes.object,
};

ImageGridDisplay.defaultProps = {
  animation: false,
  style: {},
};
