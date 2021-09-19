import React, { useEffect } from "react";
import { isEmpty } from "lodash";
import PropTypes from "prop-types";
import { v4 as uuid } from "uuid";
import clsx from "clsx";
import { useTheme } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useMediaQuery, Switch, FormControlLabel, CircularProgress, Grid, Tabs, Tab } from "@mui/material";
import { useHistory, useLocation } from "react-router-dom";
import useStyles from "./styleHooks";
import MaterialListItem from "./MaterialListItem";
import "./index.less";
import { VERSION } from "../../utils/constants";

const a11yProps = index => ({
  id: `simple-tab-${index}`,
  "aria-controls": `simple-tabpanel-${index}`,
  style: {
    outline: "none",
  },
});

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
  const isBigScreen = useMediaQuery("(min-width:1070px)");
  const isWeb = useMediaQuery("(min-width:600px)");

  const history = useHistory();
  const location = useLocation();

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
        <Grid
          className="appbar-grid"
          container
          justifyContent="space-between"
          alignItems="center"
          alignContent="space-between"
        >
          <Grid item xs={12} md={3} lg={3}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, open && classes.hide)}
                style={{ outline: "none" }}
                size="large">
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap className={open ? classes.hide : ""}>
                {name}
              </Typography>
            </Toolbar>
          </Grid>
          {isBigScreen && (
            <Grid item xs={8} md={8} lg={8} style={{ textAlign: "right" }}>
              {(groupedDrawerContent[""] || []).some(item => item.path === location.pathname) && (
                <Tabs
                  style={{ width: 800, right: 0, marginRight: 8 }}
                  value={location.pathname}
                  aria-label="header tabs"
                  onChange={(_, value) => {
                    history.push(value);
                  }}
                >
                  {(groupedDrawerContent[""] || []).map((item, index) => (
                    <Tab
                      label={<Typography variant="button">{item.name}</Typography>}
                      key={item.name}
                      value={item.path}
                      {...a11yProps(index)}
                    />
                  ))}
                </Tabs>
              )}
            </Grid>
          )}
        </Grid>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant={isWeb ? "persistent" : "temporary"}
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
        onClose={handleDrawerClose}
      >
        <div className={classes.drawerHeader}>
          <Typography variant="h6" noWrap style={{ marginLeft: 12 }}>
            {name}
          </Typography>
          <IconButton onClick={handleDrawerClose} style={{ outline: "none" }} size="large">
            {theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <FormControlLabel
          className={classes.darkModeSwitch}
          control={<Switch checked={isDark} onChange={e => setIsDark(e.target.checked)} />}
          label="Dark Mode"
        />
        <FormControlLabel
          className={classes.darkModeSwitch}
          control={<Switch checked={globalAnimation} onChange={e => setGlobalAnimation(e.target.checked)} />}
          label="Animation"
        />
        <List>
          {!isEmpty(groupedDrawerContent) ? (
            Object.keys(groupedDrawerContent).map((groupedContents, index) => (
              <React.Fragment key={uuid()}>
                {index === 0 && <Divider />}
                {groupedContents && (
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    display="block"
                    style={{ marginLeft: "6%", marginTop: 6 }}
                  >
                    {groupedContents}
                  </Typography>
                )}
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
            ))
          ) : (
            <CircularProgress style={{ marginLeft: "6%" }} />
          )}
        </List>
        <Typography variant="subtitle1" color="textSecondary" style={{ marginLeft: "1rem" }}>
          Version {VERSION}
        </Typography>
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
