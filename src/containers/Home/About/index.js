import React from "react";
import ImagesDisplay from "./imagesDisplay";

export default function About() {
  return (
    <div
      className="mx-12 py-8"
      style={{
        zIndex: 2,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ImagesDisplay />
    </div>
  );
}

About.propTypes = {};
About.defaultProps = {};
