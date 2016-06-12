import { initialState as sessionInitialState } from 'src/reducers/session';

export default {
  filterSessionForClient: (session) => {

    if (session && session.user) {
      let {
        token,
        ...user
      } = session.user;

      sessionInitialState.user = user;
    }

    return sessionInitialState;
  }
};
