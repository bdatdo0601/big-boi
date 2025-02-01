import { Suspense } from "react";
import { get, groupBy, has, merge } from "lodash";
import { BrowserRouter as Router, Route, Routes } from "react-router";
import { Amplify } from "aws-amplify";
import { CircularProgress } from "@mui/material";
import amplifyconfig from './amplifyconfiguration.json';

import routes, { errorRoutes, getRoutePath, ROUTE_TYPE, subdomainRouteMap } from "./routes";
import ContextProvider from "./context";
import Layout from "./layout";
import { withCustomAWSAuthenticator } from "@/context/auth";
import "./App.css";
import { parseAWSExports } from "@aws-amplify/core/internals/utils";

const formattedConfig = merge(parseAWSExports(amplifyconfig), {
  Analytics: {
    Pinpoint: {
      appId: amplifyconfig.aws_mobile_analytics_app_id,
      region: amplifyconfig.aws_mobile_analytics_app_region,
    },
    Kinesis: {
      // REQUIRED -  Amazon Kinesis service region
      region: 'us-east-1',
      // OPTIONAL - The buffer size for events in number of items.
      bufferSize: 1000,
      // OPTIONAL - The number of events to be deleted from the buffer when flushed.
      flushSize: 100,
      // OPTIONAL - The interval in milliseconds to perform a buffer check and flush if necessary.
      flushInterval: 5000, // 5s
      // OPTIONAL - The limit for failed recording retries.
      resendLimit: 5
    }
  },
  Auth: {
    Cognito: {
      identityPoolId: amplifyconfig.aws_cognito_identity_pool_id,
      allowGuestAccess: true,
    }
  },
});

Amplify.configure(formattedConfig);

const subdomain = window.location.host.split(".")[0];
const groupedRoutes = has(subdomainRouteMap, subdomain)
  ? groupBy(get(subdomainRouteMap, subdomain, []), "type.name")
  : groupBy(routes, "type.name");

function App() {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<div className="w-full *:text-center mx-auto"><CircularProgress /></div>}>
          <Routes>
            {Object.keys(groupedRoutes).map((routeType) => {
              const routeTypeData = Object.values(ROUTE_TYPE).find(
                (item) => item.name === routeType
              );
              return get(routeTypeData, "withAuth", false)
                ? groupedRoutes[routeType].map((route) => (
                  <Route
                    key={route.name}
                    Component={route.component && withCustomAWSAuthenticator(route.component)}
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
    </Router >
  );
}

const AppWrapper = (props: React.ComponentProps<any>) => (
  <ContextProvider>
    <App {...props} />
  </ContextProvider>
);

export default AppWrapper;
