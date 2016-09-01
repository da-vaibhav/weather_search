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

export function set_cities_data(data){
  return {
    type: 'SET_CITIES_DATA',
    cities_data: data.cities_data
  }
}

export function is_loading(loading) {
  return {
    type: 'IS_LOADING',
    isLoading: loading
  }
}
