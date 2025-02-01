import React from 'react';
import PropTypes from 'prop-types';
import { SnackbarProvider } from 'notistack';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { ThemeProvider } from '@mui/material/styles';
import { LayoutContextProvider } from './layout';
import { EventMessageContextProvider } from './eventmessage';
import { isTouchDevice } from '../utils';
import '@aws-amplify/ui-react/styles.css'; // default theme
import { AuthProvider } from './auth';
import { ApiProvider } from './api';

export default function ContextProvider({ children }) {
  return (
    <DndProvider backend={isTouchDevice() ? TouchBackend : HTML5Backend}>
      <AuthProvider>
        <ApiProvider>
          <LayoutContextProvider>
            <SnackbarProvider>
              <EventMessageContextProvider>{children}</EventMessageContextProvider>
            </SnackbarProvider>
          </LayoutContextProvider>
        </ApiProvider>
      </AuthProvider>
    </DndProvider>
  );
}

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
