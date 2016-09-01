import React from 'react';

var CityData = (data) => {
  let city_details = data.city_data;
  let city_weather = city_details.list.map((list_item, i) => {
        return (
                <li key={i}>
                  day {i+1}:  {list_item.weather[0].description}
                </li>
                )
      })
  return (
    <div>
      <h3>City Name: {city_details.city_name} </h3>
      <ul className="city_list"> {city_weather} </ul>
    </div>
  )
}

export default CityData;
