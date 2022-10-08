import React from "react";

import {Form, Radio, Button} from '@trussworks/react-uswds';

class FormDirection extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      direction: "0",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <h2>Direction</h2>
        <div className="margin-bottom-3">
          <Radio
            id="direction-outbound"
            name="direction"
            label="Outbound"
            value="0"
            labelDescription="Away from the bus station"
            checked={this.state.direction === "0"}
            tile
            onChange={this.handleChange}
          />
          <Radio
            id="direction-inbound"
            name="direction"
            label="Inbound"
            value="1"
            labelDescription="Toward the bus station"
            checked={this.state.direction === "1"}
            tile
            onChange={this.handleChange}
          />
        </div>
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
