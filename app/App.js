/* global fetch, alert */
import React, { Component } from 'react';
import 'whatwg-fetch';
import {connect} from 'react-redux';

import key from '../config';

import { SetUserLocation,
         SearchQueryChange,
         SetCitiesData,
         IsLoading
       } from './actions';

import WeatherList from './WeatherList';
import CityData from './CityData';
import { GetUserLocation,
         SaveToLocalStorage,
         API_BASE_URL,
         PluckCityAndList
       } from './utils';

class App extends Component {
  constructor (props) {
    super(props);

    // bind methods
    this.getUserLocation = this.getUserLocation.bind(this);
    this.fetchGeoData = this.fetchGeoData.bind(this);
    this.locationChange = this.locationChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);

    this.null_search_text = 'please enter city names and press enter to search for cities.';
  }

  getUserLocation (e) {
    e.preventDefault();
    console.log('getting User Location...');

    GetUserLocation()
    .then(({lat, lon}) => {
      console.log('got user location ', lat, lon);
      this.props.dispatch(IsLoading(true));
      return this.fetchGeoData(lat, lon);
    })
    .then(data => {
      console.log('data list => ', data.list);
      SaveToLocalStorage('forecast_data', data.list);

      this.props.dispatch(IsLoading(false));
      this.props.dispatch(SetUserLocation({
        lat: data.city.coord.lat,
        lon: data.city.coord.lon,
        data: data.list
      }));
    });
  }

  showUserLocationWeather () {
    let LocalData = JSON.parse(window.localStorage.getItem('forecast_data'));

    if (LocalData.length < 1) {
      alert('Please provide your location to show the weather forecast data');
      return;
    }
    console.log(LocalData);
  }

  fetchGeoData (latitude, longitude) {
    console.log('fetching geo data');

    let queryURL = `${API_BASE_URL}/?`;
    let lat = `lat=${latitude}`;
    let lon = `lon=${longitude}`;
    let count = 'cnt=14';

    return new Promise((resolve, reject) => {
      this.props.dispatch(IsLoading(true));
      fetch(`${queryURL}${lat}&${lon}&${count}&APPID=${key}&units=metric`)
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      });
    });
  }

  onFormSubmit (e) {
    e.preventDefault();
    let cities = this.props.SearchQuery.split(',')
                  .map((city) => city.trim())
                  .filter((CityName) => CityName !== '');

    // all the initial bookkeeping here
    var urlPrefix = `${API_BASE_URL}?q=`;
    var urlSuffix = `&APPID=${key}&units=metric`;
    var count = '&cnt=14';

    if (cities.length < 1) {
      alert('Please enter valid city names separated by comma');
      return;
    }

    var CityPromises = cities.map((city) => {
      var location = encodeURIComponent(city);
      var url = urlPrefix + location + urlSuffix + count;
      this.props.dispatch(IsLoading(true));
      return fetch(url).then(response => response.json());
    });

    Promise.all(CityPromises)
    .then((AllResponses) => {
      let CitiesData = AllResponses.map(PluckCityAndList);

      this.props.dispatch(IsLoading(false));
      this.props.dispatch(SetCitiesData({CitiesData}));
    })
    .catch((ex) => {
      this.props.dispatch(IsLoading(false));
      console.log('parsing failed', ex);
    });
  }

  locationChange (e) {
    this.props.dispatch(SearchQueryChange(e.target.value));
  }

  render () {
    let { lat: Lat,
          lon: Lon,
          isLocationSet: isLocationAvailable,
          citiesDataAvailable,
          UserGeoData,
          CitiesData: cities,
          loading
        } = this.props;

    let locationAvailability = isLocationAvailable ? `Lat: ${Lat}, Lon: ${Lon}` : 'Not Available';

    let SearchResults;

    if (citiesDataAvailable) {
      SearchResults = cities.map((city, i) => <CityData key={i} city_data={city} />);
    }

    let WeatherForUser = UserGeoData.map((day, i) =>
      <WeatherList key={i} index={i} day={day} />
   );

    return (
      <form onSubmit={this.onFormSubmit}>
        {/*
          <pre style={{float: 'right'}}>
            <code> {JSON.stringify(this.props.state, null, 4)} </code>
          </pre>
        */}

        <input value={this.props.SearchQuery} type='search'
          onChange={this.locationChange}
          placeholder='Enter city names separated by comma. Eg. Mumbai, Pune, Nagpur' />
        {' '}

        <button type='submit'>Search</button>
        <span> Your Location: {locationAvailability} </span>
        <button type='button' onClick={this.getUserLocation}>
          Show weather for my location
        </button>

        {
          !citiesDataAvailable
          ? (<p><small>{this.null_search_text}</small></p>)
          : null
        }

        {loading ? <div className='loading-spinner'></div> : ''}

        {isLocationAvailable ? (
          <div className='user-data'>
            <h4>Your location data:</h4>
            {WeatherForUser}
          </div>
          ) : ''}

        {
          citiesDataAvailable
          ? (<div className='city-container'>{SearchResults}</div>)
          : null
        }

      </form>
    );
  }
}

function matchStateToProps (state) {
  return {
    SearchQuery: state.SearchQuery,
    lat: state.location.latitude,
    lon: state.location.longitude,
    isLocationSet: state.location.available,
    UserGeoData: state.location.UserGeoData,
    CitiesData: state.CitiesData,
    loading: state.IsLoading,
    citiesDataAvailable: state.QueryDataFetched
  };
}

App.propTypes = {
  SearchQuery: React.PropTypes.string,
  lat: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
  lon: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
  isLocationSet: React.PropTypes.bool,
  UserGeoData: React.PropTypes.array,
  CitiesData: React.PropTypes.array,
  loading: React.PropTypes.bool,
  citiesDataAvailable: React.PropTypes.bool
};

export default connect(matchStateToProps)(App);
