import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Paper, Typography, Grid } from "@mui/material";
import { animated, useSpring } from "react-spring";
import { useDrag } from "react-use-gesture";
import ContactButton from "../../../components/ContactButton";
import ProfileCard from "../../../components/ProfileCard";
import LayoutContext from "../../../context/layout";

const AnimatedPaper = animated(Paper);

export default function ContactInfo({ className, contacts }) {
  const { globalAnimation } = useContext(LayoutContext);

  return (
    <ProfileCard
      header={<Typography variant="h5">Contact Me!</Typography>}
      contentStyle={{ paddingLeft: 16, paddingRight: 16 }}
      animation={globalAnimation}
      cardStyle={{ maxWidth: 600, margin: "0 auto" }}
    >
      <Grid container style={{ textAlign: "left" }}>
        {contacts.map(contact => (
          <Grid item lg={12} md={4} xs={12} key={contact.key}>
            <ContactButton contact={contact} />
          </Grid>
        ))}
      </Grid>
    </ProfileCard>
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
