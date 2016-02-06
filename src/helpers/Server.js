export default {
  filterSessionForClient: (session) => {
    let _session = Object.assign({}, session);

    if (session.user) {
      //delete _session.user.token;
    }

    return _session;
  }
};
