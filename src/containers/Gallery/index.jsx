import { Typography } from "@mui/material";
import React, { useContext } from "react";
import ProfileCard from "../../components/ProfileCard";
import LayoutContext from "../../context/layout";
import ImagesDisplay from "./imagesDisplay";
import "./index.less";

const descriptions = [
  "I put in here some of my best memory with friends and families, along with my interest outside of programming.",
  "Hopefully this would give you a sense of my personality and identity before we meet in person.",
];

export default function Gallery() {
  const { globalAnimation } = useContext(LayoutContext);

  return (
    <div
      className="mx-12 py-2"
      style={{
        zIndex: 2,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "calc(100vh - 64px)",
      }}
    >
      <div className="images-display-wrapper">
        <ProfileCard
          header={<Typography variant="h4">Gallery</Typography>}
          contentStyle={{ paddingLeft: 16, paddingRight: 16 }}
          animation={globalAnimation}
        >
          <div className="mx-4 my-2" style={{ textAlign: "left" }}>
            {descriptions.map(item => (
              <Typography key={item} variant="body1" paragraph>
                {item}
              </Typography>
            ))}
          </div>
        </ProfileCard>
        <div className="my-4">
          <ImagesDisplay />
        </div>
      </div>
    </div>
  );
}

Gallery.propTypes = {};
Gallery.defaultProps = {};
