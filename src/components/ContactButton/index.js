import React from "react";
import PropTypes from "prop-types";
import { Button, makeStyles } from "@material-ui/core";
import * as Icons from "@material-ui/icons";

const useStyles = makeStyles(() => ({
  button: {
    backgroundColor: "transparent",
    // color: theme.palette.secondary.main,
    boxShadow: "none",
  },
}));

export default function ContactButton({ contact }) {
  const classes = useStyles();
  const ContactIcon = Icons[contact.icon.value];
  return (
    <Button
      variant="text"
      size="large"
      className={classes.button}
      startIcon={contact.icon.type === "Icon" ? <ContactIcon /> : <img src={contact.icon.value} alt={contact.key} />}
      style={{ outline: "none", marginTop: 12 }}
    >
      <a href={contact.link}>{contact.value}</a>
    </Button>
  );
}

ContactButton.propTypes = {
  contact: PropTypes.object,
};

ContactButton.defaultProps = {
  contact: {
    key: "UnknwonKey",
    name: "Unknown",
    icon: {
      type: "Icon",
      value: "Save",
    },
    value: "unknown",
    link: "unknown",
  },
};
