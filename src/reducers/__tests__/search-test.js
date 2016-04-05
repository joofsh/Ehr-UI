import reducer, { initialState, collectionFilter } from '../search';
import expect from 'expect';

let mockData = [
  { id: 1, first_name: 'John' },
  { id: 2, first_name: 'Jim' },
  { id: 3, first_name: 'Bob' }
];

let state;

describe('Search Reducer', () => {
  beforeEach(() => {
    state = reducer(initialState);
  });

  it('UPDATE_SEARCH_VALUE', () => {
    expect(state.resourceFilter).toEqual('');
    state = reducer(state, {
      type: 'UPDATE_SEARCH_VALUE',
      payload: {
        name: 'resourceFilter',
        value: 'Joh'
      }
    });
    expect(state.resourceFilter).toBe('Joh');
  });
});


describe('Collection Filter', () => {
  it('returns all if no search passed', () => {
    let result = collectionFilter(mockData, '', ['first_name']);
    expect(result.length).toBe(3);
  });

  it('matches search value', () => {
    let result = collectionFilter(mockData, 'Joh', ['first_name']);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(1);
  });

  it('matches case insensitive', () => {
    let result = collectionFilter(mockData, 'JI', ['first_name']);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(2);
  });

  it('ignores fields that are not searched on', () => {
    let result = collectionFilter(mockData, 'JI', ['id']);
    expect(result.length).toBe(0);
  });

  it('matches on space separated search values', () => {
    let result = collectionFilter(mockData, 'John Smith', ['first_name']);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(1);
  });
});
