import React from 'react';

const WeatherList = props => (
  <li>
    <span>day {props.index + 1}</span> {props.day.weather[0].description}
  </li>
);

export default WeatherList;
