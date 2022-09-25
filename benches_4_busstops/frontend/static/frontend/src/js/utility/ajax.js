import axios from "axios"

const RESOURCES = {
  ALL_ROUTES: "api/thezero/v1/routes",
  DISTINCT_ROUTES: "api/thezero/v1/routes/distinct",
  DISTINCT_STOPS: "api/thezero/v1/stops/distinct",
  RECORDING_CREATE: "api/thezero/v1/recording/create"
}

export function getDistinctLists(callback) {
  axios.all([
    axios.get(RESOURCES.DISTINCT_ROUTES),
    axios.get(RESOURCES.DISTINCT_STOPS),
  ])
    .then(axios.spread((routes, stops) => {
      callback(routes.data, stops.data);
    }))
    .catch((error) => {
      console.log(error);
    });
}

export function getRouteStops(routeId, callback) {
  axios.get(RESOURCES.ALL_ROUTES, {params: {rtd_route_id: routeId}})
    .then((routes) => {
      callback(routes.data);
    })
    .catch((error) => {
      console.log(error);
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

