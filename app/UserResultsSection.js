import React from 'react';

let UserResultsSection = (props) => {
  return (
    <div className='user-data'>
      <h4>Your location data:</h4>
        {props.WeatherForUser}
    </div>
  );
};

export default UserResultsSection;
