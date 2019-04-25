import React, { Component } from 'react';
import { ApolloProvider } from "react-apollo";
import {
  BrowserRouter as Router,
  Route
} from "react-router-dom";

import { client } from './apollo';
import SRegisterForm from "./components/SRegisterForm/SRegisterForm";
import SLoginForm from './components/SLoginForm/SLoginForm';
import './App.css';

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Router>
          <div className="container">
            <Route path="/register" component={SRegisterForm} />
            <Route path="/login" component={SLoginForm} />
          </div>
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;
