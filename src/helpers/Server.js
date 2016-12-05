import { initialState as sessionInitialState, buildUser } from 'src/reducers/session';
import config from '../../config';

export default {
  filterSessionForClient: (session, asUserModel = true) => {

    if (session && session.user) {
      let {
        token,
        ...user
      } = session.user;

      // If we are doing server side rendering, we want to
      // wrap the plain user JSON object in a user model.
      // If we are returning the user via an ajax call we want
      // to return pure JSON
      let _user = asUserModel ? buildUser(user) : user;

      sessionInitialState.user = _user;
    }

    return sessionInitialState;
  },
  initialProps: () => {
    return {
      googleAnalayticsTrackingId: config.googleAnalayticsTrackingId
    };
  }
};
