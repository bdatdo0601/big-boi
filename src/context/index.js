import React from "react";
import PropTypes from "prop-types";
import { SnackbarProvider } from "notistack";
import { LayoutContextProvider } from "./layout";
import { EventMessageContextProvider } from "./eventmessage";

export default function ContextProvider({ children }) {
  return (
    <LayoutContextProvider>
      <SnackbarProvider>
        <EventMessageContextProvider>{children}</EventMessageContextProvider>
      </SnackbarProvider>
    </LayoutContextProvider>
  );
}

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
