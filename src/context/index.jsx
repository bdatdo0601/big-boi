import { ThemeProvider } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import PropTypes from 'prop-types';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isTouchDevice } from '../utils';
import { EventMessageContextProvider } from './eventmessage';
import { LayoutContextProvider } from './layout';
import '@aws-amplify/ui-react/styles.css'; // default theme
import { ApiProvider } from './api';
import { AuthProvider } from './auth';

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
