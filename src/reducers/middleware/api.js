import RSVP from 'rsvp';
import { push } from 'react-router-redux';
import _castArray from 'lodash/castArray';

function handleForbiddenRequest(dispatch) {
  dispatch({ type: 'INVALIDATE_CURRENT_USER' });
  dispatch(push('/login'));
}

export default function apiMiddleware(client) {
  return store => next => action => {
    if (action.type !== 'CALL_API') {
      return next(action);
    }

    const {
      method,
      url,
      successType,
      errorType,
      params,
      data,
      redirectOnForbidden = true
    } = action;
    let deferred = RSVP.defer();

    client[method](url, { params, data }).then(response => {
      if (successType) {
        if (typeof successType === 'function') {
          next(successType);
        } else {
          let _successType = _castArray(successType);

          _successType.forEach(type => {
            next({
              type,
              payload: response
            });
          });
        }
      }
      deferred.resolve(response);
    }, response => {
      if (response.status === 403 && redirectOnForbidden) {
        handleForbiddenRequest(store.dispatch);
      }

      if (errorType) {
        if (typeof errorType === 'function') {
          next(errorType);
        } else {
          next({
            type: errorType,
            payload: response
          });
        }
      }

      deferred.reject(response);
    });

    return deferred.promise;
  };
}
