import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";
import ProfileCard from "../../../components/ProfileCard";
import LayoutContext from "../../../context/layout";
import { Download } from "@mui/icons-material";

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
      <div className="flex flex-col items-center">
        <div className="mx-4 my-2 text-left">
          {bio.map((item) => (
            <p key={item} className="text-input">
              {item}
            </p>
          ))}
        </div>
        <button
          onClick={() => {
            window.location.href = `${window.location.protocol}//${window.location.host}/custom/resume.pdf`;
          }}
          className="hover:cursor-pointer rounded-xl w-[200px] text-input shadow-lg bg-secondary px-2 py-2 mt-4"
        >
          <Download sx={{ color: "var(--input)" }} /> My Latest Resume
        </button>
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
