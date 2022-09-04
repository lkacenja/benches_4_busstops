import axios from "axios"

const RESOURCES = {
    ALL_ROUTES: "api/thezero/v1/routes/",
    DISTINCT_ROUTES: "api/thezero/v1/routes/distinct",
    DISTINCT_STOPS: "api/thezero/v1/stops/distinct",
    RECORDING_CREATE: "api/thezero/v1/recording/create"
}

export function getDistinctLists(callback, context) {
  axios.all([
      axios.get(RESOURCES.DISTINCT_ROUTES),
      axios.get(RESOURCES.DISTINCT_STOPS),
  ])
  .then(axios.spread((routes, stops) => {
    callback(routes, stops);
  }))
  .catch(function (error) {
    console.log(error);
  });
}

