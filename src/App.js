import React, { Suspense } from "react";
import { groupBy } from "lodash";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Amplify from "@aws-amplify/core";
import Analytics, { AWSKinesisProvider } from "@aws-amplify/analytics";
import { CircularProgress } from "@material-ui/core";

import awsconfig from "./aws-exports";
import routes, { errorRoutes, ROUTE_TYPE } from "./routes";
import ContextProvider from "./context";
import Layout from "./layout";
import withCustomAWSAuthenticator, { useAuthenticateEffect } from "./components/withCustomAWSAuthenticator";
import "./App.css";

Amplify.configure({
  ...awsconfig,
  Analytics: {
    disabled: false,
    AWSPinpoint: {
      appId: awsconfig.aws_mobile_analytics_app_id,
      region: awsconfig.aws_mobile_analytics_app_region,
    },
  },
});

Analytics.configure({
  AWSKinesisProvider: {
    region: awsconfig.aws_mobile_analytics_app_region,
  },
  // AWSKinesisFirehoseProvider: {
  //   region: awsconfig.aws_mobile_analytics_app_region,
  // }
});
Analytics.addPluggable(new AWSKinesisProvider());
// Analytics.addPluggable(new AWSKinesisFirehoseProvider());
Analytics.enable();
const groupedRoutes = groupBy(routes, "type.name");

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
