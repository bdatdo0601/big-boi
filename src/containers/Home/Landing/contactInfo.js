import React from "react";
import PropTypes from "prop-types";
import { Paper, Typography, Grid } from "@material-ui/core";
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
    value: "github.com/bdatdo0601",
    link: "http://www.github.com/bdatdo0601",
  },
  {
    key: "LinkedIn",
    icon: {
      type: "Icon",
      value: "LinkedIn",
    },
    value: "linkedin.com/in/datdo",
    link: "http://linkedin.com/in/datdo/",
  },
];

export default function ContactInfo({ className, contacts }) {
  return (
    <Paper className={className} elevation={3} style={{ display: "flex", flexDirection: "column" }}>
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
    </Paper>
  );
}

ContactInfo.propTypes = {
  className: PropTypes.string,
  contacts: PropTypes.array,
};

ContactInfo.defaultProps = {
  className: "px-8 py-8",
  contacts: CONTACT_INFO,
};
