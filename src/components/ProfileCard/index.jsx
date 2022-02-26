import React from "react";
import { Card, CardHeader, CardContent, CardActions, styled } from "@mui/material";
import PropTypes from "prop-types";
import { useSpring, animated } from "react-spring";
import { useDrag } from "react-use-gesture";

const AnimatedCard = animated(Card);

const classes = {
  card: "card",
  cardHeader: "cardHeader",
  headerContent: "headerContent",
};

const AnimatedCardStyled = styled(AnimatedCard)(({ theme }) => ({
  [`&.${classes.card}`]: { position: "relative", overflow: "visible", borderRadius: "10px" },
  [`& .${classes.cardHeader}`]: {
    display: "inline-block",
    width: "100%",
    padding: "0px",
    marginBottom: 12,
    overflow: "visible",
  },
  [`& .${classes.headerContent}`]: {
    boxShadow:
      "0 10px 30px -12px rgba(0, 0, 0, 0.42), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)",
    position: "absolute",
    width: "84%",
    marginLeft: "8%",
    marginRight: "8%",
    top: -15,
    borderRadius: "10px",
    minHeight: "55px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.palette.secondary.main,
    // backgroundImage: `linear-gradient(to bottom right, ${theme.palette.primary.main}, ${theme.palette.secondary.main});`,
  },
}));

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

  return (
    <AnimatedCardStyled
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
    </AnimatedCardStyled>
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
