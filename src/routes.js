import React from "react";
import HomeIcon from "@material-ui/icons/Home";
import Home from "./containers/Home";

const ROUTE_TYPE = {
  PUBLIC: "PUBLIC",
  PRIVATE: "PRIVATE",
};

export default [
  {
    name: "Home",
    icon: <HomeIcon />,
    component: Home,
    path: "/",
    exact: true,
    type: ROUTE_TYPE.PUBLIC,
  },
  {
    name: "Error",
    component: () => <div>Something Wrong</div>,
    path: "*",
    hidden: true,
  },
];
