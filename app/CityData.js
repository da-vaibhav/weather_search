import React from 'react';

var CityData = (data) => {
  let CityDetails = data.city_data;
  let CityWeather = CityDetails.list.map((ListItem, i) => {
    return (
      <li key={i}>
        <span>day {i + 1}: {ListItem.weather[0].description}</span>
      </li>
    );
  });

  return (
    <div>
      <h3>City Name: {CityDetails.city_name} </h3>
      <ul className='city_list'> {CityWeather} </ul>
    </div>
  );
};

CityData.propTypes = {
  city_data: React.PropTypes.object
};

export default CityData;
