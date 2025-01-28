import { Paper, Tab, Tabs } from "@mui/material";
import React, { useMemo, useState } from "react";
import MostFrequent from "./TabPane/MostFrequent";
import MostRecent from "./TabPane/MostRecent";
import TagAlphabetical from "./TabPane/TagAlphabetical";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const TABS = [
  { name: "Recently Updated", Component: MostRecent },
  { name: "Tag Based", Component: TagAlphabetical },
  { name: "Frequently Visited", Component: MostFrequent },
];

const ReferenceTabs = () => {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  const currentTab = useMemo(() => TABS[currentTabIndex], [currentTabIndex]);

  return (
    <div className="p-4 m-2 bg-muted rounded-lg">
      <div className="flex flex-start gap-12 py-4 px-2">
        {TABS.map((item, index) => (
          <button
            className="pb-4 hover:cursor-pointer"
            style={
              currentTabIndex === index
                ? {
                    borderBottom: "var(--primary) solid 1px",
                  }
                : {}
            }
            key={item.name}
            {...a11yProps(index)}
            onClick={() => {
              setCurrentTabIndex(index);
            }}
          >
            <span className="text-xl">{item.name}</span>
          </button>
        ))}
      </div>
      <div className="text-left mt-4">
        <currentTab.Component />
      </div>
    </div>
  );
};

export default ReferenceTabs;
