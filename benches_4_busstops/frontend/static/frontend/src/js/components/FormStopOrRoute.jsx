import React from "react";
import PropTypes from 'prop-types';

import {Form, FormGroup, Alert, ErrorMessage, Label, Button, ComboBox} from '@trussworks/react-uswds';

/**
 * @file
 * Provides a stop or route mode form.
 */

/**
 * The stop or route mode form component.
 */
class FormStopOrRoute extends React.Component {

  /**
   * Constructs our stop or route mode form component.
   *
   * @param {object} props
   */
  constructor(props) {
    super(props);
    // Set up the default state.
    this.state = {
      route: false,
      stop: false,
      errors: this.getDefaultErrors(),
    }
    // Bind our event listeners.
    this.handleRouteChange = this.handleRouteChange.bind(this)
    this.handleStopChange = this.handleStopChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  /**
   * Implements render().
   *
   * @returns {JSX.Element}
   *  Our stop or route mode form element.
   */
  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <h2>Route or Single Stop</h2>
        {!!this.state.errors.form &&
          <Alert type="error" heading="Error" headingLevel="h2">
            {this.state.errors.form}
          </Alert>
        }
        <p>Select a RTD route to log multiple bus stops.</p>
        <FormGroup error={!!this.state.errors.routes}>
          <Label htmlFor="distinct-routes">Select a RTD route</Label>
          {!!this.state.errors.routes &&
            <ErrorMessage id="distinct-routes">
              {this.state.errors.routes}
            </ErrorMessage>
          }
          <ComboBox
            id="distinct-routes"
            name="distinct-routes"
            options={this.getRouteOptions()}
            onChange={this.handleRouteChange}
          />
        </FormGroup>
        <p>Or select a single bus stop.</p>
        <FormGroup error={!!this.state.errors.stops} className="margin-bottom-3">
          <Label htmlFor="distinct-stops">Select a RTD bus stop</Label>
          {!!this.state.errors.stops &&
            <ErrorMessage id="distinct-stops">
              {this.state.errors.stops}
            </ErrorMessage>
          }
          <ComboBox
            id="distinct-stops"
            name="distinct-stops"
            options={this.getStopOptions()}
            onChange={this.handleStopChange}
          />
        </FormGroup>
        <Button type="submit">Continue</Button>
      </Form>
    );
  }

  /**
   * Gets API returned routes formatted as select list options.
   *
   * @returns {*[]}
   *   The formatted routes.
   */
  getRouteOptions() {
    let options = [];
    this.props.distinctRoutes.forEach((row) => {
      options.push({
        value: row.rtd_route_id,
        label: `${row.rtd_route_long_name} (${row.rtd_route_id})`
      });
    });
    return options;
  }

  /**
   * Gets API returned stops formatted as select list options.
   *
   * @returns {*[]}
   *   The formatted stops.
   */
  getStopOptions() {
    let options = [];
    this.props.distinctStops.forEach((row) => {
      options.push({
        error: "",
        value: row.id,
        label: row.rtd_stop_name,
      });
    });
    return options;
  }

  /**
   * Handles the change event on our route combo box.
   *
   * @param {string} value
   *   The value of the route combo box.
   */
  handleRouteChange(value) {
    this.setState({"route": value});
  }

  /**
   * Handles the change event on our stop combo box.
   *
   * @param {string} value
   *   The value of the stop combo box.
   */
  handleStopChange(value) {
    this.setState({"stop": value})
  }

  /**
   * Performs some lightweight validation on our form.
   *
   * @returns {boolean}
   *   Whether the form is valid.
   */
  validateForm() {
    let errors = this.getDefaultErrors()
    if (!this.state.route && !this.state.stop) {
      errors.form = "You must select either an RTD route or RTD stop.";
    }
    if (this.state.route && this.state.stop) {
      errors.routes = "RTD route may not be selected while stop is selected.";
      errors.stops = "RTD stop may not be selected while route is selected.";
    }
    let isValid = errors.routes === "" && errors.stops === "" && errors.form === "";
    if (!isValid) {
      this.setState({"errors": errors});
    }
    return isValid;
  }

  /**
   * Gets a default/empty error object.
   *
   * @returns {{routes: string, form: string, stops: string}}
   *   The error object in its default state.
   */
  getDefaultErrors() {
    return {
      "form": "",
      "routes": "",
      "stops": "",
    }
  }

  /**
   * Handles the form submit event.
   *
   * @param {object} e
   *   The submit event.
   */
  handleSubmit(e) {
    e.preventDefault()
    if (this.validateForm()) {
      let values = {
        "stop": this.state.stop,
        "route": this.state.route,
      }
      // Fire off the provided submit handler.
      this.props.submitHandler(values);
    }
  }

}

/**
 * Our stop or route form default props.
 *
 * @type {{distinctStops: {}, distinctRoutes: {}}}
 */
FormStopOrRoute.defaultProps = {
  distinctRoutes: {},
  distinctStops: {},
};

/**
 * Our expected stop or route form props.
 *
 * @type {{distinctStops: boolean | string[] | Requireable<any[]>, submitHandler: Validator<NonNullable<T>>, distinctRoutes: boolean | string[] | Requireable<any[]>}}
 */
FormStopOrRoute.propTypes = {
  distinctRoutes: PropTypes.array,
  distinctStops: PropTypes.array,
  submitHandler: PropTypes.func.isRequired,
}

export default FormStopOrRoute;
