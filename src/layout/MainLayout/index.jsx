import React, { useCallback, useEffect } from "react";
import { isFunction, has, get } from "lodash";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import routes, { subdomainRouteMap } from "../../routes";
import { WEBSITE_TITLE } from "../../utils/constants";
import { AppDrawer } from "../../components/AppDrawer";
import { MainNavbar } from "./navbar";
import { Hub } from "aws-amplify";

const classes = {
  drawerHeader: "LayoutdrawerHeader",
  content: "LayoutContent",
  contentShift: "LayoutContentShift",
  subscriptionButton: "LayoutContentSubscriptionButton",
};

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
      <div className="columns-1 flex-grow relative">
        <MainNavbar
          setDrawerOpen={setOpen}
          isSubdomainRoute={isSubdomainRoute}
          routeList={routeList}
        />
        <main>
          <div className={classes.drawerHeader} />
          {children}
        </main>
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
