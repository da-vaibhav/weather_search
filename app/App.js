import React, { Component } from 'react';
import 'whatwg-fetch';
import {connect} from 'react-redux';

import key from '../config';

import { set_user_location,
         search_query_change,
         set_cities_data,
         is_loading
       } from './actions';

import reducer from './reducers';
import WeatherList from './WeatherList';
import CityData from './CityData';
import { GetUserLocation,
         SaveToLocalStorage,
         API_BASE_URL,
         pluck_city_and_list
       } from './utils';


class App extends Component {
  constructor(props){
    super(props);

    // bind methods
    this.getUserLocation = this.getUserLocation.bind(this);
    this.fetch_geo_data = this.fetch_geo_data.bind(this);
    this.locationChange = this.locationChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);

    this.null_search_text = 'please enter city names and press enter to search for cities.';
  }

  getUserLocation(e){
    e.preventDefault();
    console.log('getting User Location...');

    GetUserLocation()
    .then( ({lat, lon}) => {
      console.log('got user location ', lat, lon);
      this.props.dispatch(is_loading(true));
      return this.fetch_geo_data(lat, lon);
    })
    .then(data => {
      console.log('data list => ', data.list);
      SaveToLocalStorage('forecast_data', data.list);

      this.props.dispatch(is_loading(false));
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

    let query_url = `${API_BASE_URL}/?`;
    let lat = `lat=${latitude}`;
    let lon = `lon=${longitude}`;
    let count = `cnt=14`;

    return new Promise((resolve, reject) => {
      this.props.dispatch(is_loading(true));
      fetch(`${query_url}${lat}&${lon}&${count}&APPID=${key}&units=metric`)
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
    });
  }

  onFormSubmit(e) {
    e.preventDefault();
    let cities = this.props.search_query.split(',')
                  .map((city) => city.trim())
                  .filter((city_name) => city_name !== '');

    // all the initial bookkeeping here
    var urlPrefix = `${API_BASE_URL}?q=`;
    var urlSuffix = `&APPID=${key}&units=metric`;
    var count = '&cnt=14';


    if(cities.length < 1) {
      alert('Please enter valid city names separated by comma');
      return;
    }

    var city_promises = cities.map((city) => {
      var location = encodeURIComponent(city);
      var url = urlPrefix + location + urlSuffix + count;
      this.props.dispatch(is_loading(true));
      return fetch(url).then(response => response.json());
    });

    Promise.all(city_promises)
    .then((all_responses) => {
      let cities_data = all_responses.map(pluck_city_and_list);

      this.props.dispatch(is_loading(false));
      this.props.dispatch(set_cities_data({resultsFetched: true, cities_data: cities_data}));
    })
    .catch((ex) => {
      this.props.dispatch(is_loading(false));
      console.log('parsing failed', ex)
    });
  }


  locationChange(e){
    this.props.dispatch(search_query_change(e.target.value))
  }

  render(){
    let { lat: Lat,
          lon: Lon,
          is_location_set: is_location_available,
          cities_data_available,
          user_geo_data,
          cities_data: cities,
          loading
        } = this.props;

    let location_availability = is_location_available ? `Lat: ${Lat}, Lon: ${Lon}` : 'Not Available';

    let search_results;

    if (cities_data_available) {
      search_results = cities.map((city,i) => <CityData key={i} city_data={city} />);
    }

    let weather_for_user = user_geo_data
                           .map((day, i) => <WeatherList key={i} index={i} day={day} />);

    return (
      <form onSubmit={this.onFormSubmit}>
        {/*
          <pre style={{float: 'right'}}>
            <code> {JSON.stringify(this.props.state, null, 4)} </code>
          </pre>
        */}

        <input value={this.props.search_query}  type="search"
               onChange={this.locationChange}
               placeholder='Enter city names separated by comma. Eg. Mumbai, Pune, Nagpur' />
               {' '}

        <button type='submit'>Search</button>
        <span> Your Location: {location_availability} </span>
        <button type='button' onClick={this.getUserLocation}>
          Show weather for my location
        </button>

        {!cities_data_available ?
          (<p><small>{this.null_search_text}</small></p>):
          null
        }

        {loading ? <div className="loading-spinner"></div> : '' }

        {is_location_available ? (
          <div className="user-data">
            <h4>Your location data:</h4>
            {weather_for_user}
          </div>
          ) : ''}

        {
          cities_data_available ?
          (<div className="city-container">{search_results}</div>) :
          null
        }

     </form>
    );
  }
}

function matchStateToProps(state){
  return {
    search_query: state.search_query,
    lat: state.location.latitude,
    lon: state.location.longitude,
    is_location_set: state.location.available,
    user_geo_data: state.location.user_geo_data,
    cities_data: state.cities_data,
    loading: state.isLoading,
    cities_data_available: state.query_data_fetched
  }
}

App.propTypes = {
  search_query: React.PropTypes.string,
  lat: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
  lon: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
  is_location_set: React.PropTypes.bool,
  user_geo_data: React.PropTypes.array,
  cities_data: React.PropTypes.array,
  loading: React.PropTypes.bool,
  cities_data_available: React.PropTypes.bool
};

export default connect(matchStateToProps)(App);
