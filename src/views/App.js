import React from "react";
import "./App.css";
import BaseLayout from "../layout/BaseLayout";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Discovery from "./Discovery/Discovery";
import SearchResult from "./searchResult/SearchResult";
import Video from "./Video/Video";
import PlayList from "./playlist/PlayList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Singer from "./singer/singer";
import Collect from "./collect/collect";
import User from "./user/User";
import Cloud from "../views/Cloud/index";

function App() {
  return (
    <BrowserRouter>
      <BaseLayout>
        <Route>
          <Switch>
            <Route path="/discovery" component={Discovery} />
            <Route path="/playvideo/:type/:id" component={Video} />
            <Route path="/playlist/:type/:id" component={PlayList} />
            <Route path="/search/:content" component={SearchResult} />
            <Route path="/singer/:id" component={Singer} />
            <Route path="/collect" component={Collect} />
            <Route path="/user/:id" component={User} />
            <Route path="/cloud" component={Cloud} />
            <Route path="/" component={Discovery} />
          </Switch>
        </Route>
      </BaseLayout>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
