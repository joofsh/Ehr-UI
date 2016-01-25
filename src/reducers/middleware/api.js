import apiUtil from 'utils/api';
import RSVP from 'rsvp';

export default store => next => action => {
  if (action.type !== 'CALL_API') {
    return next(action);
  }
  let { getState } = store;
  let { method, url, successType, errorType } = action;
  let deferred = RSVP.defer();

  apiUtil[method](url).then(response => {
    next({
      type: successType,
      response
    });
    deferred.resolve();
  }).catch(response => {
    if (typeof errorType === 'function') {
      next(errorType);
    } else {
    next({
      type: errorType,
      response
    });
    }
    deferred.resolve();
  });

  return deferred.promise;
};
