import React from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

import Header from "./Header";
import FormStopOrRoute from "./FormStopOrRoute";
import FormBench from "./FormBench";
import FormDirection from "./FormDirection";
import CompletionPage from "./CompletionPage";
import Footer from "./Footer";
import * as Constants from "../utility/constants";
import {getCookie, setCookie} from "../utility/cookie";
import {getDistinctLists, getRouteStops, postRecordings} from "../utility/ajax";

/**
 * @file
 * Provides our top level App component.
 */

/**
 * The top level App component.
 */
class App extends React.Component {

  /**
   * Constructs our App component.
   *
   * @param props
   *   The initial props of the App component.
   */
  constructor(props) {
    super(props);
    // Check to see if the user has already passed the captcha on a previous load.
    let initialMode = getCookie("benchcaptcha") ?
      Constants.APP_MODES.FORM_STOP_OR_ROUTE : Constants.APP_MODES.CAPTCHA;
    // Set our initial state.
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
    // Make sure this is who we think it is.
    this.handleMainSubmit = this.handleMainSubmit.bind(this);
  }

  /**
   * Implements componentDidMount().
   */
  componentDidMount() {
    // If we aren't in hcaptcha mode, we need to get the distinct lists now.
    this.getDistinctLists();
  }

  /**
   * Implements componentDidUpdate().
   */
  componentDidUpdate() {
    // If we've made it past the first render and don't have distinct lists, get them now.
    this.getDistinctLists();
  }

  /**
   * Implements render().
   *
   * @returns {JSX.Element}
   *  Our app element.
   */
  render() {
    // The header and footer are static, but the main component changes based on state.
    return (
      <div className="grid-row">
        <div className="inside-app grid-col desktop:grid-col-6 mobile-lg:grid-col-8 margin-x-auto">
          <Header/>
          <div className="main-component margin-y-3">
            {this.getMainComponent()}
          </div>
          <Footer/>
        </div>
      </div>
    )
  }

  /**
   * Gets the main component for the current application state.
   *
   * @returns {JSX.Element}
   */
  getMainComponent() {
    if (this.state.loading) {
      return <div>Loading...</div>;
    }
    switch (this.state.mode) {
      case Constants.APP_MODES.CAPTCHA:
        return <HCaptcha
          sitekey={this.state.secrets.hcaptcha_site_key}
          onVerify={(token, ekey) => this.handleVerificationSuccess(token, ekey)}
        />
      case Constants.APP_MODES.FORM_STOP_OR_ROUTE:
        return <FormStopOrRoute
          distinctStops={this.state.distinctStops}
          distinctRoutes={this.state.distinctRoutes}
          submitHandler={this.handleMainSubmit}/>
      case Constants.APP_MODES.FORM_DIRECTION:
        return <FormDirection submitHandler={this.handleMainSubmit}/>
      case Constants.APP_MODES.FORM_BENCH:
        return <FormBench
          apiKey={this.state.secrets.google_maps_api_key}
          rtdObject={this.state.rtdObject}
          closestStop={this.state.closestStop}
          submitHandler={this.handleMainSubmit}/>
      case Constants.APP_MODES.COMPLETION_PAGE:
        return <CompletionPage/>
    }
  }

  /**
   * Called when a user succeeds at the hcaptcha.
   *
   * @param {object} token
   *   A token documenting the hcaptcha result.
   * @param {string} ekey
   *   The enterprise key.
   */
  handleVerificationSuccess(token, ekey) {
    setCookie(Constants.CAPTCHA_COOKIE, ekey, 1)
    this.setState({"mode": Constants.APP_MODES.FORM_STOP_OR_ROUTE});
  }

  /**
   * Get distinct lists of routes and stops.
   */
  getDistinctLists() {
    // Make sure not execute more than one request for these lists.
    if (this.state.mode !== Constants.APP_MODES.CAPTCHA
      && this.state.loading === false
      && (this.state.distinctStops.length === 0
        || this.state.distinctRoutes.length === 0)
    ) {
      this.setState({loading: true});
      getDistinctLists((routes, stops) => {
        this.setState({
          loading: false,
          distinctStops: stops,
          distinctRoutes: routes,
        })
      });
    }
  }

  /**
   * Handles the submit event for any main component that is a form.
   *
   * @param {object} values
   *   Relevant form values.
   */
  handleMainSubmit(values) {
    let rtdObject;
    let mode;
    switch (this.state.mode) {
      case Constants.APP_MODES.FORM_STOP_OR_ROUTE:
        // The "Stop or Route" form has been submitted.
        rtdObject = {};
        if (values.route) {
          rtdObject.type = Constants.RTD_ROUTE;
          // @todo why aren't we using pkey here?
          rtdObject.value = this.state.distinctRoutes.find((item) => {
            return item.rtd_route_id === values.route;
          });
          rtdObject.value.stops = [];
          mode = Constants.APP_MODES.FORM_DIRECTION;
        }
        if (values.stop) {
          rtdObject.type = Constants.RTD_STOP;
          rtdObject.value = this.state.distinctStops.find((item) => {
            return item.id === values.stop;
          });
          mode = Constants.APP_MODES.FORM_BENCH;
        }
        this.setState({rtdObject: rtdObject, mode: mode});
        break;

      case Constants.APP_MODES.FORM_DIRECTION:
        // The "Direction" form has been submitted.
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
          this.setState({
            rtdObject: rtdObject,
            closestStop: closestStop ? closestStop[0] : {},
            loading: false,
            mode: Constants.APP_MODES.FORM_BENCH
          });
        });
        break;
      case Constants.APP_MODES.FORM_BENCH:
        // The "Bench" form has been submitted.
        this.postRecordings(values);
        break;
    }
  }

  /**
   * Posts a set of bench "Recordings" to the API for saving.
   *
   * @param {object} values
   *   The recording values.
   */
  postRecordings(values) {
    if (values.length > 0) {
      this.setState({loading: true});
      postRecordings(values, () => {
        this.setState({
          loading: false,
          mode: Constants.APP_MODES.COMPLETION_PAGE
        })
      });
    } else {
      this.setState({mode: Constants.APP_MODES.COMPLETION_PAGE});
    }
  }

  /**
   * Gets all stops related to a given route.
   */
  getRouteStops() {
    // Make sure we don't have an active request for this route going.
    if (this.state.mode === Constants.APP_MODES.FORM_BENCH
      && this.state.rtdObject.type === Constants.RTD_ROUTE
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
        this.setState({
          rtdObject: rtdObject,
          closestStop: closestStop ? closestStop[0] : {},
          loading: false,
        });
      });
    }
  }

}

export default App;
