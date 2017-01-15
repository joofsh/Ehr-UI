import {
  resources,
  questions,
  tags
} from 'src/__tests__/mocks/mockData';

export default [
  {
    pattern: '(.*)/authorize',
    fixtures: () => {},
    post: (match, data) => {
      return {
        body: { id: 5, username: 'foo', role: 'admin' },
        code: 200
      };
    }
  },
  {
    pattern: '(.*)/questions$',
    fixtures: () => questions,
    get: (match, data) => {
      return {
        body: { questions: data }
      };
    },
    post: () => {
      return {
        code: 201
      };
    }
  },
  {
    pattern: '(.*)/tags$',
    fixtures: () => tags,
    get: (match, data) => {
      return {
        body: { tags: data }
      };
    },
    post: () => {
      return {
        code: 201
      };
    }
  },
  {
    pattern: '(.*)/resources$',
    fixtures: () => resources,
    get: (match, data) => {
      return {
        body: { resources: data }
      };
    },
    post: () => {
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
    post: () => {
      return {
        code: 201
      };
    }
  }
];
