/**
 * @file
 * Provides a central location for our app's constants.
 */

/**
 * A list of our application's possible states.
 *
 * @type {{CAPTCHA: string, FORM_BENCH: string, FORM_STOP_OR_ROUTE: string, FORM_DIRECTION: string, COMPLETION_PAGE: string}}
 */
export const APP_MODES = {
  CAPTCHA: "CAPTCHA",
  FORM_STOP_OR_ROUTE: "FORM_STOP_OR_ROUTE",
  FORM_DIRECTION: "FORM_DIRECTION",
  FORM_BENCH: "FORM_BENCH",
  COMPLETION_PAGE: "COMPLETION_PAGE",
}

/**
 * A list of API resources/endpoints.
 *
 * @type {{DISTINCT_ROUTES: string, ALL_ROUTES: string, ALL_STOPS: string, RECORDING_CREATE: string}}
 */
export const API_RESOURCES = {
  ALL_ROUTES: "api/thezero/v1/routes",
  DISTINCT_ROUTES: "api/thezero/v1/routes/distinct",
  ALL_STOPS: "api/thezero/v1/stops",
  RECORDING_CREATE: "api/thezero/v1/recording/create"
}

/**
 * The namespace where our captcha cookie should live.
 *
 * @type {string}
 */
export const CAPTCHA_COOKIE = 'benchcaptcha';

/**
 * The key word that marks an object as a route.
 *
 * @type {string}
 */
export const RTD_ROUTE = 'route';

/**
 * The key word that marks an object as a stop.
 *
 * @type {string}
 */
export const RTD_STOP = 'stop';
