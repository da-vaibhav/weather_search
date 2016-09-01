export function SetUserLocation (location) {
  return {
    type: 'SET_USER_LOCATION',
    payload: {
      lat: location.lat,
      lon: location.lon,
      data: location.data
    }
  };
}

export function SearchQueryChange (location) {
  return {
    type: 'SEARCH_QUERY_CHANGE',
    SearchQuery: location
  };
}

export function SetCitiesData (data) {
  return {
    type: 'SET_CITIES_DATA',
    CitiesData: data.CitiesData
  };
}

export function IsLoading (loading) {
  return {
    type: 'IS_LOADING',
    IsLoading: loading
  };
}
