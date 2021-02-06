import React, { Suspense } from "react";
import { groupBy } from "lodash";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Amplify from "aws-amplify";
import { CircularProgress } from "@material-ui/core";

import awsconfig from "./aws-exports";
import routes, { errorRoutes, ROUTE_TYPE } from "./routes";
import ContextProvider from "./context";
import Layout from "./layout";
import withCustomAWSAuthenticator from "./components/withCustomAWSAuthenticator";
import "./App.css";

Amplify.configure(awsconfig);

const groupedRoutes = groupBy(routes, "type.name");

function App() {
  return (
    <ContextProvider>
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
    </ContextProvider>
  );
}

export default App;
