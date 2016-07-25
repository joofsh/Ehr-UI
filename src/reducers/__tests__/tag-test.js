import reducer, { initialState } from '../tag';
import expect from 'expect';
import _filter from 'lodash/filter';

let mockTags = [
  { id: 1, name: 'what', weight: 50, type: 'Descriptor' },
  { id: 2, name: 'are', weight: 60, type: 'Descriptor' },
  { id: 3, name: 'you', weight: 70, type: 'Service' }
];

let state;

describe('Tag Reducer', () => {
  beforeEach(() => {
    state = reducer(initialState);
  });

  it('REQUEST_TAGS', () => {
    state = reducer(state, { type: 'REQUEST_TAGS' });
    expect(state.isFetching).toBe(true);
  });

  describe('RECEIVE_TAGS_SUCCESS', () => {
    it('adds initial tags', () => {
      expect(state.tags.length).toBe(0);
      state = reducer(state, {
        type: 'RECEIVE_TAGS_SUCCESS', payload: { tags: mockTags }
      });

      expect(state.tags.length).toBe(mockTags.length);
      expect(state.tags[0].id).toBe(mockTags[0].id);
    });

    it('adds more tags', () => {
      state = reducer(state, {
        type: 'RECEIVE_TAGS_SUCCESS', payload: { tags: mockTags }
      });
      expect(state.tags.length).toBe(3);

      let newTags = [{ id: 4, stem: 'new' }, { id: 5, stem: 'newest' }];
      state = reducer(state, {
        type: 'RECEIVE_TAGS_SUCCESS', payload: { tags: newTags }
      });

      expect(state.tags.length).toBe(mockTags.length + newTags.length);
      expect(state.tags[3].id).toBe(newTags[0].id);
    });
  });

  describe('ADD_EMPTY_TAG', () => {
    it('adds a stub tag', () => {
      expect(state.tags.length).toBe(0);
      state = reducer(state, { type: 'ADD_EMPTY_TAG' });
      expect(state.tags.length).toBe(1);
      expect(state.tags[0].name).toBe(null);
      expect(state.tags[0].weight).toBe(null);
      expect(state.tags[0].isEditing).toBe(true);
    });

    it('only adds one stub max', () => {
      expect(state.tags.length).toBe(0);
      state = reducer(state, { type: 'ADD_EMPTY_TAG' });
      state = reducer(state, { type: 'ADD_EMPTY_TAG' });
      state = reducer(state, { type: 'ADD_EMPTY_TAG' });

      expect(state.tags.length).toBe(1);
    });
  });


  describe('Update existing tags', () => {
    beforeEach(() => {
      state = reducer(state, {
        type: 'RECEIVE_TAGS_SUCCESS', payload: { tags: mockTags }
      });
    });

    it('TOGGLE_EDIT_TAG', () => {
      expect(state.tags[0].isEditing).toBe(false);
      state = reducer(state, {
        type: 'TOGGLE_EDIT_TAG', payload: { tagIndex: 0 } });

      expect(state.tags[0].isEditing).toBe(true);
      expect(state.tags[1].isEditing).toBe(false);
      expect(state.tags[2].isEditing).toBe(false);

      state = reducer(state, {
        type: 'TOGGLE_EDIT_TAG', payload: { tagIndex: 1 } });

      // Ensure previous tag's isEditing is set to false
      expect(state.tags[0].isEditing).toBe(false);
      expect(state.tags[1].isEditing).toBe(true);
      expect(state.tags[2].isEditing).toBe(false);

      state = reducer(state, {
        type: 'TOGGLE_EDIT_TAG', payload: { tagIndex: 1 } });

      // Ensure previous tag's isEditing is set to false
      expect(state.tags[0].isEditing).toBe(false);
      expect(state.tags[1].isEditing).toBe(false);
      expect(state.tags[2].isEditing).toBe(false);
    });

    describe('RECEIVE_NEW_TAG_SUCCESS', () => {
      it('adds a new tag directly', () => {
        let tag = { id: 4, stem: 'Whats up?' };
        expect(state.tags.length).toBe(3);
        state = reducer(state, {
          type: 'RECEIVE_NEW_TAG_SUCCESS', payload: { tag }
        });
        expect(state.tags.length).toBe(4);
      });

      it('saves new tag to stub tag', () => {
        let tag = { id: 4, stem: 'Whats up?' };
        state = reducer(state, { type: 'ADD_EMPTY_TAG' });

        expect(state.tags.length).toBe(4);
        expect(state.tags[3].id).toBe(undefined);
        state = reducer(state, {
          type: 'RECEIVE_NEW_TAG_SUCCESS', payload: { tag }
        });
        expect(state.tags.length).toBe(4);
        expect(state.tags[3].id).toBe(tag.id);
      });
    });

    describe('RECEIVE_TAG_SUCCESS', () => {
      it('adds a new new tag', () => {
        let tag = { id: 4, stem: 'Whats up?' };
        expect(state.tags.length).toBe(3);

        state = reducer(state, {
          type: 'RECEIVE_TAG_SUCCESS', payload: { tag }
        });
        expect(state.tags.length).toBe(4);
        expect(state.tags[3].id).toBe(tag.id);
      });

      it('replaces existing tag', () => {
        let tag = { id: 1, stem: 'Whats up?' };
        expect(state.tags.length).toBe(3);
        expect(state.tags[0].id).toBe(tag.id);
        expect(state.tags[0].stem).toNotBe(tag.stem);

        state = reducer(state, {
          type: 'RECEIVE_TAG_SUCCESS', payload: { tag }
        });
        expect(state.tags.length).toBe(3);
        expect(state.tags[0].stem).toBe(tag.stem);
      });
    });

    describe('RECEIVE_DELETE_TAG_SUCCESS', () => {
      it('deletes a database tag', () => {
        let tagId = state.tags[0].id;
        expect(state.tags.length).toBe(3);

        state = reducer(state, {
          type: 'RECEIVE_DELETE_TAG_SUCCESS', payload: { tagId }
        });
        expect(state.tags.length).toBe(2);
        expect(state.tags[0].id).toNotBe(tagId);
      });

      it('deletes unsaved tag', () => {
        let tagIndex = 3;
        let savedTagsBefore = _filter(state.tags, q => !!q.id);

        state = reducer(state, { type: 'ADD_EMPTY_TAG' });
        expect(state.tags.length).toBe(4);
        expect(state.tags[tagIndex].id).toBe(undefined);

        state = reducer(state, {
          type: 'RECEIVE_DELETE_TAG_SUCCESS', payload: { tagIndex }
        });
        expect(state.tags.length).toBe(3);
        let savedTagsAfter = _filter(state.tags, q => !!q.id);
        expect(savedTagsBefore).toEqual(savedTagsAfter);
      });
    });
  });
});
