import React from "react";
import Home from "./containers/Home";

export default [
  {
    name: "Home",
    component: Home,
    path: "/",
    exact: true,
  },
  {
    name: "Error",
    component: () => <div>Something Wrong</div>,
    path: "*",
  },
];
