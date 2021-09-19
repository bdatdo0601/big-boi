import React from "react";
import PropTypes from "prop-types";
import { SnackbarProvider } from "notistack-v5";
import { LayoutContextProvider } from "./layout";
import { EventMessageContextProvider } from "./eventmessage";

export default function ContextProvider({ children }) {
  return (
    <SnackbarProvider>
      <EventMessageContextProvider>
        <LayoutContextProvider>{children}</LayoutContextProvider>
      </EventMessageContextProvider>
    </SnackbarProvider>
  );
}

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
