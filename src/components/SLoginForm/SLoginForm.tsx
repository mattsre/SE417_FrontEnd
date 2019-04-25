import React, { PureComponent } from "react";
import { handleStringChange } from "@blueprintjs/docs-theme";
import { Card, Elevation, H5, FormGroup, InputGroup, Button, Intent, Toaster } from "@blueprintjs/core";
import { Link, Redirect } from "react-router-dom";
import { ValidState, handleUserDataStateChange } from "../../helpers/FormDataHelpers";
import gql from "graphql-tag";
import { Mutation, MutationFunc } from "react-apollo";
import "./SLoginForm.css";

// Login User GraphQL mutation
const LOGIN_USER = gql`
  mutation LoginUser($credentials: LoginInput!) {
    loginUser(credentials: $credentials) {
      statusCode
      message
      loggedIn
    }
  }
`;

interface ISLoginProps {

}

interface ISLoginState {
  user_data: {
    user_email: string;
    user_password: string;
  },
  status: {
    login_loading: boolean;
    to_dashboard: boolean;
  },
  validation: {
    valid_email: ValidState;
    valid_password: ValidState;
  }
}

class SLoginForm extends PureComponent<ISLoginProps, ISLoginState> {
  public state: ISLoginState = {
    user_data: {
      user_email: "",
      user_password: "",
    },
    status: {
      login_loading: false,
      to_dashboard: false,
    },
    validation: {
      valid_email: ValidState.Empty,
      valid_password: ValidState.Empty,
    }
  }

  // BlueprintJS Toaster Setup
  private toaster: Toaster = new Toaster();
  private refHandlers = {
    toaster: (ref: Toaster) => (this.toaster = ref),
  };

  render() {
    if (this.state.status.to_dashboard) {
      return <Redirect to='/dashboard' />
    }

    return (
      <Mutation
        mutation={LOGIN_USER}
        onError={() => this.handleLoginError()}
        onCompleted={(data: any) => this.handleLoginResponse(data)}
      >
        {(loginUser: MutationFunc) => (
          <React.Fragment>
            <Toaster ref={this.refHandlers.toaster} />
            <Card elevation={Elevation.TWO}>
              <H5>Login</H5>
              <FormGroup
                label="Email"
                helperText={this.state.validation.valid_email !== ValidState.Not_Valid ? "Enter the email address associated with your account" : "Please enter a valid email address."}
                intent={this.validationIntentHelper(this.state.validation.valid_email)}
              >
                <InputGroup
                  name="user_email"
                  value={this.state.user_data.user_email}
                  type="email"
                  onChange={(e: React.FormEvent<HTMLInputElement>) => handleUserDataStateChange.call(this, e)}
                  onBlur={this.validateUserEmail}
                  intent={this.validationIntentHelper(this.state.validation.valid_email)}
                  placeholder="username@email.com"
                  required
                />
              </FormGroup>
              <FormGroup
                label="Password"
                helperText={this.state.validation.valid_password !== ValidState.Not_Valid ? "Please enter your password" : "This password does not meet our security requirements, please try again"}
                intent={this.validationIntentHelper(this.state.validation.valid_password)}
              >
                <InputGroup
                  name="user_password"
                  value={this.state.user_data.user_password}
                  type="password"
                  onChange={(e: React.FormEvent<HTMLInputElement>) => handleUserDataStateChange.call(this, e)}
                  onBlur={this.validatePassword}
                  intent={this.validationIntentHelper(this.state.validation.valid_password)}
                  placeholder="password"
                  required
                />
              </FormGroup>
              <Button
                rightIcon="arrow-right"
                intent="success"
                text="Login"
                loading={this.state.status.login_loading}
                type="submit"
                onClick={(e: any) => {
                  e.preventDefault();
                  let validationPass = true;
                  Object.entries(this.state.validation).forEach(([_, val]) => {
                    if (val !== ValidState.Valid) {
                      validationPass = false;
                    }
                  });
                  if (validationPass) {
                    this.setStatusState("login_loading", true);
                    loginUser({
                      variables: {
                        credentials: {
                          email: this.state.user_data.user_email,
                          pass: this.state.user_data.user_password
                        }
                      }
                    });
                  } else {
                    this.toaster.show({
                      intent: Intent.DANGER,
                      message: "The provided login is invalid!"
                    });
                  }
                }}
              />
              <Link to="/register">
                <Button
                  className="secondaryButton"
                  minimal={true}
                  intent="none"
                  text="Or Register"
                  type="button"
                />
              </Link>
            </Card>
          </React.Fragment>
        )}
      </Mutation>
    );
  }

  // GraphQL Mutatation Handlers
  private handleLoginError() {
    this.setStatusState("login_loading", false);
    this.toaster.show({
      intent: Intent.DANGER,
      message: "Error logging in... Please try again!"
    });
  }

  private handleLoginResponse(data: any) {
    this.setStatusState("login_loading", false);
    const res = { ...data.loginUser };
    if (res.loggedIn) {
      this.setStatusState("to_dashboard", true);
    } else {
      this.toaster.show({
        intent: Intent.DANGER,
        message: res.message
      });
    }
  }

  // State Handlers
  private setUserDataState = (key: string, val: any) => {
    this.setState(prevState => ({
      user_data: {
        ...prevState.user_data,
        [key]: val
      }
    }));
  }

  private setStatusState = (key: string, val: any) => {
    this.setState(prevState => ({
      status: {
        ...prevState.status,
        [key]: val
      }
    }));
  }

  private setValidationState = (key: string, val: ValidState) => {
    this.setState(prevState => ({
      validation: {
        ...prevState.validation,
        [key]: val
      }
    }));
  }

  // Client-Side Data Validation
  private validateUserEmail = () => {
    // eslint-disable-next-line
    const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (this.state.user_data.user_email.match(emailRegex)) {
      this.setValidationState("valid_email", ValidState.Valid);
    } else {
      this.setValidationState("valid_email", ValidState.Not_Valid);
    }
  };

  private validatePassword = () => {
    const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/);
    if (this.state.user_data.user_password.match(passwordRegex)) {
      this.setValidationState("valid_password", ValidState.Valid);
    } else {
      this.setValidationState("valid_password", ValidState.Not_Valid);
    }
  };

  // Data Validation Intent Helper
  private validationIntentHelper = (validity: ValidState) => {
    if (validity === ValidState.Valid) {
      return Intent.SUCCESS;
    } else if (validity === ValidState.Not_Valid) {
      return Intent.DANGER;
    } else {
      return Intent.NONE;
    }
  }

  // Text Input Change Handlers
  private handleEmailChange = handleStringChange(user_email => this.setUserDataState("user_email", user_email));
  private handlePasswordChange = handleStringChange(user_password => this.setUserDataState("user_password", user_password));
}

export default SLoginForm;
