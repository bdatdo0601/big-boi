import Auth from "@aws-amplify/auth";
import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import ReferenceInputWidget from "./components/ReferenceInputWidget";
import { ReferenceContextProvider } from "./context";
import "./index.less";

export default function Reference() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => setCurrentUser(user))
      .catch(() => setCurrentUser(null));
  }, []);

  return (
    <ReferenceContextProvider>
      <div className="reference-container-div my-2">
        <Grid container spacing={2}>
          {currentUser && (
            <Grid item xs={12} md={12} lg={12} xl={12} className="mx-12">
              <ReferenceInputWidget />
            </Grid>
          )}
        </Grid>
      </div>
    </ReferenceContextProvider>
  );
}
