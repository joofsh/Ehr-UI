import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { LoadingSpinner, ResourceRow, ResourceMap, MaxHeightContainer } from 'src/components';

function fetchResources() {
  return {
    type: 'CALL_API',
    method: 'get',
    url: '/api/resources',
    successType: 'RECEIVE_RESOURCES_SUCCESS'
  };
}

export class Resources extends Component {
  static fetchData({ store }) {
    return store.dispatch(fetchResources());
  }

  static propTypes = {
    fetchResources: PropTypes.func.isRequired,
    resources: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    params: PropTypes.object,
    children: PropTypes.node
  };

  componentDidMount() {
    this.props.fetchResources();
  }

  render() {
    let {
      resources,
      children,
      params: {
        id: activeResourceId
      }
    } = this.props;
    let resourceContent, mapResources;

    if (this.props.isFetching) {
      resourceContent = <LoadingSpinner large absolute center/>;
    } else {
      resourceContent = (<div className="list-group resource-list">
        {resources.map((resource, i) => (
          <ResourceRow key={i} {...resource} />
        ))}
      </div>);
    }

    require('./Resources.scss');
    return (<div className="container-fluid container-resources">
      <div className="row">
        <MaxHeightContainer className="col-md-6 col-xs-12 pull-right">
          { children ? children : resourceContent }
        </MaxHeightContainer>
        <MaxHeightContainer className="col-md-6 col-xs-12 resource-map-wrapper">
          <ResourceMap resources={resources} activeResourceId={+activeResourceId}/>
        </MaxHeightContainer>
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
