import React, { useEffect, useState } from "react";
import Auth from "@aws-amplify/auth";
import { ExpandMoreOutlined } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Grid, Typography } from "@mui/material";
import useLocalStorageState from "use-local-storage-state";
import withScrolling from "react-dnd-scrolling";
import ReferenceInputWidget from "./components/ReferenceInputWidget";
import { ReferenceContextProvider } from "./context";
import Searchable from "./subcontainer/Searchable";
import ReferenceTabs from "./subcontainer/ReferenceTabs";
import "./index.less";

const DndScrollingDiv = withScrolling("div");

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
      {currentUser && (
        <Accordion
          expanded={isReferenceCreationExpanded}
          onChange={(e, newValue) => {
            e.preventDefault();
            setIsReferenceCreationExpanded(newValue);
          }}
          className="fixed right-0 z-50 top-auto w-full xl:top-0 2xl:top-0 lg:top-0 md:top-0 md:w-1/2 xl:w-1/2 2xl:w-1/2 lg:w-1/2 shadow-lg"
        >
          <AccordionSummary
            expandIcon={<ExpandMoreOutlined />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            style={{ minHeight: 64, flexDirection: "row-reverse" }}
          >
            <Typography variant="h6" className="ml-4">
              Create Reference
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ReferenceInputWidget />
          </AccordionDetails>
        </Accordion>
      )}
      <DndScrollingDiv className="reference-container-div my-16 md:my-2 lg:my-2 xl:my-2 2xl:my-2 py-2 px-1">
        <Grid container spacing={2} style={{ marginBottom: "10%", width: "100vw" }}>
          {Items.map(item => (
            <Grid item key={item.key} {...item.span} className="">
              <item.Component />
            </Grid>
          ))}
        </Grid>
      </DndScrollingDiv>
    </ReferenceContextProvider>
  );
}
