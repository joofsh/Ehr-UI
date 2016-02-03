import superagent from 'superagent';
import { Promise } from 'es6-promise';
import config from '../../config';

const methods = ['get', 'post', 'put', 'patch', 'del'];

function formatUrl(path) {
  let url = '';

  if (__SERVER__) {
    url = `http://${config.host}`
    if (config.port) {
      url += `:${config.port}`;
    }
  }

  return `${url}${path}`
}

export default class ApiClient {
  constructor(req) {
    methods.forEach(method => {
      this[method] = (path, { params, data } = {}) => new Promise((resolve, reject) => {
        const request = superagent[method](formatUrl(path));

        if (params) {
          request.query(params);
        }

        if (__SERVER__ && req.get('cookie')) {
          request.set('cookie', req.get('cookie'));
        }

        if (data) {
          request.send(data);
        }

        const source = __SERVER__ ? 'server' : 'client';

        console.info(`Sending request {${source}}: ${path}`);
        request.end((err, resp) => {
          console.info(`Response received {${source}}: ${resp.status}`);
          if (resp.status >= 400 || err) {
            reject(resp)
          } else {
            resolve(resp.body)
          }
        });
      });
    });
  }
}
