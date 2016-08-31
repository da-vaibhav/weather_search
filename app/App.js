import React, { Component } from 'react';
import 'whatwg-fetch';
import {connect} from 'react-redux';

import key from '../config';
import { set_user_location, search_query_change } from './actions';
import reducer from './reducers';
import WeatherList from './WeatherList';
import { GetUserLocation, SaveToLocalStorage, API_BASE_URL } from './utils';


class App extends Component {
  constructor(props){
    super(props);

    this.initial_text = 'Please enter the city names above and press enter to search.';

    // bind methods
    this.getUserLocation = this.getUserLocation.bind(this);
    this.fetch_geo_data = this.fetch_geo_data.bind(this);
    this.locationChange = this.locationChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  getUserLocation(e){
    e.preventDefault();
    console.log('getting User Location...');

    GetUserLocation()
    .then( ({lat, long}) => {
      console.log('got user location ', lat, long);
      return this.fetch_geo_data(lat, long);
    })
    .then(data => {
      console.log('data list => ', data.list);
      SaveToLocalStorage('forecast_data', data.list);

      this.props.dispatch(set_user_location({
        lat: data.city.coord.lat,
        lon: data.city.coord.lon,
        data: data.list
      }));
    });
  }

  showUserLocationWeather(){
    let local_data = JSON.parse(window.localStorage.getItem('forecast_data'));

    if (local_data.length < 1) {
      alert('Please provide your location to show the weather forecast data');
      return;
    }
    console.log(local_data);
  }

  fetch_geo_data(latitude, longitude){
    console.log('fetching geo data');

    let query_url = `${API_BASE_URL}/daily?`;
    let lat = `lat=${latitude}`;
    let lon = `lon=${longitude}`;
    let count = `cnt=14`;

    return new Promise(function(resolve, reject) {
      fetch(`${query_url}${lat}&${lon}&${count}&APPID=${key}&units=metric`)
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
    });
  }

  onFormSubmit(e){
    let cities = this.props.search_query.split(',').map((city) => city.trim());
    console.log(cities);
    e.preventDefault();

    var location = encodeURIComponent(this.props.search_query);
    var urlPrefix = `${API_BASE_URL}?q=`;
    var urlSuffix = `&APPID=${key}&units=metric`;
    var url = urlPrefix + location + urlSuffix;

    fetch(url)
    .then(function(response) {
      return response.json()
    })
    .then(function(data) {
      console.log('parsed json', data)
      this.setState({
        resultsFetched: true,
        cities_data: data
      })
    })
    .catch(function(ex) {
      console.log('parsing failed', ex)
    });
  }

  locationChange(e){
    this.props.dispatch(search_query_change(e.target.value))
  }

  render(){
    let Lat = this.props.lat;
    let Long = this.props.lon;
    let is_location_available = this.props.is_loation_set;
    let location_availability = is_location_available ? `Lat: ${Lat}, Long: ${Long}` : 'Not Available';

    let weather_for_user_city = this.props.user_geo_data.map((day, i) => {
      return (
        <WeatherList key={i} index={i} day={day} />
      )
    });

    return (
      <form onSubmit={this.onFormSubmit}>
        <input value={this.props.location} onChange={this.locationChange} type="text" placeholder={this.initial_text} />
        <p>{this.props.resultsFetched ? null : this.initial_text }</p>
        <p>
          Your Location: {location_availability} {' '}
          <button type='button' onClick={this.getUserLocation}>
            Show weather data for my location
          </button>
        </p>
        <div>
          {is_location_available ? weather_for_user_city : ''}
        </div>
        <br/>
        <br/>
        <small>key is {key}</small>
     </form>
    );
  }
}

function matchStateToProps(state){
  return {
    search_query: state.search_query,
    lat: state.location.latitude,
    lon: state.location.longitude,
    is_loation_set: state.location.available,
    user_geo_data: state.location.user_geo_data
  }
}

export default connect(matchStateToProps)(App);
