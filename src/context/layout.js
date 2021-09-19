import React, { useState } from "react";
import PropTypes from "prop-types";
import { ThemeProvider } from "@material-ui/core";
import { createTheme } from "@material-ui/core/styles";

const LayoutContext = React.createContext();

export const LayoutContextProvider = ({ children }) => {
  const [layout, setLayout] = useState();
  const [isDark, setIsDark] = useState(true);
  const [animation, setAnimation] = useState(true);
  const [globalAnimation, setGlobalAnimation] = useState(true);
  const theme = createTheme({
    palette: {
      type: isDark ? "dark" : "light",

      primary: {
        // light: will be calculated from palette.primary.main,
        main: "#7ba4f6",
        // dark: will be calculated from palette.primary.main,
        // contrastText: will be calculated to contrast with palette.primary.main
      },
      secondary: {
        main: "#4a83c5",
      },
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
