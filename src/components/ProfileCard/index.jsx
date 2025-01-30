import React from "react";
import PropTypes from "prop-types";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

const AnimatedDiv = animated("div");

function ProfileCard({
  cardStyle,
  headerWrapperStyle,
  headerStyle,
  animation,
  children,
  contentStyle,
  header,
  footer,
  footerStyle,
}) {
  const [animateProps, setAnimateProps] = useSpring(() => ({
    transform: [0, 0],
    ...cardStyle,
    from: { transform: animation ? [0, -200] : [0, 0] },
    config: {
      mass: 10,
    },
  }));

  const bind = useDrag(({ down, movement: [mx, my] }) => {
    setAnimateProps({
      transform: down && animation ? [mx, my] : [0, 0],
      config: { mass: 3 },
    });
  });

  return (
    <AnimatedDiv
      className="relative overflow-visible rounded-lg bg-card"
      style={{
        ...animateProps,
        transform: animateProps.transform.to(
          (x, y) => `translate(${x}px, ${y}px)`
        ),
      }}
      {...bind()}
    >
      <div className="inline-block w-full p-0 mb-3 overflow-visible text-input">
        <div
          className="z-10 overflow-visible mb-6"
          style={headerWrapperStyle}
        >
          <div
            className="absolute w-[84%] ml-[8%] mr-[8%] -top-4 rounded-lg min-h-[55px] flex justify-center items-center bg-[var(--popover)] text-[var(--popover-foreground)] shadow-lg"
            style={headerStyle}
          >
            {header}
          </div>
        </div>
      </div>
      <div className="p-4" style={contentStyle}>
        {children}
      </div>
      <div className="p-4" style={footerStyle}>
        {footer}
      </div>
    </AnimatedDiv>
  );
}

ProfileCard.propTypes = {
  cardStyle: PropTypes.object,
  headerStyle: PropTypes.object,
  animation: PropTypes.bool,
  children: PropTypes.node,
  contentStyle: PropTypes.object,
  footerStyle: PropTypes.object,
  content: PropTypes.node,
  footer: PropTypes.node,
  headerWrapperStyle: PropTypes.object,
  header: PropTypes.node,
};

ProfileCard.defaultProps = {
  cardStyle: {},
  headerStyle: {},
  contentStyle: {},
  footerStyle: {},
  animation: false,
  children: null,
  content: null,
  footer: null,
  headerWrapperStyle: {},
  header: null,
};

export default ProfileCard;
