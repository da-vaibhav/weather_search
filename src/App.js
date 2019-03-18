/* global alert */
import React, { Component } from 'react';
/* TODO: update dependencies, npm outdated */
import { SetUserLocation,
  SearchQueryChange,
  IsLoading,
  OnFormSubmit,
} from './actions';

import WeatherList from './WeatherList';
import UserResultsSection from './UserResultsSection';
import CityData from './CityData';

import { requestUsersLocation,
  SaveToLocalStorage,
  fetchGeoData,
} from './utils';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      SearchQuery: '',
      IsLoading: false,
      QueryDataFetched: false,
      location: {
        available: false,
        latitude: '',
        longitude: '',
        UserGeoData: [],
      },
      CitiesData: [],
    };

    this.null_search_text = 'please enter city names and press enter to search for cities.';
  }

  onFormSubmit = (e) => {
    e.preventDefault();
    OnFormSubmit(this.state.SearchQuery)
    .then(e => {
      console.log(e);
      this.setState({...this.state, CitiesData: e.CitiesData } );
    })
    .catch(reason => {
      console.log(reason);
    })
  }

  getUserLocation = (e) => {
    e.preventDefault();
    console.log('getting User Location...'); // eslint-disable-line

    // handle rejection here
    requestUsersLocation()
      .then(({ lat, lon }) => {
        console.log('got user location ', lat, lon); // eslint-disable-line
        // this.props.dispatch(IsLoading(true));
        return fetchGeoData(lat, lon);
      })
      .then((data) => {
        console.log('data list => ', data.list); // eslint-disable-line

      SaveToLocalStorage('forecast_data', data.list);

      this.setState({...this.state,
        location: {...this.state.location,
            available: true,
            latitude: data.city.coord.lat,
            longitude: data.city.coord.lon,
            UserGeoData: data.list,
        }
      });

      })
      .catch((err) => {
        alert(err);// eslint-disable-line
      });
  }

  showUserLocationWeather() {
    const LocalData = JSON.parse(window.localStorage.getItem('forecast_data'));

    if (LocalData.length < 1) {
      alert('Please provide your location to show the weather forecast data'); // eslint-disable-line

      return;
    }
    console.log(LocalData); // eslint-disable-line
  }

  locationChange = (e) => {
    this.setState({SearchQuery: (e.target.value)});
  }

  render() {
    const {
      CitiesData: cities,
      loading,
      location: {
        available: isLocationAvailable,
        latitude: Lat,
        longitude: Lon,
        UserGeoData
      }
    } = this.state;

    const locationAvailability = isLocationAvailable ? `Lat: ${Lat}, Lon: ${Lon}` : 'Not Available';

    let SearchResults;

    if (cities.length) {
      SearchResults = cities.map((city, i) => <CityData key={i} city_data={city} />);
    }

    const WeatherForUser = UserGeoData.map((day, i) =>
      <WeatherList key={i} index={i} day={day} />,
    );

    return (
      <form onSubmit={this.onFormSubmit}>
        {/*
          <pre style={{float: 'right'}}>
            <code> {JSON.stringify(this.props.state, null, 4)} </code>
          </pre>
        */}

        <input
          value={this.props.SearchQuery}
          type="search"
          onChange={this.locationChange}
          placeholder="Enter city names separated by comma. Eg. Mumbai, Pune, Nagpur"
        />
        {' '}

        <button type="submit">Search</button>
        <span> Your Location: {locationAvailability} </span>
        <button type="button" onClick={this.getUserLocation}>
          Show weather for my location
        </button>

        {
          !cities.length
            ? (<p><small>{this.null_search_text}</small></p>)
            : null
        }

        {loading ? <div className="loading-spinner" /> : ''}
        {isLocationAvailable ? <UserResultsSection WeatherForUser={WeatherForUser} /> : null}

        {
          cities.length
            ? (<div className="city-container">{SearchResults}</div>)
            : null
        }

      </form>
    );
  }
}

export default App;
