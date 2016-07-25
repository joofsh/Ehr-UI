// TODO: Split actions out to separate file

export function fetchTagsAction(withDetails = false) {
  let params = {
    length: 10000
  };

  if (withDetails) {
    params.details = true;
  }

  return {
    type: 'CALL_API',
    url: '/api/tags',
    method: 'get',
    params,
    successType: 'RECEIVE_TAGS_SUCCESS'
  };
}

export function fetchQuestionsAction() {
  return {
    type: 'CALL_API',
    method: 'get',
    url: '/api/questions',
    params: { length: 10000 },
    successType: 'RECEIVE_QUESTIONS_SUCCESS'
  };
}
