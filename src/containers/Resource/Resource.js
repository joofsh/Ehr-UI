import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ResourceForm, LoadingSpinner, ToggleButton, DisqusThread } from 'src/components';
import { fetchTagsAction } from 'src/actions';
import { reset } from 'redux-form';
import string from 'src/utils/string';
import _find from 'lodash/find';
import _forOwn from 'lodash/forOwn';
import Helmet from 'react-helmet';

const FEEDBACK_EMAIL = 'DCResources.community@gmail.com';

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
    resource: PropTypes.object,
    params: PropTypes.object.isRequired,
    fetchResource: PropTypes.func.isRequired,
    toggleEditResource: PropTypes.func.isRequired,
    updateResource: PropTypes.func.isRequired,
    isEditing: PropTypes.bool.isRequired,
    isTogglingPublishState: PropTypes.bool.isRequired,
    togglePublishState: PropTypes.func.isRequired,
    authedStaff: PropTypes.bool.isRequired,
    tags: PropTypes.array
  };

  componentWillMount() {
    this.props.fetchResource(+this.props.params.id);
  }

  feedbackLink() {
    let { title, id } = this.props.resource;
    let subject = encodeURIComponent(`Feedback for ${title} - ${id}`);
    return `mailto:${FEEDBACK_EMAIL}?Subject=${subject}`;
  }

  render() {
    let {
      resource,
      toggleEditResource,
      isEditing,
      isTogglingPublishState,
      togglePublishState,
      updateResource,
      tags,
      authedStaff
    } = this.props;

    if (!resource) {
      return <LoadingSpinner absolute large center/>;
    }

    require('./Resource.scss');
    return (<div className="container Resource col-xs-12">
      <Helmet title={resource.title} />
      <div className="row">
        <div className="clearfix">
          {authedStaff && <ToggleButton
            className="pull-right"
            onClick={toggleEditResource}
            isActive={isEditing}
            inactiveText="Edit"
            activeText="Cancel"
          />}
        </div>
        <ResourceForm
          formTitle={resource.title}
          initialValues={resource}
          isEditing={isEditing}
          published={resource.published}
          isTogglingPublishState={isTogglingPublishState}
          handleTogglePublishState={togglePublishState}
          authedStaff={authedStaff}
          onSubmit={updateResource}
          tagSearchResults={tags}
          className="col-xs-12"
        />
        <h3>Comments or Feedback</h3>
        <DisqusThread
          className
          identifier={`Resource-${resource.id}`}
          title={`Comments or Feedback for ${resource.title}`}
        />
      </div>
    </div>);
  }
}

function togglePublishAction(resourceId, publishing) {
  return {
    type: 'CALL_API',
    url: `/api/resources/${resourceId}/${publishing ? 'publish' : 'unpublish'}`,
    method: 'put',
    successType: 'RECEIVE_UPDATE_RESOURCE_SUCCESS'
  };
}

function updateResourceAction(resource, resourceId) {
  let _resource = Object.assign({}, resource);
  _resource.tag_pks = (_resource.tags || []).map(t => t.id);
  delete _resource.tags;

  // Clear address if no legit value
  if (!_resource.address.street || !_resource.address.street.length) {
    _resource.address = null;
  }

  return {
    type: 'CALL_API',
    url: `/api/resources/${resourceId}`,
    method: 'put',
    data: { resource: _resource }
  };
}

function mapStateToProps(state, ownProps) {
  let id = +ownProps.params.id;
  let resource = _find(state.resource.resources, r => r.id === id);

  return {
    isEditing: state.resource.isEditing,
    isTogglingPublishState: state.resource.isTogglingPublishState,
    tags: state.tag.tags,
    resource,
    authedStaff: !!(state.session.user && state.session.user.staff)
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    togglePublishState: (publishing = false) => {
      let resourceId = +ownProps.params.id;
      dispatch({ type: 'IS_TOGGLING_PUBLISHED_STATE' });
      dispatch(togglePublishAction(resourceId, publishing));
    },
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
      dispatch((dispatch, getState) => {
        if (!getState().tag.lastUpdated) {
          dispatch(fetchTagsAction());
        }

        if (getState().resource.isEditing) {
          dispatch(reset('resourceForm'));
        }

        dispatch({ type: 'TOGGLE_EDIT_RESOURCE' });
      });
    },
    updateResource: (resourceId) => {
      return (resource) => {
        return dispatch(updateResourceAction(resource, resourceId)).then(response => {
          dispatch({ type: 'RECEIVE_UPDATE_RESOURCE_SUCCESS', payload: response });
          return Promise.resolve();
        }, response => {
          let error = { _error: 'We were unable to update this resource.' };

          _forOwn(response.body.errors, (field, key) => {
            error[key] = string.capitalize(field[0]);
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
