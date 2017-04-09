import { initialState as sessionInitialState } from 'src/reducers/session';
import config from '../../config';

export default {
  filterSessionForClient: (session) => {
    let _sessionInitialState = sessionInitialState();

    if (session && session.user) {
      let {
        token,
        ...user
      } = session.user;

      _sessionInitialState.user = user;
    }

    return _sessionInitialState;
  },
  initialProps: () => {
    return {
      googleAnalayticsTrackingId: config.googleAnalayticsTrackingId
    };
  }
};
