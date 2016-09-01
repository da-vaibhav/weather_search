import * as Actions from '../app/actions.js';

describe('search query change', function() {

  const location = 'New York';

  it('shows input query', function() {

    expect(Actions.search_query_change(location).search_query)
      .toEqual(location);

  });

  it('description', function() {
    const type = 'SEARCH_QUERY_CHANGE';
    expect(Actions.search_query_change(location).type)
      .toEqual(type);
  });

});
