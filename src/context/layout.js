import React, { useState } from "react";
import PropTypes from "prop-types";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";

const LayoutContext = React.createContext();

export const LayoutContextProvider = ({ children }) => {
  const [layout, setLayout] = useState();
  const [isDark, setIsDark] = useState(true);
  const [animation, setAnimation] = useState(true);
  const [globalAnimation, setGlobalAnimation] = useState(true);
  const theme = createMuiTheme({
    palette: {
      type: isDark ? "dark" : "light",
      primary: {
        // light: will be calculated from palette.primary.main,
        main: "#388e3c",
        light: "#66bb6a",
        dark: "#2e7d32",
        // dark: will be calculated from palette.primary.main,
        // contrastText: will be calculated to contrast with palette.primary.main
      },
      secondary: {
        light: "#42a5f5",
        main: "#1976d2",
        dark: "#1e88e5",
      },
      // Used by `getContrastText()` to maximize the contrast between
      // the background and the text.
      contrastThreshold: 3,
      // Used by the functions below to shift a color's luminance by approximately
      // two indexes within its tonal palette.
      // E.g., shift from Red 500 to Red 300 or Red 700.
      tonalOffset: 0.2,
    },
  });
  return (
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
  );
};

LayoutContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LayoutContext;
