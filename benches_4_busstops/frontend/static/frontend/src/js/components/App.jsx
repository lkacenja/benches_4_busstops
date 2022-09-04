import React from "react";

import HCaptcha from '@hcaptcha/react-hcaptcha';
import Header from './Header'
import FormStopOrRoute from './FormStopOrRoute'
import {setCookie, getCookie} from "../utility/cookie";
import {getDistinctLists} from "../utility/ajax";

const APP_MODES = {
  CAPTCHA: 'CAPTCHA',
  FORM_STOP_OR_ROUTE: 'FORM_STOP_OR_ROUTE',
}

class App extends React.Component {

  constructor(props) {
    super(props);
    let initialMode = getCookie("benchcaptcha") ? APP_MODES.FORM_STOP_OR_ROUTE : APP_MODES.CAPTCHA;
    this.state = {
      secrets: JSON.parse(document.getElementById('secrets').textContent),
      mode: initialMode,
      loading: false,
      distinctStops: [],
      distinctRoutes: []
    };
  }

  componentDidMount() {
    this.getDistinctLists()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.getDistinctLists()
  }

  render() {
    return (
      <div className="header">
        <Header/>
        {this.getMainComponent()}
      </div>
    )
  }

  getMainComponent() {
    if (this.state.loading) {
      return <div>Loading...</div>;
    }
    switch (this.state.mode) {
      case APP_MODES.CAPTCHA:
        return <HCaptcha
          sitekey={this.state.secretes.hcaptcha_site_key}
          onVerify={(token, ekey) => this.handleVerificationSuccess(token, ekey)}
        />
      case APP_MODES.FORM_STOP_OR_ROUTE:
        return <FormStopOrRoute
          distinctStops={this.state.distinctStops}
          distinctRoutes={this.state.distinctRoutes}
          submitHandler={this.handleMainSubmit} />
    }
  }

  handleVerificationSuccess(token, ekey) {
    setCookie('benchcaptcha', ekey, 1)
    this.setState({"mode": APP_MODES.FORM_STOP_OR_ROUTE});
  }

  getDistinctLists() {
    if (this.state.mode !== APP_MODES.CAPTCHA
      && this.state.loading === false
      && (this.state.distinctStops.length === 0
      || this.state.distinctRoutes.length === 0)
    ) {
      this.setState({loading: true});
      getDistinctLists((routes, stops) => {
            this.setState({loading: false, distinctStops: stops.data, distinctRoutes: routes.data})
      });
    }
  }

  handleMainSubmit(e) {
    let form = e.target
    console.log(form);
    e.preventDefault();

  }
};

export default App;
