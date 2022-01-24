import React, { useEffect, useState } from "react";
import Auth from "@aws-amplify/auth";
import { ExpandMoreOutlined } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Grid, Typography } from "@mui/material";
import useLocalStorageState from "use-local-storage-state";
import ReferenceInputWidget from "./components/ReferenceInputWidget";
import { ReferenceContextProvider } from "./context";
import Searchable from "./subcontainer/Searchable";
import ReferenceTabs from "./subcontainer/ReferenceTabs";
import "./index.less";

const Items = [
  {
    key: "Searchable",
    Component: Searchable,
    span: {
      xl: 12,
      lg: 12,
      md: 12,
      sm: 12,
      xs: 12,
    },
  },
  {
    key: "ReferenceTabs",
    Component: ReferenceTabs,
    span: {
      xl: 12,
      lg: 12,
      md: 12,
      sm: 12,
      xs: 12,
    },
  },
];

export default function Reference() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isReferenceCreationExpanded, setIsReferenceCreationExpanded] = useLocalStorageState(
    "isReferenceCreationExpanded",
    true
  );

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => setCurrentUser(user))
      .catch(() => setCurrentUser(null));
  }, []);

  return (
    <ReferenceContextProvider>
      <div className="reference-container-div my-2 py-2 px-1">
        <Grid container spacing={2}>
          {currentUser && (
            <Grid item xs={12} md={12} lg={12} xl={12}>
              <Accordion
                expanded={isReferenceCreationExpanded}
                onChange={(e, newValue) => {
                  e.preventDefault();
                  setIsReferenceCreationExpanded(newValue);
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreOutlined />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography variant="h5">Reference Creation</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ReferenceInputWidget />
                </AccordionDetails>
              </Accordion>
            </Grid>
          )}
          {Items.map(item => (
            <Grid item key={item.key} {...item.span} className="">
              <item.Component />
            </Grid>
          ))}
        </Grid>
      </div>
    </ReferenceContextProvider>
  );
}
