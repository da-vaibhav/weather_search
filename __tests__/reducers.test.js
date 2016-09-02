import Reducer from '../app/reducers';

describe('reducers test', function() {
  const INITIAL_STATE = {
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

  //
  it('returns initial state when provided with none', function(){
    expect(Reducer(INITIAL_STATE, {type: null})).toEqual(INITIAL_STATE);
  });

  it('matches given IsLoading state to the one returned', () => {
    expect(Reducer(INITIAL_STATE, {type: 'IS_LOADING', IsLoading: false}).IsLoading)
      .toEqual(false);
  });

  it('sets QueryDataFetched value to the one provided', () => {
    expect(Reducer(INITIAL_STATE, {type: 'SET_CITIES_DATA'}).QueryDataFetched).toEqual(true);
  });

  it('matches search query value to the one provided', () => {
    expect(Reducer(INITIAL_STATE, {type: 'SEARCH_QUERY_CHANGE', SearchQuery: 'New York'}).SearchQuery).toEqual('New York');
  });

  it('sets location available to true after SET_USER_LOCATION action', () => {
      let action_obj = {
        type: 'SET_USER_LOCATION',
        payload: {lat: 1, lon: 2, data: [] }
      };

    expect(Reducer(INITIAL_STATE, action_obj).location.available).toEqual(true);
  });

});
