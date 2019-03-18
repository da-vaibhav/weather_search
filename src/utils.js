/* global fetch */
import ConfigKey from './config';

export function requestUsersLocation() {
  return new Promise((resolve, reject) => {
    window.navigator.geolocation.getCurrentPosition((position) => {
      const CoordinatesData = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      };
      resolve(CoordinatesData);
    }, (err) => {
      console.log(err); // eslint-disable-line
      reject('Access denied. Please provide access to your location.');
    });
  });
}

export function SaveToLocalStorage(key, val) {
  window.localStorage.setItem(key, JSON.stringify(val));
}

export function PluckCityAndList(data) {
  return {
    city_name: data.city.name,
    list: data.list,
  };
}

export const API_BASE_URL = 'http://api.openweathermap.org/data/2.5/forecast/daily';
const count = 'cnt=14';

export function fetchGeoData(latitude, longitude) {
  console.log('fetching geo data'); // eslint-disable-line


  const queryURL = `${API_BASE_URL}/?`;
  const lat = `lat=${latitude}`;
  const lon = `lon=${longitude}`;

  return new Promise((resolve) => {
    fetch(`${queryURL}${lat}&${lon}&${count}&APPID=${ConfigKey}&units=metric`)
      .then(response => response.json())
      .then((data) => {
        resolve(data);
      });
  });
}
