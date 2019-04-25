import gql from "graphql-tag";
import { Mutation, MutationFunc } from 'react-apollo';
import React, { PureComponent } from "react";
import { handleStringChange } from "@blueprintjs/docs-theme";
import { Card, Elevation, H5, FormGroup, InputGroup, Button, Toaster, Intent } from "@blueprintjs/core";
import { Link, Redirect } from "react-router-dom";
import "./SRegisterForm.css";

const CREATE_USER = gql`
  mutation CreateUser($user: UserInput!) {
    createUser(user: $user) {
      statusCode
      message
      user {
        userid
        firstname
        lastname
        email
      }
    }
  }
`;

interface ISRegisterProps {

}

interface ISRegisterState {
  user_email: string;
  user_fname: string;
  user_lname: string;
  user_password: string;
  user_password_confirm: string;
  register_loading: boolean;
  to_dashboard: boolean;
}

class SRegisterForm extends PureComponent<ISRegisterProps, ISRegisterState> {
  public state: ISRegisterState = {
    user_email: "",
    user_fname: "",
    user_lname: "",
    user_password: "",
    user_password_confirm: "",
    register_loading: false,
    to_dashboard: false,
  }

  private toaster: Toaster = new Toaster();
  private refHandlers = {
    toaster: (ref: Toaster) => (this.toaster = ref),
  };

  render() {
    if (this.state.to_dashboard) {
      return <Redirect to='' />
    }

    return (
      <Mutation
        mutation={CREATE_USER}
        onError={() => this.handleRegisterError()}
        onCompleted={(data: any) => this.handleRegisterResponse(data)}
      >
        {(createUser: MutationFunc) => (
          <React.Fragment>
            <Toaster ref={this.refHandlers.toaster} />
            <Card elevation={Elevation.TWO}>
              <H5>Registration</H5>
              <FormGroup
                label="Email"
              >
                <InputGroup
                  value={this.state.user_email}
                  type="email"
                  onChange={this.handleEmailChange}
                  placeholder="username@email.com"
                />
              </FormGroup>
              <FormGroup
                label="First Name"
              >
                <InputGroup
                  value={this.state.user_fname}
                  onChange={this.handleFNameChange}
                  placeholder="John"
                />
              </FormGroup>
              <FormGroup
                label="Last Name"
              >
                <InputGroup
                  value={this.state.user_lname}
                  onChange={this.handleLNameChange}
                  placeholder="Doe"
                />
              </FormGroup>
              <FormGroup
                label="Password"
              >
                <InputGroup
                  value={this.state.user_password}
                  type="password"
                  onChange={this.handlePasswordChange}
                  placeholder="password"
                />
              </FormGroup>
              <FormGroup
                label="Password Confirm"
              >
                <InputGroup
                  value={this.state.user_password_confirm}
                  type="password"
                  onChange={this.handlePasswordConfirmChange}
                  placeholder="password"
                />
              </FormGroup>
              <Button
                rightIcon="arrow-right"
                intent="success"
                text="Register"
                onClick={(e: any) => {
                  e.preventDefault();
                  this.setState({ register_loading: true });
                  createUser({
                    variables: {
                      user: {
                        email: this.state.user_email,
                        firstname: this.state.user_fname,
                        lastname: this.state.user_lname,
                        pass: this.state.user_password
                      }
                    }
                  });
                }}
                loading={this.state.register_loading}
              />
              <Link to="/login">
                <Button
                  className="secondaryButton"
                  minimal={true}
                  intent="none"
                  text="Or Login"
                />
              </Link>
            </Card>
          </React.Fragment>
        )}
      </Mutation>
    );
  }

  private handleRegisterError() {
    this.setState({ register_loading: false });
    this.toaster.show({
      intent: Intent.DANGER,
      message: "Error registering... Please try again!"
    });
  }

  private handleRegisterResponse(data: any) {
    this.setState({ register_loading: false });
    const res = { ...data.createUser };
    if (res.statusCode === 200) {
      this.setState({ to_dashboard: true });
    }
  }

  // Text Input Change Handlers
  private handleEmailChange = handleStringChange(user_email => this.setState({ user_email }));
  private handleFNameChange = handleStringChange(user_fname => this.setState({ user_fname }));
  private handleLNameChange = handleStringChange(user_lname => this.setState({ user_lname }));
  private handlePasswordChange = handleStringChange(user_password => this.setState({ user_password }));
  private handlePasswordConfirmChange = handleStringChange(user_password_confirm => this.setState({ user_password_confirm }));
}

export default SRegisterForm;
