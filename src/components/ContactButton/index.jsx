import React from "react";
import { styled } from '@mui/material/styles';
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import * as Icons from "@mui/icons-material";

const PREFIX = 'index';

const classes = {
  button: `${PREFIX}-button`
};

const StyledButton = styled(Button)(() => ({
  [`&.${classes.button}`]: {
    backgroundColor: "transparent",
    // color: theme.palette.secondary.main,
    boxShadow: "none",
  }
}));

export default function ContactButton({ contact }) {

  const ContactIcon = Icons[contact.icon.value];
  return (
    <StyledButton
      variant="text"
      size="large"
      className={classes.button}
      startIcon={contact.icon.type === "Icon" ? <ContactIcon /> : <img src={contact.icon.value} alt={contact.key} />}
      style={{ outline: "none", marginTop: 12 }}
    >
      <a href={contact.link}>{contact.value}</a>
    </StyledButton>
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
