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

  // google analytics
  googleAnalayticsTrackingId: process.env.GA_TRACKING_ID,

  // google maps
  googleMapsAPIKey: process.env.GOOGLE_MAPS_KEY,

  // mail chimp
  mailchimpApiKey: process.env.MAILCHIMP_API_KEY,
  newsletterListId: process.env.NEWSLETTER_LIST_ID,

  sessionSecretKey: process.env.SESSION_SECRET_KEY || 'my_secret_key',

  // DC Resources API
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT || 4000,
  apiVersion: process.env.APIVERSION || 'v1',

  appMeta: {
    defaultTitle: 'DC Resources',
    titleTemplate: '%s | DC Resources',
    meta: [
      { name: 'keywords', content: 'Personalized Resources, Community, Resources, DC' },
      { name: 'description', contnet:  'Find personalized resources in DC' },

      // Facebook
      { name: 'og:site_name', content: 'DC Resources' },
      { name: 'og:image', content: 'http://theprincetontory.com/main/wp-content/uploads/2014/09/washington-dc.jpg' },
      { name: 'og:locale', content: 'en_US' },
      { name: 'og:title', content:  'DC Resources' },
      { name: 'og:description', content: 'Resources available in Washington DC' }
    ]
  }
}, environment);
