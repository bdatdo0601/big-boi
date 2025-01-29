import { Suspense } from "react";
import { get, groupBy, has } from "lodash";
import { BrowserRouter as Router, Route, Routes } from "react-router";
import { Amplify } from "@aws-amplify/core";
import { Auth } from "@aws-amplify/auth";
import { Analytics, AWSKinesisProvider } from "@aws-amplify/analytics";
import { CircularProgress } from "@mui/material";

import awsconfig from "./aws-exports";
import routes, { errorRoutes, getRoutePath, ROUTE_TYPE, subdomainRouteMap } from "./routes";
import ContextProvider from "./context";
import Layout from "./layout";
import withCustomAWSAuthenticator, {
  useAuthenticateEffect,
} from "./components/withCustomAWSAuthenticator";
import "./App.css";

Amplify.configure({
  ...awsconfig,
});

Auth.configure(awsconfig);

Analytics.configure({
  AWSKinesisProvider: {
    region: awsconfig.aws_project_region,
    bufferSize: 1,
  },
});
Analytics.addPluggable(
  new AWSKinesisProvider({
    region: awsconfig.aws_project_region,
    bufferSize: 1,
  })
);
// Analytics.addPluggable(new AWSKinesisFirehoseProvider());
Analytics.enable();
const subdomain = window.location.host.split(".")[0];
const groupedRoutes = has(subdomainRouteMap, subdomain)
  ? groupBy(get(subdomainRouteMap, subdomain, []), "type.name")
  : groupBy(routes, "type.name");

function App() {
  useAuthenticateEffect();
  return (
    <Router>
      <Layout>
        <Suspense fallback={<CircularProgress />}>
          <Routes>
            {Object.keys(groupedRoutes).map((routeType) => {
              const routeTypeData = Object.values(ROUTE_TYPE).find(
                (item) => item.name === routeType
              );
              return get(routeTypeData, "withAuth", false)
                ? groupedRoutes[routeType].map((route) => (
                  <Route
                    key={route.name}
                    Component={withCustomAWSAuthenticator(route.component)}
                    path={getRoutePath(route)}
                  />
                ))
                : groupedRoutes[routeType].map((route) => (
                  <Route
                    key={route.name}
                    Component={route.component}
                    path={getRoutePath(route)}
                  />
                ));
            })}
            {routes.map((route) => (
              <Route
                key={route.name}
                Component={route.component}
                path={getRoutePath(route)}
              />
            ))}
            {errorRoutes.map((route) => (
              <Route
                key={route.name}
                Component={route.component}
                path={getRoutePath(route)}
              />
            ))}
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

const AppWrapper = (props: React.ComponentProps<any>) => (
  <ContextProvider>
    <App {...props} />
  </ContextProvider>
);

export default AppWrapper;
