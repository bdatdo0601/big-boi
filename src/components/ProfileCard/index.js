import React from "react";
import { Card, CardHeader, CardContent, CardActions } from "@material-ui/core";
import PropTypes from "prop-types";
import useStyles from "./styleHooks";
import { useSpring, animated } from "react-spring";
import { useDrag } from "react-use-gesture";

const AnimatedCard = animated(Card);

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

  // Set the drag hook and define component movement based on gesture data
  const bind = useDrag(({ down, movement: [mx, my] }) => {
    setAnimateProps({
      transform: down && animation ? [mx, my] : [0, 0],
      config: { mass: 3 },
    });
  });
  const classes = useStyles();
  return (
    <AnimatedCard
      className={classes.card}
      style={{
        ...animateProps,
        transform: animateProps.transform.to((x, y) => `translate(${x}px, ${y}px)`),
      }}
      {...bind()}
    >
      <CardHeader
        className={classes.cardHeader}
        subheader={
          <div style={{ zIndex: 2, overflow: "visible", marginBottom: "24px", ...headerWrapperStyle }}>
            <div className={classes.headerContent} style={headerStyle}>
              {header}
            </div>
          </div>
        }
      />
      <CardContent style={contentStyle}>{children}</CardContent>
      <CardActions style={footerStyle}>{footer}</CardActions>
    </AnimatedCard>
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
