import React from "react";
import { Auth } from "aws-amplify";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import {
  ImageOutlined,
  AccountTree,
  Create as CreateIcon,
  AssignmentIndSharp as AssignmentIndSharpIcon,
  ExitToApp as ExitToAppIcon,
  Dashboard as DashboardIcon,
  MeetingRoom as MeetingRoomIcon,
  Comment as CommentIcon,
  Home as HomeIcon,
} from "@material-ui/icons";
import { Typography, Button } from "@material-ui/core";
import Home from "./containers/Home";
import Blogs from "./containers/Blogs";
import Background from "./containers/Background";
import Projects from "./containers/Projects";
import AdminDashboard from "./containers/AdminDashboard";
import BlogManager from "./containers/BlogManager";
import BlogCreation from "./containers/BlogManager/Creation";
import PostDisplay from "./containers/Blogs/PostDisplay";
import Gallery from "./containers/Gallery";

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

const ErrorPage = ({ history }) => (
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
);

ErrorPage.propTypes = {
  history: PropTypes.object.isRequired,
};

export const errorRoutes = [
  {
    name: "Error",
    component: ErrorPage,
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
    name: "Background",
    icon: <AssignmentIndSharpIcon />,
    component: Background,
    path: "/background",
    exact: true,
    type: ROUTE_TYPE.PUBLIC,
  },
  {
    name: "Blogs",
    icon: <CommentIcon />,
    component: Blogs,
    path: "/blogs",
    exact: true,
    type: ROUTE_TYPE.PUBLIC,
  },
  {
    name: "Post Display",
    icon: <CommentIcon />,
    component: PostDisplay,
    path: "/blogs/post/:postID",
    exact: true,
    type: ROUTE_TYPE.PUBLIC,
    hidden: async () => true,
  },
  {
    name: "Gallery",
    icon: <ImageOutlined />,
    component: Gallery,
    path: "/gallery",
    exact: true,
    type: ROUTE_TYPE.PUBLIC,
  },
  {
    name: "Projects",
    icon: <AccountTree />,
    component: Projects,
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
    hidden: async () => isAuthExist(),
  },
  {
    name: "Admin Dashboard",
    icon: <DashboardIcon />,
    component: AdminDashboard,
    path: "/admin",
    exact: true,
    type: ROUTE_TYPE.PRIVATE,
    hidden: async () => !(await isAuthExist()),
  },
  {
    name: "Blogs Manager",
    icon: <CreateIcon />,
    component: BlogManager,
    path: "/blogmanager",
    exact: true,
    type: ROUTE_TYPE.PRIVATE,
    hidden: async () => !(await isAuthExist()),
  },
  {
    name: "Blogs Creation",
    icon: <CreateIcon />,
    component: BlogCreation,
    path: "/blogmanager/update/:postID",
    exact: true,
    type: ROUTE_TYPE.PRIVATE,
    hidden: async () => true,
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
