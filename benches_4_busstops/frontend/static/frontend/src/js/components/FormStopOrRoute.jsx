import React from "react";

import {Form, Button, ComboBox} from '@trussworks/react-uswds'

class FormStopOrRoute extends React.Component {

  render() {
    return (
      <Form onSubmit={this.props.submitHandler}>
        <p>Select a RTD route to log multiple bus stops.</p>
        <label htmlFor="distinct-routes">Select a RTD route</label>
        <ComboBox
          id="distinct-routes"
          name="distinct-routes"
          options={this.getRouteOptions()}
        />
        <p>Or select a single bus stop.</p>
        <label htmlFor="distinct-stops">Select a RTD bus stop</label>
        <ComboBox
          id="distinct-stops"
          name="distinct-stops"
          options={this.getStopOptions()}
        />
        <Button type="submit">Submit</Button>
      </Form>
    );
  }

  getRouteOptions() {
    let options = [];
    this.props.distinctRoutes.forEach((row) => {
      options.push({
        value: row.id,
        label: `${row.rtd_route_long_name} (${row.rtd_route_id})`
      });
    });
    return options;
  }

  getStopOptions() {
    let options = [];
    this.props.distinctStops.forEach((row) => {
      options.push({
        value: row.id,
        label: row.rtd_stop_name,
      });
    });
    return options;
  }
}

export default FormStopOrRoute;
