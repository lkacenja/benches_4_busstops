/**
 * @file
 * Provides location related utilities.
 */

/**
 * Gets a users current location, if supported by the browser.
 *
 * @returns {Promise<unknown>}
 *   A promise for the location request.
 */
export function getUserLocation() {
  return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      } else {
        reject("Geolocation services are not enabled on this browser.");
      }
    }
  );
}
