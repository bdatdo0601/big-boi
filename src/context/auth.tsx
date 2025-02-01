import React, { createContext, useContext, useEffect, useState } from 'react';
import { Hub } from 'aws-amplify/utils';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { useSnackbar } from 'notistack';
import { get } from 'lodash';
import { AuthUser, getCurrentUser, signOut, SignOutInput } from '@aws-amplify/auth';
import { CircularProgress } from '@mui/material';

export const withCustomAWSAuthenticator = <T extends Object>(Component: React.FC<T>) => withAuthenticator(Component, { hideSignUp: true });

const AuthContext = createContext<{ user?: AuthUser, signOut: (input?: SignOutInput) => Promise<void> }>({
  user: undefined,
  signOut
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | undefined>();
  const [initialLoad, setInitialLoad] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    const stopListenFn = Hub.listen('auth', res => {
      getCurrentUser()
        .then(user => setUser(user))
        .catch(() => setUser(undefined));
      const errorMsg = get(res, 'payload.data.message', '');
      if (errorMsg) {
        console.error(res);
        enqueueSnackbar(errorMsg, {
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
          autoHideDuration: 2000,
        });
      }
    });
    return () => {
      stopListenFn();
    };
  }, [enqueueSnackbar]);

  useEffect(() => {
    getCurrentUser()
      .then(user => { setUser(user); setInitialLoad(false) })
      .catch(() => { setUser(undefined); setInitialLoad(false) });
  }, [])

  if (initialLoad) return <div className="w-full *:text-center mx-auto"><CircularProgress /></div>

  return <AuthContext.Provider value={{ user, signOut }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
