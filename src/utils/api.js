import fetch from 'isomorphic-fetch';
import { Promise } from 'es6-promise';

export default {
  get: (path) => {
    return fetch(path)
      .then(resp => {
        return resp.json();
      });
  },
  post: (path, body) => {
    return fetch(path, {
      method: 'post',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(resp => {
        return resp.json();
      });
  }
}
