import React, { lazy, Suspense, useContext, useEffect } from "react";
import { isFunction, groupBy, has, get } from "lodash";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import { CircularProgress, styled, useMediaQuery } from "@mui/material";
import AppNavigation from "../../components/AppNavigation";
import LayoutContext from "../../context/layout";
import routes, { subdomainRouteMap } from "../../routes";
import particleConfig from "./particleConfig";
import { WEBSITE_TITLE } from "../../utils/constants";

const drawerWidth = 240;

const classes = {
  drawerHeader: "LayoutdrawerHeader",
  content: "LayoutContent",
  contentShift: "LayoutContentShift",
};

const StyledMain = styled(`main`)(({ theme }) => ({
  [`& .${classes.drawerHeader}`]: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "space-between",
  },
  [`&.${classes.content}`]: {
    [theme.breakpoints.up("sm")]: {
      flexGrow: 1,
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
  },
  [`& .${classes.contentShift}`]: {
    [theme.breakpoints.up("sm")]: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
  },
}));

const Particles = lazy(() => import("react-particles-js"));

const subdomain = window.location.host.split(".")[0];
const isSubdomainRoute = has(subdomainRouteMap, subdomain);

const domainRoutes = isSubdomainRoute ? get(subdomainRouteMap, subdomain, []) : routes;

export default function MainLayout({ children, name }) {
  const isFullSize = useMediaQuery("(min-width:1280px)");
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [routeList, setRouteList] = React.useState([]);
  const { setIsDark, isDark, globalAnimation, setGlobalAnimation } = useContext(LayoutContext);
  useEffect(() => {
    Promise.all(
      domainRoutes.map(async item => ({ ...item, hidden: isFunction(item.hidden) ? await item.hidden() : item.hidden }))
    ).then(resolvedRoutes => {
      setRouteList(resolvedRoutes);
    });
  }, [setRouteList, history.location.pathname]);
  return (
    <AppNavigation
      setOpen={setOpen}
      name={name}
      open={open}
      isSubdomainRoute={isSubdomainRoute}
      groupedDrawerContent={groupBy(
        routeList.filter(route => !route.hidden),
        "type.name"
      )}
      onItemClick={item => {
        history.push(item.path);
        setOpen(false);
      }}
      setIsDark={setIsDark}
      isDark={isDark}
      globalAnimation={globalAnimation}
      setGlobalAnimation={setGlobalAnimation}
      isSelected={item => history.location.pathname === item.path}
    >
      <Helmet>
        <meta charSet="utf-8" />
        <title>{WEBSITE_TITLE}</title>
        <link rel="canonical" href={`${window.location.href}`} />
        <meta name="description" content="This is Dat'a Website" />
      </Helmet>
      {isFullSize && !isSubdomainRoute && (
        <Suspense fallback={<CircularProgress />}>
          <Particles
            style={{ width: "100vw", height: "100vh", position: "fixed", zIndex: -1, top: 0, left: 0 }}
            params={particleConfig(isDark)}
          />
        </Suspense>
      )}
      <StyledMain
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        {children}
      </StyledMain>
    </AppNavigation>
  );
}

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string,
};

MainLayout.defaultProps = {
  name: "Dat Do",
};
