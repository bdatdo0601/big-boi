import React from "react";
import PropTypes from "prop-types";
import { Paper, Typography, Grid } from "@material-ui/core";
import { animated, useSpring } from "react-spring";
import { useDrag } from "react-use-gesture";
import ContactButton from "../../../components/ContactButton";

const CONTACT_INFO = [
  {
    key: "Email",
    icon: {
      type: "Icon",
      value: "Email",
    },
    value: "dat.b.do@gmail.com",
    link: "mailto:dat.b.do@gmail.com",
  },
  {
    key: "Phone Number",
    icon: {
      type: "Icon",
      value: "Phone",
    },
    value: "(+1) 347-389-2684",
    link: "tel:+13473892684",
  },
  {
    key: "GitHub",
    icon: {
      type: "Icon",
      value: "GitHub",
    },
    value: "bdatdo0601",
    link: "http://www.github.com/bdatdo0601",
  },
  {
    key: "LinkedIn",
    icon: {
      type: "Icon",
      value: "LinkedIn",
    },
    value: "Dat Do",
    link: "http://linkedin.com/in/datdo/",
  },
];

const AnimatedPaper = animated(Paper);

export default function ContactInfo({ className, contacts, animation }) {
  const [animateProps, setAnimateProps] = useSpring(() => ({
    display: "flex",
    flexDirection: "column",
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
  contacts: CONTACT_INFO,
  animation: false,
};
