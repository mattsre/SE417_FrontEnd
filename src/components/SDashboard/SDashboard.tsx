import React, { PureComponent } from "react";
import { H1 } from "@blueprintjs/core";

interface ISDashboardProps {

}

interface ISDashboardState {

}

class SDashboard extends PureComponent<ISDashboardProps, ISDashboardState> {
  render() {
    return (
      <H1>User Dashboard</H1>
    )
  }
}

export default SDashboard;
