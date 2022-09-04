import React from "react";

class Header extends React.Component {
    render() {
        return (
            <div className="header">
                <h1>Benches 4 Bus Stops</h1>
                <img src="/static/frontend/dist/images/logo.svg" alt="Logo with bus, phone and bench illustrations."/>
            </div>
        )
    }
}

export default Header;
