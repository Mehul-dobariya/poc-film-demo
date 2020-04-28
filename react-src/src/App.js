import React from 'react';
// import logo from './logo.svg';
import './App.css';
import Films from './components/Films';
import FilmsAdd from './components/FilmsAdd';
import Login from './components/Login';
import Register from './components/Register';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" render={() => (
          <Redirect to="/films" />
        )} />
        <Route exact path="/films" component={Films} />
        <Route exact path="/films/create" component={FilmsAdd} />
        <Route path="/signIn" component={Login} />
        <Route path="/signUp" component={Register} />
      </Switch>
    </Router>
  );
}

export default App;
