import React, { Suspense } from "react";
import { get, groupBy, has } from "lodash";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Amplify from "@aws-amplify/core";
import Auth from "@aws-amplify/auth";
import Analytics, { AWSKinesisProvider } from "@aws-amplify/analytics";
import { CircularProgress } from "@mui/material";

import awsconfig from "./aws-exports";
import routes, { errorRoutes, ROUTE_TYPE, subdomainRouteMap } from "./routes";
import ContextProvider from "./context";
import Layout from "./layout";
import withCustomAWSAuthenticator, { useAuthenticateEffect } from "./components/withCustomAWSAuthenticator";
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
          {Object.keys(groupedRoutes).map(routeType => {
            const routeTypeData = Object.values(ROUTE_TYPE).find(item => item.name === routeType);
            return routeTypeData.withAuth ? (
              <Switch key={routeType}>
                {groupedRoutes[routeType].map(route => (
                  <Route
                    key={route.name}
                    component={withCustomAWSAuthenticator(route.component)}
                    path={route.path}
                    exact={route.exact}
                  />
                ))}
              </Switch>
            ) : (
              <Switch key={routeType}>
                {groupedRoutes[routeType].map(route => (
                  <Route key={route.name} component={route.component} path={route.path} exact={route.exact} />
                ))}
              </Switch>
            );
          })}
          <Switch>
            {routes.map(route => (
              <Route key={route.name} path={route.path} exact={route.exact} />
            ))}
            {errorRoutes.map(route => (
              <Route key={route.name} component={route.component} path={route.path} exact={route.exact} />
            ))}
          </Switch>
        </Suspense>
      </Layout>
    </Router>
  );
}

const AppWrapper = props => (
  <ContextProvider>
    <App {...props} />
  </ContextProvider>
);

export default AppWrapper;
