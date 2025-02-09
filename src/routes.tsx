import React, { lazy } from "react";
import { Navigate, useNavigate } from "react-router";
import MuiMap from "@mui/icons-material/Map";
import CreateIcon from "@mui/icons-material/Create";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import CommentIcon from "@mui/icons-material/Comment";
import HomeIcon from "@mui/icons-material/Home";
import ListAltOutlined from "@mui/icons-material/ListAltOutlined";
import LinkOutlined from "@mui/icons-material/LinkOutlined";
import FilePresentOutlined from "@mui/icons-material/FilePresentOutlined";
import QuestionAnswer from "@mui/icons-material/QuestionAnswer";
import AdminDashboard from "./containers/AdminDashboard";
import BlogManager from "./containers/BlogManager";
import BlogCreation from "./containers/BlogManager/Creation";
import Reference from "./containers/Reference";
import ShareTarget from "./containers/ShareTarget";
import PaperResumeDisplay from "./containers/PaperResume";
import { useAuth } from "./context/auth";
import { getCurrentUser } from "@aws-amplify/auth";
import FAQ from "./containers/FAQ";

const Blogs = lazy(() => import("./containers/Blogs"));
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
  component?: React.FC<object>;
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

const isAuthExist = async (): Promise<boolean> => {
  try {
    const user = await getCurrentUser();
    return user !== null;
  } catch (_err: any) {
    return false;
  }
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
        const { signOut } = useAuth();
        signOut().then(() => {
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
    name: "Resume",
    icon: <FilePresentOutlined />,
    component: PaperResumeDisplay,
    path: "/resume",
    exact: true,
    type: ROUTE_TYPE.PUBLIC,
  },
  {
    name: "FAQ",
    icon: <QuestionAnswer />,
    component: FAQ,
    path: "/faq",
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
      const { signOut } = useAuth();
      signOut().then(() => {
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
  component: item.component,
}));

export default routes;