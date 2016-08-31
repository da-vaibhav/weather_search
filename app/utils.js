export function GetUserLocation() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition((position) => {
      resolve({lat: position.coords.latitude, long: position.coords.longitude})
    });
  });
}

export function SaveToLocalStorage(key, val) {
  window.localStorage.setItem(key, JSON.stringify(val));
}

export const API_BASE_URL = 'http://api.openweathermap.org/data/2.5/forecast';
