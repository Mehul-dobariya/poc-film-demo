import React from 'react';
import logo from './logo.svg';
import './App.css';
import Films from './components/Films';
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
          <Redirect to="/films"/>
        )} />
         <Route path="/films" component={Films} />
      </Switch>
    </Router>
  );
}

export default App;
