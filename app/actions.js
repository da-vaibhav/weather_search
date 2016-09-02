/* global alert fetch */
import 'whatwg-fetch';

import { API_BASE_URL, PluckCityAndList } from './utils';
import ConfigKey from '../config';

export function SetUserLocation (location) {
  return {
    type: 'SET_USER_LOCATION',
    payload: {
      lat: location.lat,
      lon: location.lon,
      data: location.data
    }
  };
}

export function SearchQueryChange (location) {
  return {
    type: 'SEARCH_QUERY_CHANGE',
    SearchQuery: location
  };
}

export function SetCitiesData (data) {
  return {
    type: 'SET_CITIES_DATA',
    CitiesData: data.CitiesData
  };
}

export function IsLoading (loading) {
  return {
    type: 'IS_LOADING',
    IsLoading: loading
  };
}

export function OnFormSubmit (SearchQuery) {
  let cities = SearchQuery.split(',')
              .map((city) => city.trim())
              .filter((CityName) => CityName !== '');

  // all the initial bookkeeping here
  var urlPrefix = `${API_BASE_URL}?q=`;
  var urlSuffix = `&APPID=${ConfigKey}&units=metric`;
  var count = '&cnt=14';

  return (dispatch) => {
    if (cities.length < 1) {
      alert('Please enter valid city names separated by comma');
      return;
    }

    // avoid multiple dispatch(IsLoading = true) inside promise array
    dispatch(IsLoading(true));

    let CityPromises = cities.map((city) => {
      let location = encodeURIComponent(city);
      let url = urlPrefix + location + urlSuffix + count;
      return fetch(url).then(response => response.json());
    });

    Promise.all(CityPromises)
    .then((AllResponses) => {
      let CitiesData = AllResponses.map(PluckCityAndList);

      dispatch(IsLoading(false));
      dispatch(SetCitiesData({CitiesData}));
    })
    .catch((ex) => {
      dispatch(IsLoading(false));
      console.log('parsing failed', ex);
    });
  };
}
