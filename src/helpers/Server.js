export default {
  filterSessionForClient: (session) => {
    let _session = Object.assign({}, session);

    if (session.user) {
      // TODO: reimplement this
      // delete _session.user.token;
    }

    return _session;
  }
};
