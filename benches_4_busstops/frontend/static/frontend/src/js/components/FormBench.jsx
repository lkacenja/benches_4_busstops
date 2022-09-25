import React from "react";
import PropTypes from 'prop-types';
import GoogleMapReact from "google-map-react";

import {Form, Radio, Button, ButtonGroup} from "@trussworks/react-uswds";
import Marker from "./Marker";
import {getCookie} from "../utility/cookie";

class FormBench extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentStopSequence: 1,
      benches: {},
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleActionClick = this.handleActionClick.bind(this);
  }

  render() {
    let activeStop = this.getActiveStop(this.state.currentStopSequence);
    // todo use css for map dimensions.
    return (
      <Form onSubmit={this.handleSubmit}>
        {this.getTitle(activeStop)}
        <div style={{height: "150px", width: "100%"}}>
          <GoogleMapReact
            bootstrapURLKeys={{key: this.props.apiKey}}
            center={this.parseCoords(activeStop.coords)}
            defaultZoom={15}
          >
            {this.getMarkers()}
          </GoogleMapReact>
          <Radio
            id="bench-yes"
            name="bench"
            label="Yes"
            value={"yes"}
            labelDescription="I see a bench."
            checked={this.state.benches[activeStop.id] === "yes"}
            tile
            onChange={this.handleChange}
          />
          <Radio
            id="bench-no"
            name="bench"
            label="No"
            value={"no"}
            labelDescription="I do not see a bench."
            checked={this.state.benches[activeStop.id] === "no"}
            tile
            onChange={this.handleChange}
          />
          <Radio
            id="bench-unknown"
            name="bench"
            label="Unknown"
            value={"unknown"}
            labelDescription="I'm not sure."
            checked={!this.state.benches[activeStop.id] || this.state.benches[activeStop.id] === "unknown"}
            tile
            onChange={this.handleChange}
          />
          {this.getActions()}
        </div>
      </Form>
    );
  }

  getActiveStop(sequence) {
    let currentStop;
    if (this.props.rtdObject.type === "stop") {
      currentStop = this.props.rtdObject.value;
    }
    if (this.props.rtdObject.type === "route") {
      currentStop = this.getStopAtSequence(sequence);
    }
    return currentStop;
  }

  getStopAtSequence(sequence) {
    return this.props.rtdObject.value.stops.find((stop) => {
      return stop.direction === this.props.rtdObject.direction
        && sequence === stop.rtd_stop_sequence;
    });
  }

  getTitle(activeStop) {
    let title;
    if (this.props.rtdObject.type === "stop") {
      title = <h2>{activeStop.rtd_stop_name}</h2>;
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
        if (stop.direction === this.props.rtdObject.direction) {
          coords = this.parseCoords(stop.coords)
          markers.push(<Marker key={index}
                               lat={coords.lat}
                               lng={coords.lng}
                               active={stop.rtd_stop_sequence === this.state.currentStopSequence}/>);
        }
      });
    }
    return markers;
  }

  getActions() {
    let actions = [];
    if (this.props.rtdObject.type === "stop") {
      actions.push(<Button
        id="submit-done"
        key="submit-done"
        type="submit"
        onClick={this.handleActionClick}
      >
        Done
      </Button>);
    }
    if (this.props.rtdObject.type === "route") {
      let prevStopExists = !!(this.getStopAtSequence(this.state.currentStopSequence - 1));
      let nextStopExists = !!(this.getStopAtSequence(this.state.currentStopSequence + 1));
      actions.push(<ButtonGroup key="actions" type="default">
        <Button
          id="submit-prev"
          key="submit-prev"
          type="button"
          className="usa-button usa-button--outline"
          onClick={this.handleActionClick}
          disabled={!prevStopExists}
        >
          {prevStopExists ? "Previous Stop" : "No Previous Stop"}
        </Button>
        <Button
          id="submit"
          key="submit-continue"
          type="submit"
          onClick={this.handleActionClick}
          disabled={!nextStopExists}
        >
          {nextStopExists ? "Next Stop" : "No Next Stop"}
        </Button>
        <Button
          id="submit-done"
          key="submit-done"
          type="submit"
          onClick={this.handleActionClick}
        >
          Done
        </Button>
      </ButtonGroup>);
    }
    return actions;
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
    let currentStop = this.getActiveStop(this.state.currentStopSequence);
    let benches = Object.assign({}, this.state.benches);
    benches[currentStop.id] = e.target.value;
    this.setState({benches: benches});
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  handleActionClick(e) {
    e.preventDefault();
    if (e.target.disabled) {
      return;
    }
    let values;
    switch (e.target.id) {
      case "submit":
        this.setState({"currentStopSequence": this.state.currentStopSequence + 1});
        break;
      case "submit-prev":
        this.setState({"currentStopSequence": this.state.currentStopSequence - 1});
        break;
      case "submit-done":
        values = this.massageValues();
        this.props.submitHandler(values);
        break;
    }
  }

  massageValues() {
    let values = [];
    let userId = getCookie("benchcaptcha").slice(0, 30);
    // @todo what if this is not set anymore?
    // Maybe we reload the page if it's not found, starting app over.
    for (let stopId in this.state.benches) {
      if (this.state.benches[stopId] !== "unknown") {
        values.push({
          "user_id": userId,
          "stop": stopId,
          "has_bench": this.state.benches[stopId] === "yes" ? 1 : 0,
        })
      }
    }
    return values;
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
  apiKey: PropTypes.string.isRequired,
  rtdObject: PropTypes.object.isRequired,
  submitHandler: PropTypes.func.isRequired,
}

export default FormBench;
