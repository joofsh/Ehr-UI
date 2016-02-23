import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { LoadingSpinner } from 'src/components';

function fetchClientResourcesAction(id) {
  return {
    type: 'CALL_API',
    method: 'get',
    url: `/api/clients/${id}/resources`,
    // Right now we add the resources to both reducers
    // TODO: consider refactoring and only passes the actual resource objects
    // to the resource reducer, then pass only the resource_ids array to the
    // client reducer
    successType: ['RECEIVE_CLIENT_RESOURCES_SUCCESS', 'ADD_CLIENT_RESOURCES']
  };
}

export class ClientResources extends Component {
  static fetchData({ store, params }) {
    return store.dispatch(fetchClientResourcesAction(+params.id));
  }

  static propTypes = {
    client: PropTypes.object.isRequired,
    resources: PropTypes.arrayOf(PropTypes.object).isRequired,
    fetchClientResources: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired
  };

  componentWillMount() {
    this.props.fetchClientResources(+this.props.params.id);
  }

  render() {
    let {
      resources,
      client
    } = this.props;

    require('./ClientResources.scss');
    return (<div className="container container-clientResources">
      <div className="row">
        <div className="col-md-8 col-md-offset-2">
          <h3>Personalized Resources for {client.name}</h3>
          <p>Based on your responses, we recommend you check out the following resources:</p>
          <div className="list-group resource-list">
            {!resources.length && <LoadingSpinner large absolute center/>}
            {resources.map((resource, i) => (
              <Link key={i} className="list-group-item" to={`/resources/${resource.id}`}>
                <h5>{resource.title}</h5>
                <p>Known For: {resource.tags.map(t => t.name).join(', ')}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>);
  }
}

function mapStateToProps(state) {
  return {
    client: state.client.client,
    resources: state.client.resources
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    fetchClientResources: () => {
      if (ownProps.client && ownProps.resources) {
        return;
      }

      dispatch(fetchClientResourcesAction(+ownProps.params.id));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClientResources);
