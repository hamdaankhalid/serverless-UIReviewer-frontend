import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound"
import Login from "./containers/Login"
import Signup from "./containers/Signup";
import NewUi from "./containers/NewUi";
import Ui from "./containers/Ui";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/login">
        <Login />
      </Route>
      <Route exact path="/Signup">
        <Signup />
      </Route>
      <Route exact path="/ui/new">
        <NewUi />
      </Route>
      <Route exact path="/ui/:id">
        <Ui />
      </Route>
      {/* Finally, catch all unmatched routes */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}