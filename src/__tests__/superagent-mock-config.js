import {
  resources
} from 'src/__tests__/mocks/mockData';

export default [
  {
    pattern: '(.*)/resources$',
    fixtures: () => resources,
    get: (match, data) => {
      return {
        body: { resources: data }
      };
    },
    post: (match, data) => {
      return {
        code: 201
      };
    }
  },
  {
    pattern: '(.*)/resources/(.*)$',
    fixtures: () => resources[0],
    get: (match, data) => {
      return {
        body: data
      };
    },
    post: (match, data) => {
      return {
        code: 201
      };
    }
  }
];
