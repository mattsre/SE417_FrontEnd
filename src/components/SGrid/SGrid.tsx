import React, { PureComponent } from "react";
import './SGrid.css';

interface ISGridProps {
  children: any
}

interface ISGridState {

}

class SGrid extends PureComponent<ISGridProps, ISGridState> {
  render() {
    return (
      <div
        className="SGridContainer"
      >
        {this.props.children}
      </div>
    )
  }
}

export default SGrid;
