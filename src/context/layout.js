import React, { useState } from "react";
import PropTypes from "prop-types";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";

const LayoutContext = React.createContext();

export const LayoutContextProvider = ({ children }) => {
  const [layout, setLayout] = useState();
  const [isDark, setIsDark] = useState(true);
  const [animation, setAnimation] = useState(true);
  const [defaultPadding, setDefaultPadding] = useState(true);
  const theme = createMuiTheme({
    palette: {
      type: isDark ? "dark" : "light",
      primary: {
        // light: will be calculated from palette.primary.main,
        main: "#00695c",
        light: "#439889",
        dark: "#003d33",
        // dark: will be calculated from palette.primary.main,
        // contrastText: will be calculated to contrast with palette.primary.main
      },
      secondary: {
        light: "#e6ffff",
        main: "#b3e5fc",
        dark: "#82b3c9",
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
          defaultPadding,
          setDefaultPadding,
          animation,
          setAnimation,
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
