import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { StyledEngineProvider } from "@mui/material/styles";

const LayoutContext = React.createContext();

export const LayoutContextProvider = ({ children }) => {
  const [layout, setLayout] = useState();
  const [isDark, setIsDark] = useState(true);
  const [animation, setAnimation] = useState(true);
  const [globalAnimation, setGlobalAnimation] = useState(false);

  useEffect(() => {
    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    if (
      isDark &&
      !("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <LayoutContext.Provider
      value={{
        layout,
        setLayout,
        isDark,
        setIsDark,
        animation,
        setAnimation,
        globalAnimation,
        setGlobalAnimation,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

LayoutContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LayoutContext;
