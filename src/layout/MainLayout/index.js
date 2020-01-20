import React, { useContext } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import useStyles from "./styleHooks";
import AppNavigation from "../../components/AppNavigation";
import LayoutContext from "../../context/layout";
import { useTheme } from "@material-ui/core";

export default function MainLayout({ children, name }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const { setIsDark, isDark, defaultPadding } = useContext(LayoutContext);
  return (
    <AppNavigation
      setOpen={setOpen}
      name={name}
      open={open}
      groupedDrawerContent={{}}
      setIsDark={setIsDark}
      isDark={isDark}
    >
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
