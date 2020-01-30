import React, { useContext } from "react";
import Particles from "react-particles-js";
import Landing from "./Landing";
import particleConfig from "./particleConfig";
import LayoutContext from "../../context/layout";
import About from "./About";

export default function Home() {
  const { isDark } = useContext(LayoutContext);
  return (
    <>
      <Particles
        style={{ width: "100vw", height: "100vh", position: "fixed", zIndex: -1, top: 0, left: 0 }}
        params={particleConfig(isDark)}
      />
      <Landing />
      <About />
    </>
  );
}
