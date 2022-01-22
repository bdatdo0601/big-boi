import { Paper, Tab, Tabs } from "@mui/material";
import React, { useMemo, useState } from "react";
import MostFrequent from "./TabPane/MostFrequent";
import MostRecent from "./TabPane/MostRecent";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const TABS = [
  { name: "Most Recent", Component: MostRecent },
  { name: "Most Frequent", Component: MostFrequent },
];

const ReferenceTabs = () => {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  const currentTab = useMemo(() => TABS[currentTabIndex], [currentTabIndex]);

  return (
    <Paper className="p-2 m-2">
      <Tabs
        value={currentTabIndex}
        onChange={(e, newVal) => {
          setCurrentTabIndex(newVal);
        }}
        aria-label="basic tabs example"
      >
        {TABS.map((item, index) => (
          <Tab key={item.name} label={item.name} {...a11yProps(index)} />
        ))}
      </Tabs>
      <div className="text-left mt-4">
        <currentTab.Component />
      </div>
    </Paper>
  );
};

export default ReferenceTabs;
