import React from "react";
import PropTypes from 'prop-types';
import GoogleMapReact from "google-map-react";

import {Form, Radio, Button} from "@trussworks/react-uswds";
import Marker from "./Marker";

class FormBench extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentStop: false,
      bench: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    let activeStop = this.getActiveStop()
    // todo use css for map dimensions.
    return (
      <Form>
        {this.getTitle(activeStop)}
        <div style={{height: "150px", width: "100%"}}>
          <GoogleMapReact
            bootstrapURLKeys={{key: this.props.apiKey}}
            defaultCenter={this.parseCoords(activeStop.coords)}
            defaultZoom={17}
          >
            {this.getMarkers()}
          </GoogleMapReact>
          <Radio
            id="bench-yes"
            name="bench"
            label="Yes"
            value={"yes"}
            labelDescription="I see a bench."
            checked={this.state.bench === "yes"}
            tile
            onChange={this.handleChange}
          />
          <Radio
            id="bench-no"
            name="bench"
            label="No"
            value={"no"}
            labelDescription="I do not see a bench."
            checked={this.state.bench === "no"}
            tile
            onChange={this.handleChange}
          />
          <Button type="submit">Submit</Button>
        </div>
      </Form>
    );
  }

  getActiveStop() {
    let currentStop;
    if (this.props.rtdObject.type === "stop") {
      currentStop = this.props.rtdObject.value;
    }
    if (this.props.rtdObject.type === "route") {
      console.log(this.props.rtdObject);
      currentStop = this.props.rtdObject.value.stops[0];
    }
    return currentStop;
  }

  getTitle(activeStop) {
    let title;
    if (this.props.rtdObject.type === "stop") {
      title = <h2>activeStop.rtd_stop_name</h2>;
    }
    if (this.props.rtdObject.type === "route") {
      title = (
        <div className="title">
          <h2>{`${this.props.rtdObject.value.rtd_route_long_name} (${this.props.rtdObject.value.rtd_route_id})`}</h2>
          <strong>{"Current Stop: " + activeStop.rtd_stop_name}</strong>
        </div>
      );
    }
    return title;
  }

  getMarkers() {
    let coords;
    let markers = [];
    if (this.props.rtdObject.type === "stop") {
      coords = this.parseCoords(this.props.rtdObject.value.coords)
      markers.push(<Marker key={this.props.rtdObject.value.rtd_stop_name}
                           lat={coords.lat}
                           lng={coords.lng}/>);
    }
    if (this.props.rtdObject.type === "route") {
      this.props.rtdObject.value.stops.forEach((stop, index) => {
        coords = this.parseCoords(stop.coords)
        markers.push(<Marker key={index}
                             lat={coords.lat}
                             lng={coords.lng}
                             active={index === 0}/>);
      });
    }
    return markers;
  }

  parseCoords(stringCoords) {
    let pointPattern = /\(([0-9.-]*) ([0-9.-]*)\)/;
    let matches = stringCoords.match(pointPattern);
    // todo error here
    return {
      lat: parseFloat(matches[1]),
      lng: parseFloat(matches[2]),
    }
  }

  handleChange(e) {
    this.setState({bench: e.target.value});
  }
}

FormBench.defaultProps = {
  apiKey: "",
  rtdObject: {
    type: "",
    value: {},
  },
};

FormBench.propTypes = {
  apiKey: PropTypes.string.required,
  rtdObject: PropTypes.object.required,
}

export default FormBench;
