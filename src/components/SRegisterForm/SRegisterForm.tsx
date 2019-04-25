import gql from "graphql-tag";
import { Mutation, MutationFunc } from 'react-apollo';
import React, { PureComponent } from "react";
import { handleStringChange } from "@blueprintjs/docs-theme";
import { Card, Elevation, H5, FormGroup, InputGroup, Button, Toaster, Intent } from "@blueprintjs/core";
import { Link, Redirect } from "react-router-dom";
import "./SRegisterForm.css";

// Create User GraphQL mutation
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

// Validation State Enum
enum ValidState {
  Empty,
  Not_Valid,
  Valid
}

// SRegisterProps
interface ISRegisterProps {

}

// SRegisterState
interface ISRegisterState {
  user_data: {
    user_email: string;
    user_fname: string;
    user_lname: string;
    user_password: string;
    user_password_confirm: string;
  },
  status: {
    to_dashboard: boolean;
    register_loading: boolean;
  },
  validation: {
    valid_email: ValidState;
    valid_fname: ValidState;
    valid_lname: ValidState;
    valid_password: ValidState;
    valid_password_confirm: ValidState;
  }
}

class SRegisterForm extends PureComponent<ISRegisterProps, ISRegisterState> {
  public state: ISRegisterState = {
    user_data: {
      user_email: "",
      user_fname: "",
      user_lname: "",
      user_password: "",
      user_password_confirm: "",
    },
    status: {
      register_loading: false,
      to_dashboard: false,
    },
    validation: {
      valid_email: ValidState.Empty,
      valid_fname: ValidState.Empty,
      valid_lname: ValidState.Empty,
      valid_password: ValidState.Empty,
      valid_password_confirm: ValidState.Empty,
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
                helperText={this.state.validation.valid_email !== ValidState.Not_Valid ? "This email will be used to login." : "Please enter a valid email address."}
                intent={this.validationIntentHelper(this.state.validation.valid_email)}
              >
                <InputGroup
                  value={this.state.user_data.user_email}
                  type="email"
                  onChange={this.handleEmailChange}
                  onBlur={this.validateUserEmail}
                  intent={this.validationIntentHelper(this.state.validation.valid_email)}
                  placeholder="username@email.com"
                  required
                />
              </FormGroup>
              <FormGroup
                label="First Name"
                helperText={this.state.validation.valid_fname !== ValidState.Not_Valid ? "" : "Please enter a valid first name."}
                intent={this.validationIntentHelper(this.state.validation.valid_fname)}
              >
                <InputGroup
                  value={this.state.user_data.user_fname}
                  onChange={this.handleFNameChange}
                  onBlur={this.validateUserFName}
                  intent={this.validationIntentHelper(this.state.validation.valid_fname)}
                  placeholder="John"
                  required
                />
              </FormGroup>
              <FormGroup
                label="Last Name"
                helperText={this.state.validation.valid_lname !== ValidState.Not_Valid ? "" : "Please enter a valid last name."}
                intent={this.validationIntentHelper(this.state.validation.valid_lname)}
              >
                <InputGroup
                  value={this.state.user_data.user_lname}
                  onChange={this.handleLNameChange}
                  onBlur={this.validateUserLName}
                  intent={this.validationIntentHelper(this.state.validation.valid_lname)}
                  placeholder="Doe"
                  required
                />
              </FormGroup>
              <FormGroup
                label="Password"
                helperText={this.state.validation.valid_password !== ValidState.Not_Valid ? "Minimum eight characters, at least one uppercase letter, one lowercase letter, and one number" : "Please enter a valid password - Minimum eight characters, at least one uppercase letter, one lowercase letter and one number."}
                intent={this.validationIntentHelper(this.state.validation.valid_password)}
              >
                <InputGroup
                  value={this.state.user_data.user_password}
                  type="password"
                  onChange={this.handlePasswordChange}
                  onBlur={this.validatePassword}
                  intent={this.validationIntentHelper(this.state.validation.valid_password)}
                  placeholder="password"
                  required
                />
              </FormGroup>
              <FormGroup
                label="Password Confirm"
                helperText={this.state.validation.valid_password_confirm !== ValidState.Not_Valid ? "Confirm your password" : "Passwords do not match"}
                intent={this.validationIntentHelper(this.state.validation.valid_password_confirm)}
              >
                <InputGroup
                  value={this.state.user_data.user_password_confirm}
                  type="password"
                  onChange={this.handlePasswordConfirmChange}
                  onBlur={this.validatePasswordConfirm}
                  intent={this.validationIntentHelper(this.state.validation.valid_password_confirm)}
                  placeholder="password"
                  required
                />
              </FormGroup>
              <Button
                rightIcon="arrow-right"
                intent="success"
                text="Register"
                onClick={(e: any) => {
                  e.preventDefault();
                  let validationPass = true;
                  Object.entries(this.state.validation).forEach(([_, val]) => {
                    if (val !== 2) {
                      validationPass = false;
                    }
                  });
                  if (validationPass) {
                    this.setStatusState("register_loading", true);
                    createUser({
                      variables: {
                        user: {
                          email: this.state.user_data.user_email,
                          firstname: this.state.user_data.user_fname,
                          lastname: this.state.user_data.user_lname,
                          pass: this.state.user_data.user_password
                        }
                      }
                    });
                  } else {
                    this.toaster.show({
                      intent: Intent.DANGER,
                      message: "Validation failed, please register with valid information!"
                    });
                  }
                }}
                loading={this.state.status.register_loading}
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

  // GraphQL Mutatation Handlers
  private handleRegisterError() {
    this.setStatusState("register_loading", false);
    this.toaster.show({
      intent: Intent.DANGER,
      message: "Error registering... Please try again!"
    });
  }

  private handleRegisterResponse(data: any) {
    this.setStatusState("register_loading", false);
    const res = { ...data.createUser };
    if (res.statusCode === 200) {
      this.setStatusState("to_dashboard", true);
    }
  }

  // Text Input Change Handlers
  private handleEmailChange = handleStringChange(user_email => this.setUserDataState("user_email", user_email));
  private handleFNameChange = handleStringChange(user_fname => this.setUserDataState("user_fname", user_fname));
  private handleLNameChange = handleStringChange(user_lname => this.setUserDataState("user_lname", user_lname));
  private handlePasswordChange = handleStringChange(user_password => this.setUserDataState("user_password", user_password));
  private handlePasswordConfirmChange = handleStringChange(user_password_confirm => this.setUserDataState("user_password_confirm", user_password_confirm));

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

  private validateUserFName = () => {
    const nameRegex = new RegExp(/^[a-z ,.'-]+$/i);
    if (this.state.user_data.user_fname.match(nameRegex)) {
      this.setValidationState("valid_fname", ValidState.Valid);
    } else {
      this.setValidationState("valid_fname", ValidState.Not_Valid);
    }
  };

  private validateUserLName = () => {
    const nameRegex = new RegExp(/^[a-z ,.'-]+$/i);
    if (this.state.user_data.user_lname.match(nameRegex)) {
      this.setValidationState("valid_lname", ValidState.Valid);
    } else {
      this.setValidationState("valid_lname", ValidState.Not_Valid);
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

  private validatePasswordConfirm = () => {
    if (this.state.user_data.user_password === this.state.user_data.user_password_confirm) {
      this.setValidationState("valid_password_confirm", ValidState.Valid);
    } else {
      this.setValidationState("valid_password_confirm", ValidState.Not_Valid);
    }
  }

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
}

export default SRegisterForm;
