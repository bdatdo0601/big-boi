import React from "react";
import { createRoot } from "react-dom/client";

import hljs from "highlight.js/lib/core";
import App from "./App";
import { register } from "./registerServiceWorker";
import reportWebVitals from "./reportWebVitals";
import "highlight.js/styles/atom-one-dark.css";

hljs.initHighlightingOnLoad();

const root = createRoot(document.getElementById("root"));

root.render(<App />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
register();
reportWebVitals();
