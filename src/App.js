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
              <Route {...route} key={route.name} />
            ))}
          </Switch>
        </Layout>
      </Router>
    </ContextProvider>
  );
}

export default App;
