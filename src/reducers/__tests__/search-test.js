import reducer, { initialState, collectionFilter } from '../search';
import expect from 'expect';

let mockData = [
  { id: 1, title: 'SOME', tags: [{ name: 'hiv' }, { name: 'housing' }],
    address: { street: '1234 Main street' } },
  { id: 2, title: 'Therapy Center', tags: [{ name: 'lgbt' }, { name: 'housing' }],
    address: { street: '999 First st' } },
  { id: 3, title: 'STI testing center', tags: [{ name: 'lgbt' }, { name: 'housing' }],
    address: null }
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
    let result = collectionFilter(mockData, '', ['title']);
    expect(result.length).toBe(3);
  });

  it('matches search value', () => {
    let result = collectionFilter(mockData, 'SOM', ['title']);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(1);
  });

  it('matches case insensitive', () => {
    let result = collectionFilter(mockData, 'sti', ['title']);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(3);
  });

  it('ignores fields that are not searched on', () => {
    let result = collectionFilter(mockData, 'SOM', ['id']);
    expect(result.length).toBe(0);
  });

  it('matches on space separated search values', () => {
    let result = collectionFilter(mockData, 'Therapy center', ['title']);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(2);
  });

  it('matches against nested array fields', () => {
    let result = collectionFilter(mockData, 'hiv', ['tags.name']);
    expect(result.length).toBe(1);

    result = collectionFilter(mockData, 'lgbt', ['tags.name']);
    expect(result.length).toBe(2);

    result = collectionFilter(mockData, 'housing', ['tags.name']);
    expect(result.length).toBe(3);
  });

  it('matches against nested object fields', () => {
    let result = collectionFilter(mockData, '1234', ['address.street']);
    expect(result.length).toBe(1);

    result = collectionFilter(mockData, 'Foo', ['address.street']);
    expect(result.length).toBe(0);

    result = collectionFilter(mockData, 'st', ['address.street']);
    expect(result.length).toBe(2);
  });

  it('matches against subObject and main object', () => {
    let result = collectionFilter(mockData, 'lgbt', ['id', 'tags.name']);
    expect(result.length).toBe(2);
    expect(result[0].id).toEqual(2);
    expect(result[1].id).toEqual(3);
  });
});
