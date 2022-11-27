import React from "react";

/**
 * @file
 * Provides a static page component for when a user has completed logging data.
 */

/**
 * A simple static message component.
 */
class CompletionPage extends React.Component {

  /**
   * Implements render().
   *
   * @returns {JSX.Element}
   *   Our completion page element.
   */
  render() {
    return (<div>{"Thank you for taking the time to record benches for us. You may close this browser window now."}</div>);
  }

}

export default CompletionPage;
