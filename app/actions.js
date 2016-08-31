export function set_user_location(location){
  return {
    type: 'SET_USER_LOCATION',
    payload: {
      lat: location.lat,
      lon: location.lon,
      data: location.data
    }
  }
}

export function search_query_change(location){
  return {
    type: 'SEARCH_QUERY_CHANGE',
    search_query: location
  }
}
