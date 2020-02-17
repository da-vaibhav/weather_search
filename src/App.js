/* global alert */
import React from 'react';
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

const null_search_text = 'please enter city names and press enter to search for cities.';

function App () {
  const [SearchQuery, setSearchQuery] = React.useState('');
  const [IsLoading, setIsLoading] = React.useState(false);
  const [QueryDataFetched, setQueryDataFetched] = React.useState(false);
  const [CitiesData, setCitiesData] = React.useState([]);
  const [location, setLocation] = React.useState({
    location: {
    available: false,
    latitude: '',
    longitude: '',
    UserGeoData: [],
  }});

  function getUserLocation (e) {
    e.preventDefault();
    console.log('getting User Location...'); // eslint-disable-line
    setIsLoading(true);

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

        setLocation({
          available: true,
          latitude: data.city.coord.lat,
          longitude: data.city.coord.lon,
          UserGeoData: data.list
        });
      })
      .catch((err) => {
        alert(err);// eslint-disable-line
      }).finally(() => {
        setIsLoading(false);
      });
  }

  function onFormSubmit (e) {
    e.preventDefault();
    OnFormSubmit(SearchQuery)
    .then(e => {
      console.log(e);
      setCitiesData(e.CitiesData);
    })
    .catch(reason => {
      console.log(reason);
    })
  }

  function locationChange (e) {
    setSearchQuery(e.target.value);
  }

  const locationAvailability = location.available
  ? `Lat: ${location.latitude}, Lon: ${location.longitude}`
  : 'Not Available';

  let SearchResults;

    if (CitiesData.length) {
      SearchResults = CitiesData.map((city, i) => <CityData key={i} city_data={city} />);
    }

    let WeatherForUser;
    if(location.UserGeoData && location.UserGeoData.length) {
      WeatherForUser = location.UserGeoData.map((day, i) =>
        <WeatherList key={i} index={i} day={day} />,
      );
    }

  return (
  <form onSubmit={onFormSubmit}>
     <input
          value={SearchQuery}
          type="search"
          onChange={locationChange}
          placeholder="Enter city names separated by comma. Eg. Mumbai, Pune, Nagpur"
      />
      <button type="submit">Search</button>
      <span> Your Location: {locationAvailability} </span>
      <button type="button" onClick={getUserLocation}>
          Show weather for my location
      </button>
      {
          !CitiesData.length
            ? (<p><small>{null_search_text}</small></p>)
            : null
      }
      {IsLoading ? <div className="loading-spinner" /> : ''}
      {location.available ? <UserResultsSection WeatherForUser={WeatherForUser} /> : null}
      {
        CitiesData.length
          ? (<div className="city-container">{SearchResults}</div>)
          : null
      }
  </form>
  );
}

export default App;
