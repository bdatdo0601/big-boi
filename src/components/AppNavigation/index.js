import React, { useEffect } from "react";
import PropTypes from "prop-types";
import uuid from "uuid";
import clsx from "clsx";
import { useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { useMediaQuery, Switch, FormControlLabel } from "@material-ui/core";
import useStyles from "./styleHooks";
import MaterialListItem from "./MaterialListItem";

export default function AppNavigation({
  children,
  name,
  groupedDrawerContent,
  setOpen,
  open,
  isDark,
  setIsDark,
  onItemClick,
  isSelected,
  globalAnimation,
  setGlobalAnimation,
}) {
  const classes = useStyles();
  const theme = useTheme();
  const isWeb = useMediaQuery("(min-width:600px)");

  useEffect(() => {
    setGlobalAnimation(isWeb);
  }, [setGlobalAnimation, isWeb]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
            style={{ outline: "none" }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap className={open ? classes.hide : ""}>
            {name}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant={isWeb ? "persistent" : "temporary"}
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <Typography variant="h6" noWrap style={{ marginLeft: 12 }}>
            {name}
          </Typography>
          <IconButton onClick={handleDrawerClose} style={{ outline: "none" }}>
            {theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <FormControlLabel
          className={classes.darkModeSwitch}
          control={<Switch checked={globalAnimation} onChange={e => setGlobalAnimation(e.target.checked)} />}
          label="Animation"
        />
        <FormControlLabel
          className={classes.darkModeSwitch}
          control={<Switch checked={isDark} onChange={e => setIsDark(e.target.checked)} />}
          label="Dark Mode"
        />
        <List>
          {Object.keys(groupedDrawerContent).map((groupedContents, index) => (
            <React.Fragment key={uuid()}>
              {index === 0 && <Divider />}
              {groupedDrawerContent[groupedContents].map(item => (
                <MaterialListItem
                  item={item}
                  key={item.name}
                  onClick={listItem => onItemClick(listItem)}
                  isSelected={isSelected}
                />
              ))}
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Drawer>
      {children}
    </div>
  );
}

AppNavigation.propTypes = {
  children: PropTypes.node.isRequired,
  groupedDrawerContent: PropTypes.object.isRequired,
  isDark: PropTypes.bool.isRequired,
  isSelected: PropTypes.func.isRequired,
  name: PropTypes.string,
  onItemClick: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  setIsDark: PropTypes.func.isRequired,
  setOpen: PropTypes.func.isRequired,
  globalAnimation: PropTypes.bool.isRequired,
  setGlobalAnimation: PropTypes.func.isRequired,
};

AppNavigation.defaultProps = {
  name: "Dat Do",
};
