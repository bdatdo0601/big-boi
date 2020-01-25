import React, { useContext } from "react";
import Particles from "react-particles-js";
import Landing from "./Landing";
import particleConfig from "./particleConfig";
import LayoutContext from "../../context/layout";

export default function Home() {
  const { isDark } = useContext(LayoutContext);
  return (
    <>
      <Particles
        style={{ width: "100%", height: "100%", position: "fixed", zIndex: 0, top: 0, left: 0 }}
        params={particleConfig(isDark)}
      />
      <Landing />
    </>
  );
}
