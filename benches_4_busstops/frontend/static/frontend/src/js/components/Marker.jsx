import React from "react";

class Marker extends React.Component {
  render() {
    let classes = ["marker"];
    if (this.props.active) {
      classes.push("active")
    }
    return <div className={classes.join(" ")} />
  }
}

Marker.defaultProps = {
  lat: 0,
  lng: 0,
  active: true,
};

export default Marker;
