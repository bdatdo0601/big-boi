import React, { lazy, Suspense, useContext, useEffect } from "react";
import { isFunction, groupBy } from "lodash";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";
import useStyles from "./styleHooks";
import AppNavigation from "../../components/AppNavigation";
import LayoutContext from "../../context/layout";
import routes from "../../routes";
import particleConfig from "./particleConfig";
import { WEBSITE_TITLE } from "../../utils/constants";

const Particles = lazy(() => import("react-particles-js"));

export default function MainLayout({ children, name }) {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [routeList, setRouteList] = React.useState([]);
  const { setIsDark, isDark, globalAnimation, setGlobalAnimation } = useContext(LayoutContext);
  useEffect(() => {
    Promise.all(
      routes.map(async item => ({ ...item, hidden: isFunction(item.hidden) ? await item.hidden() : item.hidden }))
    ).then(resolvedRoutes => {
      setRouteList(resolvedRoutes);
    });
  }, [setRouteList, history.location.pathname]);
  return (
    <AppNavigation
      setOpen={setOpen}
      name={name}
      open={open}
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
      <Suspense fallback={<CircularProgress />}>
        <Particles
          style={{ width: "100vw", height: "100vh", position: "fixed", zIndex: -1, top: 0, left: 0 }}
          params={particleConfig(isDark)}
        />
      </Suspense>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        {children}
      </main>
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
