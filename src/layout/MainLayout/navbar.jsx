import { capitalize, get, groupBy, has } from "lodash";
import { IconButton } from "@mui/material";
import { Menu } from "@mui/icons-material";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import { LogoTitle } from "../../components/LogoTitle";

const subdomain = window.location.host.split(".")[0];

export const MainNavbar = ({ setDrawerOpen, isSubdomainRoute, routeList }) => {
  const navigate = useNavigate();
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
    <div className="min-md:bg-muted max-md:hidden bg-transparent w-full py-4 pr-12 pl-[2rem] min-md:sticky min-md:top-0 min-md:z-50 min-md:shadow-xl min-md:flex flex-row justify-between">
      <div className="flex flex-row gap-6 items-center">
        <IconButton
          onClick={() => {
            setDrawerOpen(true);
          }}
        >
          <Menu sx={{ color: "var(--input)" }} />
        </IconButton>
        <LogoTitle />
        {isSubdomainRoute && (
          <a href={window.location.href}>: {capitalize(subdomain)}</a>
        )}
      </div>
      <div className="max-lg:hidden flex gap-12 items-center">
        {tabItems.map((tabItem) => (
          <button
            className="pb-2 pt-2 hover:cursor-pointer"
            onClick={() => {
              navigate(tabItem.path);
            }}
            style={
              tabItem.path === location.pathname
                ? {
                    color: "var(--primary)",
                    fontWeight: "bolder",
                    borderBottom: "2px solid var(--primary)",
                  }
                : {
                    color: "var(--input)",
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
