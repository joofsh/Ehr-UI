import expect from 'expect';
import reducer, { initialState } from '../resource';

let mockResources = [
  { id: 1, title: 'Dummy Resource' },
  { id: 2, title: 'Dummy Resource' },
  { id: 3, title: 'Dummy Resource' }
];

let state;

describe('Resource Reducer', () => {
  afterEach(() => {
    state = null;
  });

  it('REQUEST_RESOURCES', () => {
    state = reducer(initialState, { type: 'REQUEST_RESOURCES' });
    expect(state.isFetching).toBe(true);
  });

  it('RECEIVE_RESOURCES_SUCCESS', () => {
    state = initialState;
    expect(state.resources.length).toBe(0);
    state = reducer(state,
                    { type: 'RECEIVE_RESOURCES_SUCCESS',
                      response: { resources: mockResources } });

    expect(state.resources.length).toBe(3);
  });

  describe('RECEIVE_RESOURCE_SUCCESS', () => {
    beforeEach(() => {
      state = reducer(state,
                      { type: 'RECEIVE_RESOURCES_SUCCESS',
                        response: { resources: mockResources } });
    });
    it('adds new resource', () => {
      expect(state.resources.length).toBe(3);
      state = reducer(state,
                      { type: 'RECEIVE_RESOURCE_SUCCESS',
                        response: { id: 4, title: 'New Resource' } });
      expect(state.resources.length).toBe(4);
      expect(state.resources[3].id).toBe(4);
    });

    it('replaces existing resource', () => {
      expect(state.resources.length).toBe(3);
      state = reducer(state,
                      { type: 'RECEIVE_RESOURCE_SUCCESS',
                        // Existing resource id 3
                        response: { id: 3, title: 'New Resource' } });

      expect(state.resources.length).toBe(3);
    });
  });

  it('TOGGLE_EDIT_RESOURCE', () => {
    state = initialState;
    expect(state.isEditing).toBe(false);

    state = reducer(state, { type: 'TOGGLE_EDIT_RESOURCE' });
    expect(state.isEditing).toBe(true);

    state = reducer(state, { type: 'TOGGLE_EDIT_RESOURCE' });
    expect(state.isEditing).toBe(false);
  });

  describe('RECEIVE_UPDATE_RESOURCE_SUCCESS', () => {
    beforeEach(() => {
      state = reducer(state,
                      { type: 'RECEIVE_RESOURCES_SUCCESS',
                        response: { resources: mockResources } });
      state = reducer(state,
                      { type: 'TOGGLE_EDIT_RESOURCE' });
    });

    it('successfully updates existing resource', () => {
      let newResource = { id: 3, title: 'fun resource' };
      expect(state.resources[2].title).toNotBe(newResource.title);
      expect(state.isEditing).toBe(true);
      state = reducer(state,
                      { type: 'RECEIVE_UPDATE_RESOURCE_SUCCESS',
                        response: newResource });

      expect(state.resources[2].title).toBe(newResource.title);
      expect(state.isEditing).toBe(false);
    });

    it('does nothing if no matching resource id', () => {
      let newResource = { id: 5, title: 'fun resource' };
      expect(state.resources.length).toBe(3);
      state = reducer(state,
                      { type: 'RECEIVE_UPDATE_RESOURCE_SUCCESS',
                        response: newResource });
      expect(state.resources.length).toBe(3);
    });
  });

  describe('ADD_CLIENT_RESOURCES', () => {
    beforeEach(() => {
      state = reducer(state,
                      { type: 'RECEIVE_RESOURCES_SUCCESS',
                        response: { resources: mockResources } });
    });

    it('adds new resources, replaces existing', () => {
      let newResources = [
        { id: 3, title: 'new title' },
        { id: 4, title: 'new resource' }
      ];

      expect(state.resources.length).toBe(3);
      expect(state.resources[2].title).toNotBe(newResources[0].title);
      state = reducer(state,
                      { type: 'ADD_CLIENT_RESOURCES',
                        response: { resources: newResources } });
      expect(state.resources.length).toBe(4);
      expect(state.resources[2].title).toBe(newResources[0].title);
      expect(state.resources[3].title).toBe(newResources[1].title);
    });
  });

});
