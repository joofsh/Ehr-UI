import reducer, { initialState, collectionFilter } from '../search';
import expect from 'expect';

let mockData = [
  { id: 1, first_name: 'John', tags: [{ name: 'hiv' }, { name: 'housing' }] },
  { id: 2, first_name: 'Jim', tags: [{ name: 'lgbt' }, { name: 'housing' }] },
  { id: 3, first_name: 'Bob', tags: [{ name: 'lgbt' }, { name: 'housing' }] }
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

  it('matches against subObject fields', () => {
    let result = collectionFilter(mockData, 'hiv', ['tags.name']);
    expect(result.length).toBe(1);

    result = collectionFilter(mockData, 'lgbt', ['tags.name']);
    expect(result.length).toBe(2);

    result = collectionFilter(mockData, 'housing', ['tags.name']);
    expect(result.length).toBe(3);
  });

  it('matches against subobject and main object', () => {
    let result = collectionFilter(mockData, 'hiv 3', ['id', 'tags.name']);
    expect(result.length).toBe(2);
    expect(result[0].id).toEqual(1);
    expect(result[1].id).toEqual(3);
  });
});
