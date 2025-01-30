import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { StyledEngineProvider } from "@mui/material/styles";
import useLocalStorageState from "use-local-storage-state";

const LayoutContext = React.createContext();

export const LayoutContextProvider = ({ children }) => {
  const [layout, setLayout] = useState();
  const [isDark, setIsDark] = useLocalStorageState("darkMode", {
    defaultValue: window.matchMedia("(prefers-color-scheme: dark)").matches,
  });
  const [animation, setAnimation] = useLocalStorageState("animation", {
    defaultValue: true,
  });
  const [globalAnimation, setGlobalAnimation] = useLocalStorageState("globalAnimation", {
    defaultValue: true,
  });

  useEffect(() => {
    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    if (isDark) {
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
