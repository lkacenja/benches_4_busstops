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

