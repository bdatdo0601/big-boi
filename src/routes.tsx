import React, { lazy, FC, ComponentType } from "react";
import { Auth } from "@aws-amplify/auth";
import { Navigate, useNavigate } from "react-router";
import {
  ImageOutlined,
  Map as MuiMap,
  Create as CreateIcon,
  AssignmentIndSharp as AssignmentIndSharpIcon,
  ExitToApp as ExitToAppIcon,
  Dashboard as DashboardIcon,
  MeetingRoom as MeetingRoomIcon,
  Comment as CommentIcon,
  Home as HomeIcon,
  ListAltOutlined,
  LinkOutlined,
} from "@mui/icons-material";
import { Typography, Button } from "@mui/material";
import AdminDashboard from "./containers/AdminDashboard";
import BlogManager from "./containers/BlogManager";
import BlogCreation from "./containers/BlogManager/Creation";
import Reference from "./containers/Reference";
import ShareTarget from "./containers/ShareTarget";
import usePageTracking from "./utils/hooks/usePageTracking";

const Blogs = lazy(() => import("./containers/Blogs"));
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

interface RouteType {
  name: string;
  withAuth: boolean;
}

export interface RouteConfig {
  name: string;
  icon?: React.ReactNode;
  component?: ComponentType<any>;
  path: string;
  exact: boolean;
  type: RouteType;
  hidden?: boolean | (() => Promise<boolean>);
}


export const getRoutePath = (route: RouteConfig) => {
  if (route.exact) {
    return route.path;
  }
  return `${route.path}/*`;
};

const withAnalytics = <P extends object>(Component: ComponentType<P>): FC<P> => {
  return (props: P) => {
    usePageTracking();
    return <Component {...props} />;
  };
};

const isAuthExist = async (): Promise<boolean> => {
  try {
    const user = await Auth.currentAuthenticatedUser();
    return user !== null;
  } catch (err) {
    return false;
  }
};

const ErrorPage: FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <Typography variant="h1" style={{ color: "red" }}>
        404 - Error not found
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          navigate("/", { replace: true });
        }}
      >
        Go Home
      </Button>
    </>
  );
};

export const subdomainRouteMap: Record<string, RouteConfig[]> = {
  reference: [
    {
      name: "Reference",
      icon: <LinkOutlined />,
      component: Reference,
      path: "/",
      exact: true,
      type: ROUTE_TYPE.PUBLIC,
    },
    {
      name: "Share-Target",
      icon: <LinkOutlined />,
      component: ShareTarget,
      path: "/share-target",
      exact: true,
      hidden: true,
      type: ROUTE_TYPE.PUBLIC,
    },
    {
      name: "Logout",
      icon: <MeetingRoomIcon />,
      component: () => {
        const navigate = useNavigate();
        Auth.signOut().then(() => {
          navigate("/", { replace: true });
        });
        return null;
      },
      path: "/logout",
      exact: true,
      type: ROUTE_TYPE.PRIVATE,
      hidden: async () => !(await isAuthExist()),
    },
    {
      name: "Login",
      icon: <ExitToAppIcon />,
      component: () => <Navigate replace to="/" />,
      path: "/login",
      exact: true,
      type: ROUTE_TYPE.PRIVATE,
      hidden: async () => isAuthExist(),
    },
  ],
};

export const errorRoutes: RouteConfig[] = [
  {
    name: "Error",
    component: ErrorPage,
    path: "*",
    hidden: true,
    type: ROUTE_TYPE.PUBLIC,
    exact: false,
  },
].map((item) => ({
  ...item,
  component: item.component ? withAnalytics(item.component) : undefined,
}));

const routes: RouteConfig[] = [
  {
    name: "Home",
    icon: <HomeIcon />,
    component: Home,
    path: "/",
    exact: true,
    type: ROUTE_TYPE.PUBLIC,
  },
  {
    name: "Reference",
    icon: <LinkOutlined />,
    component: Reference,
    path: "/reference",
    exact: true,
    type: ROUTE_TYPE.PUBLIC,
  },
  {
    name: "Share-Target",
    icon: <LinkOutlined />,
    component: ShareTarget,
    path: "/share-target",
    exact: true,
    hidden: true,
    type: ROUTE_TYPE.PUBLIC,
  },
  {
    name: "Blogs & Thoughts",
    icon: <CommentIcon />,
    component: Blogs,
    path: "/blogs",
    exact: false,
    type: ROUTE_TYPE.PUBLIC,
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
    name: "Documentations",
    icon: <MuiMap />,
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
    component: () => <Navigate to="/admin" />,
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
    component: () => {
      const navigate = useNavigate();
      Auth.signOut().then(() => {
        navigate("/", { replace: true });
      });
      return null;
    },
    path: "/logout",
    exact: true,
    type: ROUTE_TYPE.PRIVATE,
    hidden: async () => !(await isAuthExist()),
  },
].map((item) => ({
  ...item,
  component: item.component ? withAnalytics(item.component) : undefined,
}));

export default routes;