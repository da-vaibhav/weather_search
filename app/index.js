import React from 'react';
import {render} from 'react-dom';
import App from './App';
import reducer from './reducers';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

let store = createStore(reducer, compose(applyMiddleware(thunk)));

render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('root')
);
