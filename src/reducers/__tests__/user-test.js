import reducer, { initialState } from '../user';
import expect from 'expect';

let mockUsers = [
  { id: 1, first_name: 'John' },
  { id: 2, first_name: 'Jim' },
  { id: 3, first_name: 'Bob' }
];

let state;

describe('User Reducer', () => {
  beforeEach(() => {
    state = reducer(initialState);
  });

  it('REQUEST_USERS', () => {
    state = reducer(state, { type: 'REQUEST_USERS' });
    expect(state.isFetching).toBe(true);
  });

  it('RECEIVE_USERS', () => {
    expect(initialState.users.length).toBe(0);
    state = reducer(state, { type: 'RECEIVE_USERS', payload: { users: mockUsers } });
    expect(state.users.length).toBe(3);
    expect(state.users[0].id).toBe(1);
  });

  it('TOGGLE_EDIT_USERS', () => {
    expect(initialState.isEditing).toBe(false);
    state = reducer(state, { type: 'TOGGLE_EDIT_USER' });
    expect(state.isEditing).toBe(true);
  });

  it('RECIVE_UPDATE_USER', () => {
    let newName = 'Wendy';
    state = reducer(state, {
      type: 'RECEIVE_USERS', payload: { users: mockUsers }
    });
    expect(state.users[0].first_name).toNotBe(newName);

    state = reducer(state,
                        { type: 'RECEIVE_UPDATE_USER',
                          payload: { id: 1, first_name: newName } });

    expect(state.users[0].first_name).toBe(newName);
    expect(state.isEditing).toBe(false);
  });

  it('RECEIVE_ADD_USER', () => {
    let newUser = { id: 4, first_name: 'Billy' };
    state = reducer(state, {
      type: 'RECEIVE_USERS', payload: { users: mockUsers }
    });
    expect(state.users.length).toBe(3);
    state = reducer(state, { type: 'RECEIVE_ADD_USER', user: newUser });
    expect(state.users.length).toBe(4);
  });
});
