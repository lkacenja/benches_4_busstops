import React from "react";

/**
 * @file
 * Provides a static header component.
 */

/**
 * A static header component for the app.
 */
class Header extends React.Component {

  /**
   * Implements render().
   *
   * @returns {JSX.Element}
   *  Our header element.
   */
    render() {
        return (
          <div className="header grid-container padding-x-0">
            <div className="header grid-row grid-gap">
                <img className="grid-col-4" src="/static/frontend/dist/images/logo.svg" alt="Logo with bus, phone and bench illustrations."/>
                <h1 className="grid-col-8">Benches 4 Bus Stops</h1>
            </div>
          </div>
        )
    }

}

export default Header;
