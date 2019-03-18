import React from 'react';

const UserResultsSection = props => (
  <div className="user-data">
    <h4>Your location data:</h4>
    {props.WeatherForUser}
  </div>
);

export default UserResultsSection;
