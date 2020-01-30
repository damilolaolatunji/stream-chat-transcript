import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { HashRouter, Route, Switch } from "react-router-dom";
import Customer from "./Customer";
import Admin from "./Admin";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <HashRouter>
    <Switch>
      <Route path="/" exact={true}>
        <Customer />
      </Route>
      <Route path="/admin" exact={true}>
        <Admin />
      </Route>
    </Switch>
  </HashRouter>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
