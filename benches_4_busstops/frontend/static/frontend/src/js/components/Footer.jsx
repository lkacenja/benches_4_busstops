import React from "react";

/**
 * @file
 * Provides a static footer component.
 */

/**
 * A static footer component for the app.
 */
class Footer extends React.Component {

  /**
   * Implements render().
   *
   * @returns {JSX.Element}
   *  Our footer element.
   */
  render() {
    return (
      <div className="footer">
        <a href="/">Start Over</a>
      </div>
    );
  }

}

export default Footer;
