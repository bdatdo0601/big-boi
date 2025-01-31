import { Suspense } from "react";
import { get, groupBy, has } from "lodash";
import { BrowserRouter as Router, Route, Routes } from "react-router";
import { Amplify } from "aws-amplify";
import { CircularProgress } from "@mui/material";
import amplifyconfig from './amplifyconfiguration.json';

import routes, { errorRoutes, getRoutePath, ROUTE_TYPE, subdomainRouteMap } from "./routes";
import ContextProvider from "./context";
import Layout from "./layout";
import { withCustomAWSAuthenticator } from "@/context/auth";
import "./App.css";

Amplify.configure({
  ...amplifyconfig,
  API: {
    GraphQL: {
      defaultAuthMode: 'apiKey',
      endpoint: amplifyconfig.aws_appsync_graphqlEndpoint
    }
  },
  Auth: {
    Cognito: {
      identityPoolId: amplifyconfig.aws_cognito_identity_pool_id,
      allowGuestAccess: true,
    }
  }
});

const subdomain = window.location.host.split(".")[0];
const groupedRoutes = has(subdomainRouteMap, subdomain)
  ? groupBy(get(subdomainRouteMap, subdomain, []), "type.name")
  : groupBy(routes, "type.name");

function App() {
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
    </Router>
  );
}

const AppWrapper = (props: React.ComponentProps<any>) => (
  <ContextProvider>
    <App {...props} />
  </ContextProvider>
);

export default AppWrapper;
