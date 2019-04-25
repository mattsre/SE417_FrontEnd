import React, { PureComponent } from "react";
import { handleStringChange } from "@blueprintjs/docs-theme";
import { Card, Elevation, H5, FormGroup, InputGroup, Button } from "@blueprintjs/core";
import "./SLoginForm.css";
import { Link } from "react-router-dom";

interface ISLoginProps {
}

interface ISLoginState {
  user_email: string;
  user_password: string;
}

class SLoginForm extends PureComponent<ISLoginProps, ISLoginState> {
  public state: ISLoginState = {
    user_email: "",
    user_password: "",
  }

  render() {
    return (
      <Card elevation={Elevation.TWO}>
        <H5>Login</H5>
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
          label="Password"
        >
          <InputGroup
            value={this.state.user_password}
            type="password"
            onChange={this.handlePasswordChange}
            placeholder="password"
          />
        </FormGroup>
        <Button
          rightIcon="arrow-right"
          intent="success"
          text="Login"
        />
        <Link to="/register">
          <Button
            className="secondaryButton"
            minimal={true}
            intent="none"
            text="Or Register"
          />
        </Link>
      </Card>
    );
  }

  // Text Input Change Handlers
  private handleEmailChange = handleStringChange(user_email => this.setState({ user_email }));
  private handlePasswordChange = handleStringChange(user_password => this.setState({ user_password }));
}

export default SLoginForm;

