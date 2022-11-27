import axios from "axios"

import {getUserLocation} from "./location";
import * as Constants from "./constants"

/**
 * @file
 * Provides ajax utilities for communicating with the API.
 */

/**
 * Gets distinct lists of routes and stops.
 *
 * @param {function} callback
 *   A callback to issue after a successful request.
 */
export function getDistinctLists(callback) {
  axios.all([
    axios.get(Constants.API_RESOURCES.DISTINCT_ROUTES),
    axios.get(Constants.API_RESOURCES.ALL_STOPS),
  ])
    .then(axios.spread((routes, stops) => {
      callback(routes.data, stops.data);
    }))
    .catch((error) => {
      console.log(error);
    });
}

/**
 * Gets stops for a given route id and direction.
 *
 * NB: If location is enabled, also get the closest stop.
 *
 * @param {string} routeId
 *   The RTD route id.
 * @param {number} direction
 *   Whether the direction is "incoming" or "outgoing".
 * @param {function} callback
 *   A callback to issue after a successful request.
 */
export function getRouteStops(routeId, direction, callback) {
  axios.get(Constants.API_RESOURCES.ALL_ROUTES, {params: {rtd_route_id: routeId}})
    .then((response) => {
      let routes = response.data;
      getUserLocation()
        .then((location) => {
          let point = `POINT(${location.coords.latitude} ${location.coords.longitude})`;
          axios.get(Constants.API_RESOURCES.ALL_STOPS, {params: {coords: point, rtd_route_id: routeId, direction: direction}})
            .then((response) => {
              let closestStop = response.data;
              callback(routes, closestStop);
            });
        })
        .catch(() => {
          callback(routes);
        });
    });
}

/**
 * Posts recording objects to the API for storage.
 *
 * @param {array} recordings
 *   An array of recording objects.
 * @param {function} callback
 *   A callback to issue after a successful request.
 */
export function postRecordings(recordings, callback) {
  axios.post(Constants.API_RESOURCES.RECORDING_CREATE, recordings)
    .then(() => {
      callback()
    })
    .catch((error) => {
      console.log(error);
    });
}

