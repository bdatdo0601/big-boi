import Drawer from "react-modern-drawer";
//import styles 👇
import "react-modern-drawer/dist/index.css";
import { FormControlLabel, IconButton, Switch } from "@mui/material";
import { Menu } from "@mui/icons-material";
import { useContext, useMemo } from "react";
import LayoutContext from "../../context/layout";
import { styled } from "@mui/material/styles";
import { LogoTitle } from "../LogoTitle";
import { VERSION } from "../../utils/constants";
import { groupBy, isEmpty } from "lodash";
import MaterialListItem from "../MaterialListItem";
import { useLocation, useNavigate } from "react-router";

const classes = {
  switch: "FormSwitch",
};

const StyledSwitchDiv = styled("div")(({ theme }) => ({
  [`& .${classes.switch}`]: {
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
}));

export const AppDrawer = ({ open, onClose, routeList }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setIsDark, isDark, globalAnimation, setGlobalAnimation } =
    useContext(LayoutContext);

  const groupedContents = useMemo(
    () =>
      groupBy(
        routeList.filter((item) => !item.hidden),
        "type.name"
      ),
    [routeList]
  );
  return (
    <Drawer
      open={open}
      onClose={onClose}
      direction="left"
      style={{ width: 300 }}
    >
      <div className="bg-popover h-full pb-4 px-4 flex flex-col justify-between overflow-y-scroll">
        <div className="flex flex-col gap-4 relative">
          <div className="flex justify-between items-center sticky top-0 bg-popover pt-4">
            <LogoTitle />
            <IconButton
              onClick={onClose}
              style={{ outline: "none" }}
              size="large"
            >
              <Menu sx={{ color: "var(--input)" }} />
            </IconButton>
          </div>
          <StyledSwitchDiv className="pt-4 border-y-1">
            <FormControlLabel
              className={classes.switch}
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
              className={classes.switch}
              control={
                <Switch
                  checked={globalAnimation}
                  onChange={(e) => setGlobalAnimation(e.target.checked)}
                />
              }
              label="Animation"
              style={{ marginBottom: "5%", paddingLeft: 12 }}
            />
          </StyledSwitchDiv>
          {!isEmpty(groupedContents) &&
            Object.keys(groupedContents).map((groupedContentKey, index) => (
              <div key={JSON.stringify(groupedContentKey) + index} className="border-b-1 pb-4 mt-2 flex-col flex gap-2">
                {groupedContentKey && (
                  <span className="text-popover-foreground font-black text-xl mb-2">{groupedContentKey}</span>
                )}
                {groupedContents[groupedContentKey].map((item) => (
                  <MaterialListItem
                    item={item}
                    key={item.name}
                    onClick={(listItem) => {
                      navigate(listItem.path);
                      onClose();
                    }}
                    isSelected={(listItem) => location.pathname === listItem.path}
                  />
                ))}
              </div>
            ))}
        </div>
        <div className="mt-4">
          <a className="text-lg text-input ml-4" href="/change-logs">
            <span className="font-bold italic">v{VERSION}</span> - The Big Boi Project
          </a>
        </div>
      </div>
    </Drawer>
  );
};
