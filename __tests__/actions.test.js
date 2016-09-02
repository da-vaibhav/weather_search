import * as Actions from '../app/actions.js';

describe('search query change', function() {

  const location = 'New York';
  const location_data = {
    lat: '1.2.3.4',
    lon: '1.2.3.4',
    data: [1,2,3,4]
  };

  // action: SetUserLocation
  it('sets user’s location', function() {
    expect(Actions.SetUserLocation(location_data).type).toEqual('SET_USER_LOCATION');
  });

  it('sets user’s location', function() {
    expect(Actions.SetUserLocation(location_data).payload).toEqual(location_data);
  });


  // action: SearchQueryChange
  it('shows input query', function() {
    expect(Actions.SearchQueryChange(location).SearchQuery).toEqual(location);
  });

  it('matches type to SEARCH_QUERY_CHANGE', function() {
    const type = 'SEARCH_QUERY_CHANGE';
    expect(Actions.SearchQueryChange(location).type).toEqual(type);
  });

  // action : SetCitiesData
  const DATA = {CitiesData: 1};
  it('matches type to SEARCH_QUERY_CHANGE', function() {
    expect(Actions.SetCitiesData(DATA).type).toEqual('SET_CITIES_DATA');
  });

  it('Sets Cities Data', function() {
    const type = 'SEARCH_QUERY_CHANGE';
    expect(Actions.SetCitiesData(DATA).CitiesData).toEqual(DATA.CitiesData);
  });

  //action: IsLoading
  it('matches loading type to IS_LOADING', function() {
    expect(Actions.IsLoading(false).type).toEqual('IS_LOADING');
  });

  it('returns correct loading status', function() {
    expect(Actions.IsLoading(true).IsLoading).toEqual(true);
  });

});
