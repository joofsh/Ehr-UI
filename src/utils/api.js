import fetch from 'isomorphic-fetch';
import { Promise } from 'es6-promise';
import config from '../../config';

export default {
  options: (options) => {
    return Object.assign({
      credentials: 'same-origin'
    }, options);
  },
  url: (path) => {
    let url = `http://${config.host}`;
    if (config.port) {
      url += `:${config.port}`;
    }
    url =`${url}${path}`;
    return url;
  },
  get: function(path) {
    return fetch(this.url(path), this.options())
      .then(resp => {
        return resp.json();
      });
  },
  post: function(path, body) {
    return fetch(this.url(path), this.options({
      method: 'post',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    })).then(resp => {
      if (resp.status >= 400) {
        let error = new Error(resp.statusText);
        error.response = resp;
        console.error(error);
        throw error;
      } else {
        return resp.json();
      }
    });
  }
}
