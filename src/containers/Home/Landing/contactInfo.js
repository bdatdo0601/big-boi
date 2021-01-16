import React from "react";
import PropTypes from "prop-types";
import { Paper, Typography, Grid } from "@material-ui/core";
import { animated, useSpring } from "react-spring";
import { useDrag } from "react-use-gesture";
import ContactButton from "../../../components/ContactButton";

const AnimatedPaper = animated(Paper);

export default function ContactInfo({ className, contacts, animation }) {
  const [animateProps, setAnimateProps] = useSpring(() => ({
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
    transform: [0, 0],
    from: animation ? { transform: [0, -200] } : {},
    config: {
      mass: 10,
    },
  }));

  // Set the drag hook and define component movement based on gesture data
  const bind = useDrag(({ down, movement: [mx, my] }) => {
    setAnimateProps({ transform: down && animation ? [mx, my] : [0, 0], config: { mass: 3 } });
  });
  return (
    <AnimatedPaper
      className={className}
      elevation={3}
      {...bind()}
      style={{ ...animateProps, transform: animateProps.transform.to((x, y) => `translate(${x}px, ${y}px)`) }}
    >
      <Typography variant="h4" style={{ marginBottom: 24 }}>
        Contact
      </Typography>
      <Grid container>
        {contacts.map(contact => (
          <Grid item lg={12} md={4} xs={12} key={contact.key}>
            <ContactButton contact={contact} />
          </Grid>
        ))}
      </Grid>
    </AnimatedPaper>
  );
}

ContactInfo.propTypes = {
  className: PropTypes.string,
  contacts: PropTypes.array,
  animation: PropTypes.bool,
};

ContactInfo.defaultProps = {
  className: "px-8 py-8",
  contacts: [],
  animation: false,
};
