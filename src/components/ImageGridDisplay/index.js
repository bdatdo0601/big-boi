import React from "react";
import PropTypes from "prop-types";
import { animated, useSpring } from "react-spring";
import { useDrag } from "react-use-gesture";

import "./index.less";

export default function ImageGridDisplay({ url, name, animation, style }) {
  const [animateProps, setAnimateProps] = useSpring(() => ({
    transform: [0, 0],
    objectFit: "cover",
    width: "100%",
    minHeight: "100%",
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
          ? [mx > 0 ? Math.min(mx, 40) : Math.max(mx, -40), my > 0 ? Math.min(my, 40) : Math.max(my, -40)]
          : [0, 0],
      config: { mass: 3 },
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
