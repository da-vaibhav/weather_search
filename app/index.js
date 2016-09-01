import React from 'react';
import {render} from 'react-dom';
import App from './App';
import reducer from './reducers';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

let store = createStore(reducer, window.devToolsExtension && window.devToolsExtension());

render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('root')
);
