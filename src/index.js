import React from 'react';
import { render } from 'react-dom';
import App from './App';
import reducer from './reducers';

const initialState = {
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

render(<App {...initialState} />, document.getElementById('root'));
