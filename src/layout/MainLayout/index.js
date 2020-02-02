import React, { useContext, useEffect } from "react";
import { isFunction } from "lodash";
import PropTypes from "prop-types";
import { groupBy } from "lodash";
import clsx from "clsx";
import { useHistory } from "react-router-dom";
import useStyles from "./styleHooks";
import AppNavigation from "../../components/AppNavigation";
import LayoutContext from "../../context/layout";
import routes from "../../routes";
import Particles from "react-particles-js";
import particleConfig from "./particleConfig";

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
      <Particles
        style={{ width: "100vw", height: "100vh", position: "fixed", zIndex: -1, top: 0, left: 0 }}
        params={particleConfig(isDark)}
      />
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
