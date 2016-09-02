/* global alert */
import React, { Component } from 'react';
import {connect} from 'react-redux';

import { SetUserLocation,
         SearchQueryChange,
         IsLoading,
         OnFormSubmit
       } from './actions';

import WeatherList from './WeatherList';
import UserResultsSection from './UserResultsSection';
import CityData from './CityData';
import { requestUsersLocation,
         SaveToLocalStorage,
         fetchGeoData
       } from './utils';

class App extends Component {
  constructor (props) {
    super(props);

    // bind methods
    this.getUserLocation = this.getUserLocation.bind(this);
    this.locationChange = this.locationChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);

    this.null_search_text = 'please enter city names and press enter to search for cities.';
  }

  getUserLocation (e) {
    e.preventDefault();
    console.log('getting User Location...');

    // handle rejection here
    requestUsersLocation()
    .then(({lat, lon}) => {
      console.log('got user location ', lat, lon);
      this.props.dispatch(IsLoading(true));
      return fetchGeoData(lat, lon);
    })
    .then(data => {
      console.log('data list => ', data.list);
      SaveToLocalStorage('forecast_data', data.list);

      this.props.dispatch(SetUserLocation({
        lat: data.city.coord.lat,
        lon: data.city.coord.lon,
        data: data.list
      }));
    })
    .catch(err => {
      alert(err);
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

  onFormSubmit (e) {
    e.preventDefault();
    this.props.dispatch(OnFormSubmit(this.props.SearchQuery));
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
        {isLocationAvailable ? <UserResultsSection WeatherForUser={WeatherForUser} /> : null}

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
