import React from "react";
import PropTypes from 'prop-types';

import {Form, Radio, Button} from '@trussworks/react-uswds';

/**
 * @file
 * Provides a route direction form component.
 */

/**
 * The route direction form component.
 */
class FormDirection extends React.Component {

  /**
   * Constructs our route direction form component.
   *
   * @param {object} props
   */
  constructor(props) {
    super(props);
    // Set our default state.
    this.state = {
      direction: "0",
    };
    // Bind our event listeners.
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * Implements render().
   *
   * @returns {JSX.Element}
   *  Our route direction form element.
   */
  render() {
    // @todo eventually it would be nice to include the name of the initial stop for each direction.
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

  /**
   * Handles the change event on our radio buttons.
   *
   * @param {object} e
   *   The change event.
   */
  handleChange(e) {
    this.setState({direction: e.target.value});
  }

  /**
   * Handles the form submit event.
   *
   * @param {object} e
   *   The submit event.
   */
  handleSubmit(e) {
    e.preventDefault();
    let values = {
      "direction": this.state.direction,
    };
    // Fire off our provided, parent handler.
    this.props.submitHandler(values);
  }
}

/**
 * Set our expected direction form prop types.
 *
 * @type {{submitHandler: Validator<NonNullable<T>>}}
 */
FormDirection.propTypes = {
  submitHandler: PropTypes.func.isRequired,
}

export default FormDirection;
