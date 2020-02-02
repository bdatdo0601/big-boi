import React from "react";
import { Auth } from "aws-amplify";
import { Redirect } from "react-router-dom";
import HomeIcon from "@material-ui/icons/Home";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import DashboardIcon from "@material-ui/icons/Dashboard";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import CommentIcon from "@material-ui/icons/Comment";
import AssignmentIndSharpIcon from "@material-ui/icons/AssignmentIndSharp";
import CreateIcon from "@material-ui/icons/Create";
import AccountTree from "@material-ui/icons/AccountTree";
import Home from "./containers/Home";
import { Typography, Button } from "@material-ui/core";

export const ROUTE_TYPE = {
  PUBLIC: {
    name: "",
    withAuth: false,
  },
  PRIVATE: {
    name: "Management",
    withAuth: true,
  },
};

const isAuthExist = async () => {
  try {
    const user = await Auth.currentAuthenticatedUser();
    return user !== null;
  } catch (err) {
    return false;
  }
};

export const errorRoutes = [
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
    type: "Error",
  },
];

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
    component: () => <Redirect to="/admin" />,
    path: "/login",
    exact: true,
    type: ROUTE_TYPE.PRIVATE,
    hidden: async () => await isAuthExist(),
  },
  {
    name: "Admin Dashboard",
    icon: <DashboardIcon />,
    component: () => <div>Admin</div>,
    path: "/admin",
    exact: true,
    type: ROUTE_TYPE.PRIVATE,
    hidden: async () => !(await isAuthExist()),
  },
  {
    name: "Blogs Manager",
    icon: <CreateIcon />,
    component: () => <div>Blog Manager</div>,
    path: "/blogmanager",
    exact: true,
    type: ROUTE_TYPE.PRIVATE,
    hidden: async () => !(await isAuthExist()),
  },
  {
    name: "Logout",
    icon: <MeetingRoomIcon />,
    component: ({ history }) => {
      Auth.signOut().then(() => {
        history.replace("/");
      });
      return null;
    },
    path: "/logout",
    exact: true,
    type: ROUTE_TYPE.PRIVATE,
    hidden: async () => !(await isAuthExist()),
  },
];
