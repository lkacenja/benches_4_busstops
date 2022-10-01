import axios from "axios"

import {getUserLocation} from "./location";

const RESOURCES = {
  ALL_ROUTES: "api/thezero/v1/routes",
  DISTINCT_ROUTES: "api/thezero/v1/routes/distinct",
  ALL_STOPS: "api/thezero/v1/stops",
  RECORDING_CREATE: "api/thezero/v1/recording/create"
}

export function getDistinctLists(callback) {
  axios.all([
    axios.get(RESOURCES.DISTINCT_ROUTES),
    axios.get(RESOURCES.ALL_STOPS),
  ])
    .then(axios.spread((routes, stops) => {
      callback(routes.data, stops.data);
    }))
    .catch((error) => {
      console.log(error);
    });
}

export function getRouteStops(routeId, direction, callback) {
  axios.get(RESOURCES.ALL_ROUTES, {params: {rtd_route_id: routeId}})
    .then((response) => {
      let routes = response.data;
      getUserLocation()
        .then((location) => {
          let point = `POINT(${location.coords.latitude} ${location.coords.longitude})`;
          axios.get(RESOURCES.ALL_STOPS, {params: {coords: point, rtd_route_id: routeId, direction: direction}})
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

export function postRecordings(recordings, callback) {
  axios.post(RESOURCES.RECORDING_CREATE, recordings)
    .then(() => {
      callback()
    })
    .catch((error) => {
      console.log(error);
    });
}

