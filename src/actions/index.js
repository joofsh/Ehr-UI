// TODO: Split actions out to separate file

export function fetchTagsAction() {
  return {
    type: 'CALL_API',
    url: '/api/tags',
    method: 'get',
    params: {
      length: 10000
    },
    successType: 'RECEIVE_TAGS_SUCCESS'
  };
};
