import React, { lazy } from "react";
import { Auth } from "@aws-amplify/auth";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import {
  ImageOutlined,
  // AccountTree,
  Map,
  Create as CreateIcon,
  AssignmentIndSharp as AssignmentIndSharpIcon,
  ExitToApp as ExitToAppIcon,
  Dashboard as DashboardIcon,
  MeetingRoom as MeetingRoomIcon,
  Comment as CommentIcon,
  Home as HomeIcon,
  ListAltOutlined,
} from "@mui/icons-material";
import { Typography, Button } from "@mui/material";
import AdminDashboard from "./containers/AdminDashboard";
import BlogManager from "./containers/BlogManager";
import BlogCreation from "./containers/BlogManager/Creation";

const Blogs = lazy(() => import("./containers/Blogs"));
const Background = lazy(() => import("./containers/Background"));
// const Projects = lazy(() => import("./containers/Projects"));
const PostDisplay = lazy(() => import("./containers/Blogs/PostDisplay"));
const NotionPostDisplay = lazy(() => import("./containers/Blogs/NotionPostDisplay"));
const Gallery = lazy(() => import("./containers/Gallery"));
const ChangeLogs = lazy(() => import("./containers/Changelogs"));
const Documentations = lazy(() => import("./containers/Documentations"));
const Home = lazy(() => import("./containers/Home"));

export const ROUTE_TYPE = {
  PUBLIC: {
    name: "",
    withAuth: false,
  },
  PRIVATE: {
    name: "Management",
    withAuth: true,
  },
  DEV: {
    name: "For Nerds",
    withAuth: false,
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
    name: "Blogs & Thoughts",
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
    name: "Post Display",
    icon: <CommentIcon />,
    component: NotionPostDisplay,
    path: "/blogs/notion/:notionPostID",
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
  // {
  //   name: "Projects",
  //   icon: <AccountTree />,
  //   component: Projects,
  //   path: "/projects",
  //   exact: true,
  //   type: ROUTE_TYPE.PUBLIC,
  // },
  {
    name: "Documentations",
    icon: <Map />,
    component: Documentations,
    path: "/documentations",
    exact: true,
    type: ROUTE_TYPE.DEV,
    hidden: async () => false,
  },
  {
    name: "Change Logs",
    icon: <ListAltOutlined />,
    component: ChangeLogs,
    path: "/change-logs",
    exact: true,
    type: ROUTE_TYPE.DEV,
    hidden: async () => false,
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
