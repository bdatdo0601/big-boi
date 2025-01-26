import React, { useEffect } from "react";
import { capitalize, isEmpty } from "lodash";
import PropTypes from "prop-types";
import { v4 as uuid } from "uuid";
import clsx from "clsx";
import { useTheme } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  useMediaQuery,
  Switch,
  FormControlLabel,
  CircularProgress,
  Grid2 as Grid,
  Tabs,
  Tab,
} from "@mui/material";
import { useHistory, useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import MaterialListItem from "./MaterialListItem";
import { VERSION } from "../../utils/constants";

const drawerWidth = 300;

const classes = {
  root: "AppNavigationRoot",
  appBar: "AppNavigationAppbar",
  appBarShift: "AppNavigationAppBarShift",
  menuButton: "AppNavigationmenuButton",
  hide: "AppNavigationhide",
  drawer: "AppNavigationdrawer",
  drawerHeader: "AppNavigationDrawerHeader",
  drawerPaper: "AppNavigationDrawerPaper",
  darkModeSwitch: "AppNavigationdarkModeSwitch",
  content: "AppNavigationcontent",
  contentShift: "AppNavigationcontentShift",
};

const AppNavigationRoot = styled("div")(({ theme }) => ({
  [`&.${classes.root}`]: {
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 0,
    },
  },
  [`& .${classes.appBar}`]: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    background: "var(--muted)",
    color: "var(--input)",
  },
  [`& .${classes.appBarShift}`]: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  },
  [`& .${classes.menuButton}`]: {
    marginRight: theme.spacing(2),
  },
  [`& .${classes.hide}`]: {
    display: "none",
    transition: theme.transitions.create("display", {
      easing: theme.transitions.easing.easeIn,
      duration: theme.transitions.duration.standard,
    }),
  },
  [`& .${classes.drawer}`]: {
    width: drawerWidth,
    flexShrink: 0,
  },
  [`& .${classes.drawerPaper}`]: {
    width: drawerWidth,
    background: "var(--foreground)",
    color: "var(--input)",
  },
  [`& .${classes.drawerHeader}`]: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "space-around",
  },
  [`& .${classes.darkModeSwitch}`]: {
    paddingLeft: theme.spacing(2),
    marginBottom: "5%",
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 22,
      height: 22,
      backgroundColor: "var(--primary)",
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: "var(--primary-foreground)",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
    },
  },
  [`& .${classes.content}`]: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  [`& .${classes.contentShift}`]: {
    marginLeft: drawerWidth,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    width: `calc(100% - ${drawerWidth}px)`,
  },
}));

const a11yProps = (index) => ({
  id: `simple-tab-${index}`,
  "aria-controls": `simple-tabpanel-${index}`,
  style: {
    outline: "none",
  },
});

const subdomain = window.location.host.split(".")[0];

const getDomainWithoutSubdomain = () => {
  const urlParts = window.location.hostname.split(".");

  const mainDomain = urlParts
    .slice(0)
    .slice(-(urlParts.length === 4 ? 3 : 2))
    .join(".");

  if (navigator.userAgent === "ReactSnap") {
    return "/";
  }

  return mainDomain === "localhost"
    ? `http://${mainDomain}:3000`
    : `https://${mainDomain}`;
};
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
  isSubdomainRoute,
}) {
  const theme = useTheme();
  const isBigScreen = useMediaQuery("(min-width:1070px)");
  const isWeb = useMediaQuery("(min-width:600px)");

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    if (
      isDark &&
      !("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

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
    <AppNavigationRoot className={classes.root}>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
        style={{
          zIndex: 50,
        }}
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
                size="large"
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                noWrap
                className={open ? classes.hide : ""}
              >
                <a
                  className="ml-2 font-bold text-input"
                  href={getDomainWithoutSubdomain()}
                >
                  {name}
                </a>
                {isSubdomainRoute && (
                  <a href={window.location.href}>: {capitalize(subdomain)}</a>
                )}
              </Typography>
            </Toolbar>
          </Grid>
          {isBigScreen &&
            !isSubdomainRoute &&
            (groupedDrawerContent[""] || []).some(
              (item) => item.path === location.pathname
            ) && (
              <Tabs
                style={{ right: 0, marginRight: 8 }}
                value={location.pathname}
                aria-label="header tabs"
                onChange={(_, value) => {
                  history.push(value);
                }}
                textColor="inherit"
              >
                {(groupedDrawerContent[""] || []).map((item, index) => (
                  <Tab
                    label={
                      <Typography
                        variant="button"
                        className={clsx({
                          "text-primary": item.path === location.pathname,
                        })}
                      >
                        <span className="text-lg">{item.name}</span>
                      </Typography>
                    }
                    key={item.name}
                    value={item.path}
                    {...a11yProps(index)}
                  />
                ))}
              </Tabs>
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
        <div
          className={classes.drawerHeader}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h5" noWrap className="ml-2">
            <a
              className="ml-2 font-bold text-input"
              href={getDomainWithoutSubdomain()}
            >
              {name}
            </a>
          </Typography>
          <IconButton
            onClick={handleDrawerClose}
            style={{ outline: "none" }}
            size="large"
          >
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <FormControlLabel
          className={classes.darkModeSwitch}
          control={
            <Switch
              checked={isDark}
              onChange={(e) => {
                const isDark = e.target.checked;
                setIsDark(isDark);
              }}
            />
          }
          label="Dark Mode"
          style={{ marginBottom: "5%", paddingLeft: 12 }}
        />
        <FormControlLabel
          className={classes.darkModeSwitch}
          control={
            <Switch
              checked={globalAnimation}
              onChange={(e) => setGlobalAnimation(e.target.checked)}
            />
          }
          label="Animation"
          style={{ marginBottom: "5%", paddingLeft: 12 }}
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
                {groupedDrawerContent[groupedContents].map((item) => (
                  <MaterialListItem
                    item={item}
                    key={item.name}
                    onClick={(listItem) => onItemClick(listItem)}
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
        <Typography
          variant="subtitle1"
          color="textSecondary"
          style={{ marginLeft: "1rem" }}
        >
          Version {VERSION}
        </Typography>
      </Drawer>
      <div
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        {children}
      </div>
    </AppNavigationRoot>
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
  isSubdomainRoute: PropTypes.bool,
};

AppNavigation.defaultProps = {
  name: "Dat Do",
  isSubdomainRoute: false,
};
