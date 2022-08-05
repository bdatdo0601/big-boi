import React, { useState } from "react";
import PropTypes from "prop-types";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";

const LayoutContext = React.createContext();

const darkThemeOverride = {
  primary: {
    main: "#5a83cd",
  },
  secondary: {
    main: "#bd527b",
  },
  error: {
    main: "#9c4131",
  },
  info: {
    main: "#413941",
  },
};

const lightThemeOverride = {
  primary: {
    main: "#4a5a73",
  },
  secondary: {
    main: "#4a83c5",
  },
  error: {
    main: "#cd4a31",
  },
  info: {
    main: "#4183ee",
  },
};

export const LayoutContextProvider = ({ children }) => {
  const [layout, setLayout] = useState();
  const [isDark, setIsDark] = useState(true);
  const [animation, setAnimation] = useState(true);
  const [globalAnimation, setGlobalAnimation] = useState(true);
  const theme = createTheme({
    palette: {
      mode: isDark ? "dark" : "light",
      ...(!isDark ? lightThemeOverride : darkThemeOverride),
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
