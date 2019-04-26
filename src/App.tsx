import React, { Component } from 'react';
import { ApolloProvider } from "react-apollo";
import { client } from './apollo';
import {
  BrowserRouter as Router,
  Route
} from "react-router-dom";

import SDashboard from './components/SDashboard/SDashboard';
import SRegisterForm from "./components/SRegisterForm/SRegisterForm";
import SLoginForm from './components/SLoginForm/SLoginForm';
import './App.css';

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Router>
          <Route path="/dashboard" component={SDashboard} />
          <Route path="/register" component={SRegisterForm} />
          <Route path="/login" component={SLoginForm} />
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;
