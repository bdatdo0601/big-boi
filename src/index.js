import React from "react";
import ReactDOM from "react-dom";
import hljs from "highlight.js/lib/core";
import "./styles.css";
import App from "./App";
import * as serviceWorker from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import "highlight.js/styles/atom-one-dark.css";

hljs.initHighlightingOnLoad();

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
reportWebVitals();
