/* global fetch */
import ConfigKey from '../config';

export function requestUsersLocation () {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((position) => {
      let CoordinatesData = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
      };
      resolve(CoordinatesData);
    }, (err) => {
      console.log(err);
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
let count = 'cnt=14';

export function fetchGeoData (latitude, longitude) {
  console.log('fetching geo data');

  let queryURL = `${API_BASE_URL}/?`;
  let lat = `lat=${latitude}`;
  let lon = `lon=${longitude}`;

  return new Promise((resolve, reject) => {
    fetch(`${queryURL}${lat}&${lon}&${count}&APPID=${ConfigKey}&units=metric`)
    .then((response) => response.json())
    .then((data) => {
      resolve(data);
    });
  });
}
