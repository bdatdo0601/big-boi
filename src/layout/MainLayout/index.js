import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import useStyles from "./styleHooks";
import AppNavigation from "../../components/AppNavigation";

export default function MainLayout({ children, name }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  return (
    <AppNavigation
      setOpen={setOpen}
      name={name}
      open={open}
      groupedDrawerContent={{
        Normal: [
          {
            name: "Home",
            onClick: () => {},
          },
        ],
      }}
    >
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
