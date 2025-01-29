import React, { useEffect, useState } from "react";
import Auth from "@aws-amplify/auth";
import { ExpandMoreOutlined } from "@mui/icons-material";
import { Accordion, AccordionSummary } from "@mui/material";
import useLocalStorageState from "use-local-storage-state";
import withScrolling from "react-dnd-scrolling";
import ReferenceInputWidget from "./components/ReferenceInputWidget";
import { ReferenceContextProvider } from "./context";
import Searchable from "./subcontainer/Searchable";
import ReferenceTabs from "./subcontainer/ReferenceTabs";
import "./index.css";
import { useAuth } from "@/context/auth";

const DndScrollingDiv = withScrolling("div");

const ReferenceCreation = () => {
  const { user } = useAuth();
  return (
    user && (
      <div className="mx-2 rounded-lg bg-muted text-left p-4">
        <span className="text-xl font-bold">Create New Reference</span>
        <ReferenceInputWidget />
      </div>
    )
  );
};

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
  {
    key: "ReferenceCreation",
    Component: ReferenceCreation,
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
  return (
    <ReferenceContextProvider>
      <DndScrollingDiv className="reference-container-div md:my-2 lg:my-2 xl:my-2 2xl:my-2 pt-2 pb-16 px-1">
        <div className="flex flex-col gap-4">
          {Items.map((item) => (
            <item.Component key={item.key} />
          ))}
        </div>
      </DndScrollingDiv>
    </ReferenceContextProvider>
  );
}
