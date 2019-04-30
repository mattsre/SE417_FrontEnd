import React, { Component } from 'react';
import { ApolloProvider } from "react-apollo";
import { client } from './apollo';
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from "react-router-dom";
import jwtDecode from 'jwt-decode';

import SDashboard from './components/SDashboard/SDashboard';
import SRegisterForm from "./components/SRegisterForm/SRegisterForm";
import SLoginForm from './components/SLoginForm/SLoginForm';
import './App.css';

const checkToken = () => {
  let token: any = localStorage.getItem("token");
  try {
    token = jwtDecode(token);
  } catch (error) {
    return false;
  }
  if (token.scope.dashboard) {
    return true;
  } else {
    return false
  }
}

const PrivateRoute = ({ component: Component, ...rest }: any) => (
  <Route {...rest} render={(props) => (
    checkToken()
      ? <Component {...props} />
      : <Redirect to='/login' />
  )} />
)

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Router>
          <PrivateRoute path="/dashboard" component={SDashboard} />
          <Route path="/register" component={SRegisterForm} />
          <Route path="/login" component={SLoginForm} />
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;
