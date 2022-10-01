import React from "react";

import HCaptcha from "@hcaptcha/react-hcaptcha";
import Header from "./Header";
import FormStopOrRoute from "./FormStopOrRoute";
import FormBench from "./FormBench";
import FormDirection from "./FormDirection";
import CompletionPage from "./CompletionPage";
import Footer from "./Footer";
import {getCookie, setCookie} from "../utility/cookie";
import {getDistinctLists, getRouteStops, postRecordings} from "../utility/ajax";

const APP_MODES = {
  CAPTCHA: "CAPTCHA",
  FORM_STOP_OR_ROUTE: "FORM_STOP_OR_ROUTE",
  FORM_DIRECTION: "FORM_DIRECTION",
  FORM_BENCH: "FORM_BENCH",
  COMPLETION_PAGE: "COMPLETION_PAGE",
}

class App extends React.Component {

  constructor(props) {
    super(props);
    let initialMode = getCookie("benchcaptcha") ? APP_MODES.FORM_STOP_OR_ROUTE : APP_MODES.CAPTCHA;
    this.state = {
      secrets: JSON.parse(document.getElementById("secrets").textContent),
      mode: initialMode,
      loading: false,
      locationRequested: false,
      userLocation: '',
      distinctStops: [],
      distinctRoutes: [],
      rtdObject: {},
      closestStop: {},
    };
    this.handleMainSubmit = this.handleMainSubmit.bind(this);
  }

  componentDidMount() {
    this.getDistinctLists();
  }

  componentDidUpdate() {
    this.getDistinctLists();
  }

  render() {
    return (
      <div className="header">
        <Header/>
        {this.getMainComponent()}
        <Footer/>
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
          sitekey={this.state.secrets.hcaptcha_site_key}
          onVerify={(token, ekey) => this.handleVerificationSuccess(token, ekey)}
        />
      case APP_MODES.FORM_STOP_OR_ROUTE:
        return <FormStopOrRoute
          distinctStops={this.state.distinctStops}
          distinctRoutes={this.state.distinctRoutes}
          submitHandler={this.handleMainSubmit}/>
      case APP_MODES.FORM_DIRECTION:
        return <FormDirection submitHandler={this.handleMainSubmit}/>
      case APP_MODES.FORM_BENCH:
        return <FormBench
          apiKey={this.state.secrets.google_maps_api_key}
          rtdObject={this.state.rtdObject}
          closestStop={this.state.closestStop}
          submitHandler={this.handleMainSubmit}/>
      case APP_MODES.COMPLETION_PAGE:
        return <CompletionPage />
    }
  }

  handleVerificationSuccess(token, ekey) {
    // @todo use a const for this.
    setCookie("benchcaptcha", ekey, 1)
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
        this.setState({loading: false, distinctStops: stops, distinctRoutes: routes})
      });
    }
  }

  handleMainSubmit(values) {
    let rtdObject;
    let mode;
    switch (this.state.mode) {
      case APP_MODES.FORM_STOP_OR_ROUTE:
        rtdObject = {};
        if (values.route) {
          rtdObject.type = "route";
          // todo why aren't we using pkey here?
          rtdObject.value = this.state.distinctRoutes.find((item) => {
            return item.rtd_route_id === values.route;
          });
          rtdObject.value.stops = [];
          mode = APP_MODES.FORM_DIRECTION;
        }
        if (values.stop) {
          rtdObject.type = "stop";
          rtdObject.value = this.state.distinctStops.find((item) => {
            return item.id === values.stop;
          });
          mode = APP_MODES.FORM_BENCH;
        }
        this.setState({rtdObject: rtdObject, mode: mode});
        break;

      case APP_MODES.FORM_DIRECTION:
        rtdObject = Object.assign({}, this.state.rtdObject);
        rtdObject.direction = values.direction;
        this.setState({loading: true});
        getRouteStops(this.state.rtdObject.value.rtd_route_id, rtdObject.direction, (routes, closestStop) => {
          rtdObject.value.stops = [];
          rtdObject.value.stops = routes.map((route) => {
            let stop = Object.assign({}, route.stop);
            stop.direction = route.direction;
            stop.rtd_stop_sequence = route.rtd_stop_sequence;
            return stop;
          });
          this.setState({rtdObject: rtdObject, closestStop: closestStop ? closestStop[0] : false, loading: false, mode: APP_MODES.FORM_BENCH});
        });
        break;
      case APP_MODES.FORM_BENCH:
        this.postRecordings(values);
        break;
    }
  }

  postRecordings(values) {
    if (values.length > 0) {
      this.setState({loading: true});
      postRecordings(values, () => {
        this.setState({loading: false, mode: APP_MODES.COMPLETION_PAGE})
      });
    }
    else {
      this.setState({mode: APP_MODES.COMPLETION_PAGE});
    }
  }

  getRouteStops(callback) {
    // @todo use const for type.
    if (this.state.mode === APP_MODES.FORM_BENCH
      && this.state.rtdObject.type === "route"
      && this.state.rtdObject.value.stops.length === 0
      && this.state.loading === false) {
      this.setState({loading: true});
      getRouteStops(this.state.rtdObject.value.rtd_route_id, (routes, closestStop) => {
        let rtdObject = Object.assign({}, this.state.rtdObject);
        rtdObject.value.stops = [];
        rtdObject.value.stops = routes.map((route) => {
          let stop = Object.assign({}, route.stop);
          stop.direction = route.direction;
          stop.rtd_stop_sequence = route.rtd_stop_sequence;
          return stop;
        });
        this.setState({rtdObject: rtdObject, closestStop: closestStop ? closestStop[0] : false, loading: false});
      });
    }
  }

}

export default App;
