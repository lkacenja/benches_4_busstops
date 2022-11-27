import React from "react";
import PropTypes from 'prop-types';
import GoogleMapReact from "google-map-react";

import {Form, Radio, Button, ButtonGroup} from "@trussworks/react-uswds";
import Marker from "./Marker";
import {getCookie} from "../utility/cookie";
import * as Constants from "../utility/constants"

/**
 * @file
 * Provides a form for specifying whether a stop has a bench.
 */

/**
 * A form component for logging whether a stop has a bench.
 */
class FormBench extends React.Component {

  /**
   * Constructs our FormBench component.
   *
   * @param {object} props
   */
  constructor(props) {
    super(props);
    // Set default state.
    this.state = {
      currentStopSequence: this.getInitialSequence(props.closestStop),
      benches: {},
    };
    // Bind methods that need to have access to this component via context.
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleActionClick = this.handleActionClick.bind(this);
  }

  /**
   * Implements render().
   *
   * @returns {JSX.Element}
   *  Our bench from element.
   */
  render() {
    let activeStop = this.getActiveStop(this.state.currentStopSequence);
    return (
      <Form onSubmit={this.handleSubmit}>
        {this.getTitle(activeStop)}
        <div className="map-wrapper">
          <GoogleMapReact
            bootstrapURLKeys={{key: this.props.apiKey}}
            center={this.parseCoords(activeStop.coords)}
            defaultZoom={15}
          >
            {this.getMarkers()}
          </GoogleMapReact>
        </div>
        <div className="margin-bottom-3">
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
        </div>
        {
          this.getActions()
        }
      </Form>
    );
  }

  /**
   * Gets the currently active stop, based on stop sequence.
   *
   * @param {number} sequence
   *   The current stop sequence id.
   *
   * @returns {object}
   *   The current stop.
   */
  getActiveStop(sequence) {
    let currentStop = {};
    if (this.props.rtdObject.type === Constants.RTD_STOP) {
      currentStop = this.props.rtdObject.value;
    }
    if (this.props.rtdObject.type === Constants.RTD_ROUTE) {
      currentStop = this.getStopAtSequence(sequence);
    }
    return currentStop;
  }

  /**
   * Gets a stop object with a given sequence value.
   *
   * @param {number} sequence
   *  The stop sequence id.
   *
   * @returns {*}
   *  A stop or false if one is not found.
   */
  getStopAtSequence(sequence) {
    return this.props.rtdObject.value.stops.find((stop) => {
      return stop.direction === this.props.rtdObject.direction
        && sequence === stop.rtd_stop_sequence;
    });
  }

  /**
   * Gets the title element, based on "route" or "stop" mode.
   *
   * @param {object} activeStop
   *   The activeStop object.
   *
   * @returns {JSX.Element}
   *   The title element.
   */
  getTitle(activeStop) {
    let title = <h2>{"Unknown"}</h2>
    if (activeStop.rtd_stop_name && this.props.rtdObject.type === Constants.RTD_STOP) {
      title = <h2>{activeStop.rtd_stop_name}</h2>;
    }
    if (activeStop.rtd_stop_name && this.props.rtdObject.type === Constants.RTD_ROUTE) {
      title = (
        <div className="title">
          <h2>{`${this.props.rtdObject.value.rtd_route_long_name} (${this.props.rtdObject.value.rtd_route_id})`}</h2>
          <strong className="display-block margin-bottom-2">{"Current Stop: " + activeStop.rtd_stop_name}</strong>
        </div>
      );
    }
    return title;
  }

  /**
   * Gets the map Marker components.
   *
   * @returns {*[]}
   *   An array of zero or more marker components.
   */
  getMarkers() {
    let coords;
    let markers = [];
    if (this.props.rtdObject.type === Constants.RTD_STOP) {
      coords = this.parseCoords(this.props.rtdObject.value.coords)
      markers.push(<Marker key={this.props.rtdObject.value.rtd_stop_name}
                           lat={coords.lat}
                           lng={coords.lng}/>);
    }
    if (this.props.rtdObject.type === Constants.RTD_ROUTE) {
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

  /**
   * Gets the form submit and navigation, "action" buttons.
   *
   * @returns {*[]}
   *   An array of button components.
   */
  getActions() {
    let actions = [];
    if (this.props.rtdObject.type === Constants.RTD_STOP) {
      actions.push(<Button
        id="submit-done"
        key="submit-done"
        type="submit"
        onClick={this.handleActionClick}
      >
        Done
      </Button>);
    }
    if (this.props.rtdObject.type === Constants.RTD_ROUTE) {
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

  /**
   * Parses a WKT coordinate string.
   *
   * @param {string} stringCoords
   *
   * @returns {{lng: number, lat: number}}
   *   An object with the points latitude and longitude.
   */
  parseCoords(stringCoords) {
    let pointPattern = /\(([0-9.-]*) ([0-9.-]*)\)/;
    let matches = stringCoords.match(pointPattern);
    return {
      lat: parseFloat(matches[1]),
      lng: parseFloat(matches[2]),
    }
  }

  /**
   * Handles the change event on our bench radio buttons.
   *
   * @param {object} e
   *   The change event.
   */
  handleChange(e) {
    let currentStop = this.getActiveStop(this.state.currentStopSequence);
    let benches = Object.assign({}, this.state.benches);
    benches[currentStop.id] = e.target.value;
    this.setState({benches: benches});
  }

  /**
   * Handles the form submit event.
   *
   * @param {object} e
   *   The change event.
   */
  handleSubmit(e) {
    e.preventDefault();
  }

  /**
   * Handles the click event on our navigational or done button.
   *
   * @param {object} e
   *   The change event.
   */
  handleActionClick(e) {
    e.preventDefault();
    // Disregard clicks on disabled components.
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
        // Call our provided, parent submit handler.
        this.props.submitHandler(values);
        break;
    }
  }

  /**
   * Format our recorded values like the API expects.
   *
   * @returns {*[]}
   *   AN array of formatted value objects.
   */
  massageValues() {
    let values = [];
    let userId = getCookie(Constants.CAPTCHA_COOKIE).slice(0, 30);
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

  /**
   * Gets the default/initial stop sequence.
   *
   * @param {object} closestStop
   *   The closest stop to the user if location is enabled.
   *
   * @returns {*|number|number}
   *   The stop sequence id.
   */
  getInitialSequence(closestStop) {
    if (closestStop.id && this.props.rtdObject.type === Constants.RTD_ROUTE) {
      let fullStop = this.props.rtdObject.value.stops.find((stop) => {
        return stop.id === closestStop.id;
      });
      return fullStop ? fullStop.rtd_stop_sequence : 1;
    }
    return 1;
  }
}

/**
 * Our bench form's default props.
 *
 * @type {{apiKey: string, rtdObject: {type: string, value: {}}, closestStop: {}}}
 */
FormBench.defaultProps = {
  apiKey: "",
  rtdObject: {
    type: "",
    value: {},
  },
  closestStop: {},
};

/**
 * Our expected bench form prop types.
 *
 * @type {{apiKey: Validator<NonNullable<T>>, rtdObject: Validator<NonNullable<T>>, closestStop: Validator<NonNullable<T>>, submitHandler: Validator<NonNullable<T>>}}
 */
FormBench.propTypes = {
  apiKey: PropTypes.string.isRequired,
  rtdObject: PropTypes.object.isRequired,
  closestStop: PropTypes.object.isRequired,
  submitHandler: PropTypes.func.isRequired,
}

export default FormBench;
