import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";
import ProfileCard from "../../../components/ProfileCard";
import LayoutContext from "../../../context/layout";

export default function WelcomeInfo({ bio }) {
  const { globalAnimation } = useContext(LayoutContext);
  return (
    <ProfileCard
      header={<span className="text-2xl text-input">Hello There!</span>}
      contentStyle={{
        paddingLeft: 16,
        paddingRight: 16,
      }}
      cardStyle={{ maxWidth: 600, margin: "0 auto" }}
      animation={globalAnimation}
    >
      <div className="mx-4 my-2 text-left">
        {bio.map(item => (
          <Typography key={item} variant="body1" className="text-input">
            {item}
          </Typography>
        ))}
      </div>
    </ProfileCard>
  );
}

WelcomeInfo.propTypes = {
  bio: PropTypes.arrayOf(PropTypes.string),
};
WelcomeInfo.defaultProps = {
  bio: [],
};
