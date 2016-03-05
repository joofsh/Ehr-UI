const initialState = {
  tags: [],
  lastUpdated: null,
  searchValue: '',
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'RECEIVE_TAGS_SUCCESS':
      return {
        ...state,
        tags: action.response.tags,
        lastUpdated: Date.now()
      };
    case 'SET_TAG_SEARCH_VALUE':
      return {
        ...state,
        searchValue: action.value
      };
    default:
      return state;
  }
}
