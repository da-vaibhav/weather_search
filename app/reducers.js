let InitialState = {
  SearchQuery: '',
  IsLoading: false,
  QueryDataFetched: false,
  location: {
    available: false,
    latitude: '',
    longitude: '',
    UserGeoData: []
  },
  CitiesData: []
};

export default function reducer (state = InitialState, action) {
  switch (action.type) {

    case 'SET_USER_LOCATION':
      let LocationObj = { location: { available: true,
                                       latitude: action.payload.lat,
                                       longitude: action.payload.lon,
                                       UserGeoData: action.payload.data
                                     }
                        };

      return Object.assign({}, state, LocationObj);

    case 'SEARCH_QUERY_CHANGE':
      return Object.assign({}, state, { SearchQuery: action.SearchQuery });

    case 'SET_CITIES_DATA':
      return Object.assign({}, state, {QueryDataFetched: true, CitiesData: action.CitiesData});

    case 'IS_LOADING':
      return Object.assign({}, state, {IsLoading: action.IsLoading});

    default:
      return state;
  }
}
