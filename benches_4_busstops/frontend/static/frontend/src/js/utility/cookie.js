/**
 * @file
 * Provides cookie related utilities.
 */

/**
 * Sets a cookie with a duration in days.
 *
 * @param {string} name
 *   The name of the cookie.
 * @param {string} value
 *   The value for the cookie.
 * @param {number} days
 *   The lifespan of the cookie in days.
 */
export function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

/**
 * Gets a cookie value by name.
 *
 * @param {string} name
 *   The name of the cookie.
 *
 * @returns {string|null}
 *   The value of the cookie or null if one is not found.
 */
export function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
