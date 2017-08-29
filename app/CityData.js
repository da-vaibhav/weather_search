import React from 'react';

const CityData = (data) => {
  const CityDetails = data.city_data;
  const CityWeather = CityDetails.list.map((ListItem, i) => (
    <li key={i}>
      <span>day {i + 1}: {ListItem.weather[0].description}</span>
    </li>
  ));

  return (
    <div>
      <h3>City Name: {CityDetails.city_name} </h3>
      <ul className="city_list"> {CityWeather} </ul>
    </div>
  );
};

export default CityData;
