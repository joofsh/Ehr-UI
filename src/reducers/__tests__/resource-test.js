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

  describe('RECEIVE_RESOURCES_SUCCESS', () => {
    it('adds all the new resources', () => {
      state = initialState;
      expect(state.resources.length).toBe(0);
      state = reducer(state,
                      { type: 'RECEIVE_RESOURCES_SUCCESS',
                        payload: { resources: mockResources } });

      expect(state.resources.length).toBe(3);
      expect(state.resources[0].isMapInfoVisible).toBeA('boolean');
    });

    it('adds new resources to existing ones', () => {
      let originalResource = { id: 10, title: 'Original Resource' };
      state = reducer(initialState,
                      { type: 'RECEIVE_RESOURCE_SUCCESS',
                        payload: originalResource });

      expect(state.resources.length).toBe(1);
      state = reducer(state,
                      { type: 'RECEIVE_RESOURCES_SUCCESS',
                        payload: { resources: mockResources } });

      expect(state.resources.length).toBe(4);
      expect(state.resources[0].title).toBe(originalResource.title);
      expect(state.resources[1].title).toBe(mockResources[0].title);
    });
  });

  describe('RECEIVE_RESOURCE_SUCCESS', () => {
    beforeEach(() => {
      state = reducer(initialState,
                      { type: 'RECEIVE_RESOURCES_SUCCESS',
                        payload: { resources: mockResources } });
    });
    it('adds new resource', () => {
      expect(state.resources.length).toBe(3);
      state = reducer(state,
                      { type: 'RECEIVE_RESOURCE_SUCCESS',
                        payload: { id: 4, title: 'New Resource' } });
      expect(state.resources.length).toBe(4);
      expect(state.resources[3].id).toBe(4);
      expect(state.resources[3].isMapInfoVisible).toBeA('boolean');
    });

    it('replaces existing resource', () => {
      expect(state.resources.length).toBe(3);
      state = reducer(state,
                      { type: 'RECEIVE_RESOURCE_SUCCESS',
                        // Existing resource id 3
                        payload: { id: 3, title: 'New Resource' } });

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

  it('IS_TOGGLING_PUBLISHED_STATE', () => {
    state = initialState;
    expect(state.isTogglingPublishState).toBe(false);

    state = reducer(state, { type: 'IS_TOGGLING_PUBLISHED_STATE' });
    expect(state.isTogglingPublishState).toBe(true);
  });

  describe('RECEIVE_UPDATE_RESOURCE_SUCCESS', () => {
    beforeEach(() => {
      state = reducer(initialState,
                      { type: 'RECEIVE_RESOURCES_SUCCESS',
                        payload: { resources: mockResources } });
      state = reducer(state,
                      { type: 'TOGGLE_EDIT_RESOURCE' });
    });

    it('successfully updates existing resource', () => {
      let newResource = { id: 3, title: 'fun resource' };
      expect(state.resources[2].title).toNotBe(newResource.title);
      expect(state.isEditing).toBe(true);
      state = reducer(state,
                      { type: 'RECEIVE_UPDATE_RESOURCE_SUCCESS',
                        payload: newResource });

      expect(state.resources[2].title).toBe(newResource.title);
      expect(state.resources[2].isMapInfoVisible).toBe(false);
      expect(state.isEditing).toBe(false);
    });

    it('does nothing if no matching resource id', () => {
      let newResource = { id: 5, title: 'fun resource' };
      expect(state.resources.length).toBe(3);
      state = reducer(state,
                      { type: 'RECEIVE_UPDATE_RESOURCE_SUCCESS',
                        payload: newResource });
      expect(state.resources.length).toBe(3);
    });
  });

  describe('SWITCH_MARKER_VISIBILITY', () => {
    beforeEach(() => {
      state = reducer(initialState,
                      { type: 'RECEIVE_RESOURCES_SUCCESS',
                        payload: { resources: mockResources } });
    });

    it('switches visibility of resources info map', () => {
      expect(state.resources[0].isMapInfoVisible).toBe(false);
      expect(state.resources[1].isMapInfoVisible).toBe(false);

      state = reducer(state, {
        type: 'SWITCH_MARKER_VISIBILITY',
        payload: { id: state.resources[0].id, visibility: true }
      });

      expect(state.resources[0].isMapInfoVisible).toBe(true);
      expect(state.resources[1].isMapInfoVisible).toBe(false);
    });
  });
});
