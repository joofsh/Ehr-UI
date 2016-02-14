import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { LoadingSpinner, DataTable } from 'src/components';

function fetchResources() {
  return {
    type: 'CALL_API',
    method: 'get',
    url: '/api/resources',
    successType: 'RECEIVE_RESOURCES_SUCCESS'
  };
}

const COLUMNS = [
  { key: 'id', title: 'ID' },
  { key: 'title', type: 'internalLink', linkBase: '/resources/' },
  { key: 'url', title: 'URL', type: 'externalLink' }
];

export class Resources extends Component {
  static fetchData({ store }) {
    return store.dispatch(fetchResources());
  }

  static propTypes = {
    fetchResources: PropTypes.func.isRequired,
    resources: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    children: PropTypes.node
  };

  componentDidMount() {
    this.props.fetchResources();
  }

  render() {
    let { resources, children } = this.props;
    require('./Resources.scss');

    if (this.props.isFetching) {
      return <LoadingSpinner large absolute center/>;
    }

    return (<div className="container container-resources">
      <div className="row">
        <div className="col-xs-12">
          <DataTable
            columns={COLUMNS}
            data={resources}
          />
        </div>
        {children}
      </div>
    </div>);
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchResources: () => {
      dispatch((dispatch, getState) => {
        if (getState().resource.lastUpdated) {
          return;
        }
        dispatch({ type: 'REQUEST_RESOURCES' });
        dispatch(fetchResources());
      });
    }
  };
}

function mapStateToProps(state) {
  return {
    resources: state.resource.resources,
    isFetching: state.resource.isFetching
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Resources);
