import React from "react";
import PropTypes from "prop-types";
import { SnackbarProvider } from "notistack";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { LayoutContextProvider } from "./layout";
import { EventMessageContextProvider } from "./eventmessage";
import { isTouchDevice } from "../utils";

export default function ContextProvider({ children }) {
  return (
    <DndProvider backend={isTouchDevice() ? TouchBackend : HTML5Backend}>
      <LayoutContextProvider>
        <SnackbarProvider>
          <EventMessageContextProvider>{children}</EventMessageContextProvider>
        </SnackbarProvider>
      </LayoutContextProvider>
    </DndProvider>
  );
}

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
