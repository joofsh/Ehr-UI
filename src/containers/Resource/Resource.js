import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form, ToggleButton } from 'src/components';
import stringUtil from 'src/utils/string';
import _find from 'lodash/find';
import _forOwn from 'lodash/forOwn';

const FIELDS = [
  { name: 'title' },
  { name: 'operating_hours' },
  { name: 'phone' },
  { name: 'url' },
  { name: 'image_url' }
];

function fetchResourceAction(id) {
  return {
    type: 'CALL_API',
    method: 'get',
    url: `/api/resources/${id}`,
    successType: 'RECEIVE_RESOURCE_SUCCESS'
  };
}

export class Resource extends Component {
  static fetchData({ store, params }) {
    return store.dispatch(fetchResourceAction(+params.id));
  }

  static propTypes = {
    resource: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    fetchResource: PropTypes.func.isRequired,
    toggleEditResource: PropTypes.func.isRequired,
    updateResource: PropTypes.func.isRequired,
    isEditing: PropTypes.bool.isRequired,
  };

  componentWillMount() {
    this.props.fetchResource(+this.props.params.id);
  }

  render() {
    let {
      resource,
      toggleEditResource,
      isEditing,
      updateResource
    } = this.props;

    require('./Resource.scss');
    return (<div className="container container-resource">
      <div className="row">
        <h1>
          {resource.title}
          <ToggleButton
            className="pull-right"
            onClick={toggleEditResource}
            isActive={isEditing}
            inactiveText="Edit"
            activeText="Cancel"
          />
        </h1>
        <Form className="col-xs-12"
          customFields={FIELDS}
          initialValues={resource}
          fields={FIELDS.map(field => field.name)}
          isEditing={isEditing}
          onSubmit={updateResource}
        />
      </div>
    </div>);
  }
}

function updateResourceAction(resource, resourceId) {
  return {
    type: 'CALL_API',
    url: `/api/resources/${resourceId}`,
    method: 'put',
    data: resource
  };
}

function mapStateToProps(state, ownProps) {
  let id = +ownProps.params.id;
  let resource = _find(state.resource.resources, r => r.id === id);

  return {
    isEditing: state.resource.isEditing,
    resource
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    fetchResource: () => {
      dispatch((dispatch, getState) => {
        let id = +ownProps.params.id;
        let resource = _find(getState().resource.resources, r => r.id === id);

        // Only fetch resource if not already fetched
        if (resource) {
          return;
        }

        dispatch(fetchResourceAction(id));
      });
    },
    toggleEditResource: () => {
      dispatch({ type: 'TOGGLE_EDIT_RESOURCE' });
    },
    updateResource: (resourceId) => {
      return (resource) => {

        return dispatch(updateResourceAction({ resource }, resourceId)).then(response => {
          dispatch({ type: 'RECEIVE_UPDATE_RESOURCE_SUCCESS', response });
          return Promise.resolve();
        }, response => {
          let error = { _error: 'We were unable to update this resource.' };

          _forOwn(response.body.errors, (field, key) => {
            error[key] = stringUtil.capitalize(field[0]);
          });
          return Promise.reject(error);
        });
      };
    }
  };
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, ownProps, stateProps, dispatchProps, {
    updateResource: dispatchProps.updateResource(+ownProps.params.id)
  });
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Resource);
