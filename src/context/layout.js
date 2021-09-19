import React, { useState } from "react";
import PropTypes from "prop-types";
import { ThemeProvider, StyledEngineProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";

const LayoutContext = React.createContext();

export const LayoutContextProvider = ({ children }) => {
  const [layout, setLayout] = useState();
  const [isDark, setIsDark] = useState(true);
  const [animation, setAnimation] = useState(true);
  const [globalAnimation, setGlobalAnimation] = useState(true);
  const theme = createTheme({
    palette: {
      mode: isDark ? "dark" : "light",
      ...(!isDark
        ? {
            primary: {
              main: "#94735a",
            },
            secondary: {
              main: "#4a83c5",
            },
            error: {
              main: "#ac2020",
            },
          }
        : {
            primary: {
              main: "#4a83c5",
            },
            secondary: {
              main: "#736a73",
            },
            error: {
              main: "#d54a52",
            },
          }),
      /** .palette.primary
      .palette.secondary
      .palette.error
      .palette.warning
      .palette.info
      .palette.success
      */
    },
  });
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
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
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

LayoutContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LayoutContext;
