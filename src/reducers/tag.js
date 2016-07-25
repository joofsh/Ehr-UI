import _findIndex from 'lodash/findIndex';
import _remove from 'lodash/remove';

export const initialState = {
  isFetching: false,
  lastUpdated: null,
  tags: [],
};

export function buildTag(tag = {}, overrides = {}) {
  return {
    ...tag,
    isEditing: false,
    ...overrides
  };
}

export default function reducer(state = initialState, action = {}) {
  let _tag, _tags, index;

  switch (action.type) {
    case 'REQUEST_TAGS':
      return {
        ...state,
        isFetching: true
      };
    case 'RECEIVE_DELETE_TAG_SUCCESS':
      _tags = state.tags.slice();

      _remove(_tags, (tag, i) => {
        let val;
        let { tagId, tagIndex } = action.payload;

        // remove via id
        if (tagId) {
          val = tagId === tag.id;
        } else { // remove via index
          val = tagIndex === i;
        }
        return val;
      });
      return {
        ...state,
        tags: _tags
      };
    case 'RECEIVE_NEW_TAG_SUCCESS':
      _tags = state.tags.slice();
      _tag = buildTag(action.payload.tag);

      index = _findIndex(_tags, t => t.isEditing && !t.id);

      if (index >= 0) {
        _tags[index] = _tag;
      } else {
        _tags.push(_tag);
      }

      return {
        ...state,
        isFetching: false,
        tags: _tags
      };
    case 'RECEIVE_TAG_SUCCESS':
      _tags = state.tags.slice();
      _tag = buildTag(action.payload.tag);

      index = _findIndex(_tags, t => t.id === _tag.id);

      if (index >= 0) {
        _tags[index] = _tag;
      } else {
        _tags.push(_tag);
      }

      return {
        ...state,
        isFetching: false,
        tags: _tags
      };
    case 'RECEIVE_TAGS_SUCCESS':
      _tags = state.tags.slice();

      action.payload.tags.forEach(tag => {
        index = _findIndex(_tags, t => t.id === tag.id);
        _tag = buildTag(tag);
        if (index >= 0) {
          _tags[index] = _tag;
        } else {
          _tags.push(_tag);
        }
      });

      return {
        ...state,
        isFetching: false,
        tags: _tags,
        lastUpdated: Date.now()
      };
    case 'ADD_EMPTY_TAG':
      _tags = state.tags.slice();

      // find any tags without an id
      index = _findIndex(_tags, t => !t.id);

      if (index < 0) {
        for (let i = 0; i < _tags.length; i++) {
          _tags[i].isEditing = false;
        }

        _tags.push(buildTag({
          name: null,
          weight: null,
          type: 'Descriptor',
          choices: [],
          resources: []
        }, {
          isEditing: true
        }));
      }
      return {
        ...state,
        tags: _tags
      };
    case 'TOGGLE_EDIT_TAG':
      _tags = state.tags.slice();
      index = action.payload.tagIndex;

      // set all other tags as not editing
      for (let i = 0; i < _tags.length; i++) {
        if (i === index) {
          _tags[index].isEditing = !_tags[index].isEditing;
        } else {
          _tags[i].isEditing = false;
        }
      }

      return {
        ...state,
        tags: _tags
      };
    default:
      return state;
  }
}
