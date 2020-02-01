import React from "react";
import HomeIcon from "@material-ui/icons/Home";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import CommentIcon from "@material-ui/icons/Comment";
import AssignmentIndSharpIcon from "@material-ui/icons/AssignmentIndSharp";
import AccountTree from "@material-ui/icons/AccountTree";
import Home from "./containers/Home";
import { Typography, Button } from "@material-ui/core";

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
    name: "Blogs",
    icon: <CommentIcon />,
    component: () => <div>Blogs</div>,
    path: "/blogs",
    exact: true,
    type: ROUTE_TYPE.PUBLIC,
  },
  {
    name: "Background",
    icon: <AssignmentIndSharpIcon />,
    component: () => <div>Experiences</div>,
    path: "/experiences",
    exact: true,
    type: ROUTE_TYPE.PUBLIC,
  },
  {
    name: "Projects",
    icon: <AccountTree />,
    component: () => <div>Projects</div>,
    path: "/projects",
    exact: true,
    type: ROUTE_TYPE.PUBLIC,
  },
  {
    name: "Login",
    icon: <ExitToAppIcon />,
    component: () => <div>Login</div>,
    path: "/login",
    exact: true,
    type: ROUTE_TYPE.PRIVATE,
  },
  {
    name: "Error",
    component: ({ history }) => (
      <>
        <Typography variant="h1" style={{ color: "red" }}>
          404 - Error not found
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            history.replace("/");
          }}
        >
          Go Home
        </Button>
      </>
    ),
    path: "*",
    hidden: true,
  },
];
