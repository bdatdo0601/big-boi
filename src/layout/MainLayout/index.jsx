import React, { useCallback, useEffect } from "react";
import { isFunction, has, get } from "lodash";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import routes, { subdomainRouteMap } from "../../routes";
import { WEBSITE_TITLE } from "../../utils/constants";
import { AppDrawer } from "../../components/AppDrawer";
import { MainNavbar } from "./navbar";
import { Hub } from "aws-amplify/utils";
import { IconButton } from "@mui/material";
import Menu from "@mui/icons-material/Menu";

const subdomain = window.location.host.split(".")[0];
const isSubdomainRoute = has(subdomainRouteMap, subdomain);

const domainRoutes = isSubdomainRoute
  ? get(subdomainRouteMap, subdomain, [])
  : routes;

export default function MainLayout({ children }) {
  const [open, setOpen] = React.useState(false);
  const [routeList, setRouteList] = React.useState([]);

  const updateRouteList = useCallback(() => {
    Promise.all(
      domainRoutes.map(async (item) => ({
        ...item,
        hidden: isFunction(item.hidden) ? await item.hidden() : item.hidden,
      }))
    ).then((resolvedRoutes) => {
      setRouteList(resolvedRoutes);
    });
  }, []);

  useEffect(() => {
    updateRouteList();
    Hub.listen("auth", () => {
      updateRouteList();
    });
  }, [updateRouteList]);

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{WEBSITE_TITLE}</title>
        <link rel="canonical" href={`${window.location.href}`} />
        <meta name="description" content="This is Dat'a Website" />
      </Helmet>
      <AppDrawer
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        routeList={routeList}
      />
      <div className="flex flex-col min-h-screen h-full z-10">
        <div className="min-md:hidden bg-muted shadow-lg w-10 fixed m-4 rounded-full z-10">
          <IconButton
            onClick={() => {
              setOpen(true);
            }}
          >
            <Menu sx={{ color: "var(--muted-foreground)" }} />
          </IconButton>
        </div>
        <MainNavbar
          setDrawerOpen={setOpen}
          isSubdomainRoute={isSubdomainRoute}
          routeList={routeList}
        />
        <main className="grow flex flex-col w-full">{children}</main>
      </div>
    </div>
  );
}

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string,
};

MainLayout.defaultProps = {
  name: "Dat Do",
};
