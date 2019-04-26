import * as React from "react";
import { RingLoader } from "react-spinners";

export default class LoadingSpinner extends React.Component {
  render() {
    const loading =
      this.props.loading === undefined ? true : this.props.loading;
    if (loading) {
      return (
        <div id={this.props.size === "sm" ? "spinner-small" : "spinner"}>
          <RingLoader
            loading={loading}
            size={this.props.size === "sm" ? 15 : 60}
          />
        </div>
      );
    }
    return <React.Fragment>{this.props.children}</React.Fragment>;
  }
}
