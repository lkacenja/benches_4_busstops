import React from "react";

import {Form, Radio, Button} from '@trussworks/react-uswds';

class FormDirection extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      direction: "outbound",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <h2>Direction</h2>
        <Radio
          id="direction-outbound"
          name="direction"
          label="Outbound"
          value="outbound"
          labelDescription="Away from the bus station"
          checked={this.state.direction === "outbound"}
          tile
          onChange={this.handleChange}
        />
        <Radio
          id="direction-inbound"
          name="direction"
          label="Inbound"
          value="inbound"
          labelDescription="Toward the bus station"
          checked={this.state.direction === "inbound"}
          tile
          onChange={this.handleChange}
        />
        <Button type="submit">Continue</Button>
      </Form>
    );
  }

  handleChange(e) {
    this.setState({direction: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    let values = {
      "direction": this.state.direction,
    };
    this.props.submitHandler(values);
  }
}


export default FormDirection;
