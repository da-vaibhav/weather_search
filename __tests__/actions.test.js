import { search_query_change } from '../app/actions.js';

describe('search query change', function() {

  it('shows input query', function() {
    const location = 'Pune, Mumbai, Nagpur';
    expect(search_query_change(location).search_query)
      .toEqual(location);
  });
});
