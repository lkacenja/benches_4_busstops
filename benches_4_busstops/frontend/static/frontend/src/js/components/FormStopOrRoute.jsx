import React from "react";

import {Form, FormGroup, Alert, ErrorMessage, Label, Button, ComboBox} from '@trussworks/react-uswds';

class FormStopOrRoute extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      route: false,
      stop: false,
      errors: this.getDefaultErrors(),
    }
    this.handleRouteChange = this.handleRouteChange.bind(this)
    this.handleStopChange = this.handleStopChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <h2>Route or Single Stop</h2>
        { !!this.state.errors.form &&
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
        <FormGroup error={!!this.state.errors.stops}>
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

  handleRouteChange(value) {
    this.setState({"route": value});
  }

  handleStopChange(value) {
    this.setState({"stop": value})
  }

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

  getDefaultErrors() {
    return  {
      "form": "",
      "routes": "",
      "stops": "",
    }
  }

  handleSubmit(e) {
    e.preventDefault()
    if (this.validateForm()) {
      let values = {
        "stop": this.state.stop,
        "route": this.state.route,
      }
      this.props.submitHandler(values);
    }
  }
}

export default FormStopOrRoute;
