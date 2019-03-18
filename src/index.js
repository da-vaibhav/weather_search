import React from 'react';
import { render } from 'react-dom';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
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

render(<App initialState={initialState} />, document.getElementById('root'));
