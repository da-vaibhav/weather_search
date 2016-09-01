let initial_state = {
  search_query: '',
  isLoading: false,
  query_data_fetched: false,
  location: {
    available: false,
    latitude: '',
    longitude: '',
    user_geo_data: []
  },
  cities_data: []
};

export default function reducer(state = initial_state, action) {
  switch (action.type) {

    case 'SET_USER_LOCATION':
      let location_obj = {location: { available: true,
                                      latitude: action.payload.lat,
                                      longitude: action.payload.lon,
                                      user_geo_data: action.payload.data
                                    }
                          };

      return Object.assign({}, state, location_obj);

    case 'SEARCH_QUERY_CHANGE':
      return Object.assign({}, state, { search_query: action.search_query });

    case 'SET_CITIES_DATA':
      return Object.assign({}, state, {query_data_fetched: true, cities_data: action.cities_data});

    case 'IS_LOADING':
      return Object.assign({}, state, {isLoading: action.isLoading});

    default:
      return state;
  }
}
