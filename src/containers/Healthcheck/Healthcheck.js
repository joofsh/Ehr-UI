import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

function fetchHealthcheckAction() {
  return {
    type: 'CALL_API',
    method: 'get',
    url: '/api/healthcheck',
    successType: 'RECEIVE_HEALTHCHECK'
  };
}

export class Healthcheck extends Component {
  static fetchData({ store }) {
    return store.dispatch(fetchHealthcheckAction());
  }

  static propTypes = {
    healthcheck: PropTypes.object.isRequired,
    fetchHealthcheck: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.fetchHealthcheck();
  }

  render() {
    return <div>{JSON.stringify(this.props.healthcheck)}</div>;
  }
}

function mapStateToProps(state) {
  return {
    healthcheck: state.session.healthcheck
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchHealthcheck: () => {
      dispatch(fetchHealthcheckAction());
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Healthcheck);
