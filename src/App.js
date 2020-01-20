import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import routes from "./routes";
import ContextProvider from "./context";
import Layout from "./layout";

function App() {
  return (
    <ContextProvider>
      <Router>
        <Layout>
          <Switch>
            {routes.map(route => (
              <Route key={route.name} component={route.component} path={route.path} exact={route.exact} />
            ))}
          </Switch>
        </Layout>
      </Router>
    </ContextProvider>
  );
}

export default App;
