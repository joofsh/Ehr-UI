require('babel-polyfill');

const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3001,
  sessionSecretKey: process.env.SESSION_SECRET_KEY || 'my_secret_key',
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT || 4000,
  apiVersion: process.env.APIVERSION || 'v1',
  app: {
    title: 'DC Social Worker Services',
    description: 'Information Aggregate for available services in DC',
    meta: {
      charSet: 'utf-8',
      property: {
        'og:site_name': 'DC Social Worker Services',
        'og:image': 'http://theprincetontory.com/main/wp-content/uploads/2014/09/washington-dc.jpg',
        'og:locale': 'en_US',
        'og:title': 'DC Social Worker Services',
        'og:description': 'Services available in Washington DC',
      }
    }
  }
}, environment);
