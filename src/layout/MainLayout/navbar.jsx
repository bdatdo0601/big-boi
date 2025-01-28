import { capitalize, get, groupBy, has } from "lodash";
import { IconButton } from "@mui/material";
import { Menu } from "@mui/icons-material";
import { useMemo } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { LogoTitle } from "../../components/LogoTitle";

export const MainNavbar = ({ setDrawerOpen, isSubdomainRoute, routeList }) => {
  const history = useHistory();
  const location = useLocation();
  const tabItems = useMemo(
    () =>
      get(
        groupBy(
          routeList.filter((item) => !item.hidden),
          "type.name"
        ),
        "",
        []
      ),
    [routeList]
  );

  return (
    <div className="bg-accent w-full py-4 pr-12 pl-[2rem] sticky top-0 z-50 shadow-xl flex flex-row justify-between">
      <div className="flex flex-row gap-6 items-center">
        <IconButton
          onClick={() => {
            setDrawerOpen(true);
          }}
        >
          <Menu sx={{ color: "var(--primary)" }} />
        </IconButton>
        <LogoTitle />
        {isSubdomainRoute && (
          <a href={window.location.href}>: {capitalize(subdomain)}</a>
        )}
      </div>
      <div className="max-sm:hidden flex gap-12 items-center">
        {tabItems.map((tabItem) => (
          <button
            className="pb-2 pt-2 hover:cursor-pointer"
            onClick={() => {
              history.push(tabItem.path);
            }}
            style={
              tabItem.path === location.pathname
                ? {
                    color: "var(--foreground)",
                    fontWeight: "bolder",
                    borderBottom: "2px solid var(--foreground)",
                  }
                : {
                    color: "var(--primary)",
                  }
            }
            key={tabItem.name}
          >
            <span className="text-2xl">{tabItem.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
