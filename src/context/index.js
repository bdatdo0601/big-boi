import React from "react";
import PropTypes from "prop-types";
import { SnackbarProvider } from "notistack";
import { LayoutContextProvider } from "./layout";

export default function ContextProvider({ children }) {
  return (
    <LayoutContextProvider>
      <SnackbarProvider>{children}</SnackbarProvider>
    </LayoutContextProvider>
  );
}

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
