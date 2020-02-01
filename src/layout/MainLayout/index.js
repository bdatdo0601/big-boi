import React, { useContext } from "react";
import PropTypes from "prop-types";
import { groupBy } from "lodash";
import clsx from "clsx";
import { useTheme } from "@material-ui/core";
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
  const theme = useTheme();
  const { setIsDark, isDark, defaultPadding, globalAnimation, setGlobalAnimation } = useContext(LayoutContext);
  return (
    <AppNavigation
      setOpen={setOpen}
      name={name}
      open={open}
      groupedDrawerContent={groupBy(
        routes.filter(route => !route.hidden),
        "type"
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
        style={{ padding: defaultPadding ? theme.spacing(3) : 0 }}
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
