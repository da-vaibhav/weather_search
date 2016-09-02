export function requestUsersLocation () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition((position) => {
      resolve({lat: position.coords.latitude, lon: position.coords.longitude});
    }, (err) => {
      reject('Access denied. Please provide access to your location.');
    });
  });
}

export function SaveToLocalStorage (key, val) {
  window.localStorage.setItem(key, JSON.stringify(val));
}

export function PluckCityAndList (data) {
  return {
    city_name: data.city.name,
    list: data.list
  };
}

export const API_BASE_URL = 'http://api.openweathermap.org/data/2.5/forecast/daily';
