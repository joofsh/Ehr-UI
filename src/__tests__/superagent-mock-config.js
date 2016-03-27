import {
  resources
} from 'src/__tests__/mocks/mockData';

export default [
  {
    pattern: '(.*)/resources$',
    fixtures: () => resources,
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
