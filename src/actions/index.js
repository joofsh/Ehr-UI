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

export function fetchQuestionsAction(length = 1000, order = null) {
  return {
    type: 'CALL_API',
    method: 'get',
    url: '/api/questions',
    params: { length, order },
    successType: 'RECEIVE_QUESTIONS_SUCCESS'
  };
}

export function submitAnswerAction(id, data) {
  return {
    type: 'CALL_API',
    method: 'put',
    url: `/api/wizard/${id}/responses`,
    errorType: 'RECEIVE_ANSWER_SUBMIT_ERROR',
    data
  };
}
