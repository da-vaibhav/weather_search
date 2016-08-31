import React from 'react';

var WeatherList = (props) => {
  return(
    <li>
      <span>day {props.index + 1}</span> {props.day.weather[0].description}
    </li>
  )
}

export default WeatherList;
