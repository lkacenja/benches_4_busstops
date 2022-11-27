import React from "react";
import PropTypes from 'prop-types';

/**
 * @file
 * Provides a map marker component.
 */

/**
 * A map marker component.
 */
class Marker extends React.Component {

  /**
   * Implements render().
   *
   * @returns {JSX.Element}
   *  Our marker element.
   */
  render() {
    let classes = ["marker"];
    if (this.props.active) {
      classes.push("active")
    }
    return <div className={classes.join(" ")} />
  }
}

/**
 * Our marker components default props.
 *
 * NB: lat and lng are used by the parent Google Maps component.
 *
 * @type {{lng: number, active: boolean, lat: number}}
 */
Marker.defaultProps = {
  lat: 0,
  lng: 0,
  active: true,
};

/**
 * Our marker components expected prop types.
 *
 * @type {{lng: *, active: *, lat: *}}
 */
Marker.propTypes = {
  lat: PropTypes.number,
  lng: PropTypes.number,
  active: PropTypes.bool,
}

export default Marker;
