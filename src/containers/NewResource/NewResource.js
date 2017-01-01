import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ResourceForm } from 'src/components';
import { fetchTagsAction } from 'src/actions';
import { pushPath } from 'redux-simple-router';
import string from 'src/utils/string';
import _forOwn from 'lodash/forOwn';
import Helmet from 'react-helmet';

export class NewResource extends Component {
  static propTypes = {
    resource: PropTypes.object,
    params: PropTypes.object.isRequired,
    submitResource: PropTypes.func.isRequired,
    fetchTags: PropTypes.func.isRequired,
    tags: PropTypes.array
  };

  render() {
    let {
      resource,
      submitResource,
      tags,
    } = this.props;

    require('./NewResource.scss');
    return (<div className="container container-newResource">
      <Helmet title="New Resource"/>
      <div className="row">
        <ResourceForm
          formTitle="Submit a Resource"
          initialValues={resource}
          onSubmit={submitResource}
          tagSearchResults={tags}
          className="col-xs-12"
          isEditing
        />
      </div>
    </div>);
  }
}

function submitResourceAction(resource) {
  return {
    type: 'CALL_API',
    url: `/api/resources`,
    method: 'post',
    data: resource
  };
}

function mapStateToProps(state) {
  return {
    tags: state.tag.tags.map(t => t.name)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    submitResource: (resource) => {
      return dispatch(submitResourceAction({ resource })).then(response => {
        dispatch({ type: 'RECEIVE_RESOURCE_SUCCESS', response });
        dispatch(pushPath(`/resources/${response.id}`));
        return Promise.resolve();
      }, response => {
        let error = { _error: 'We were unable to submit this resource.' };

        _forOwn(response.body.errors, (field, key) => {
          error[key] = string.capitalize(field[0]);
        });
        return Promise.reject(error);
      });
    },
    fetchTags: () => {
      dispatch((dispatch, getState) => {
        if (!getState().tag.tags.lastUpdated) {
          dispatch(fetchTagsAction());
        }
      });
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewResource);
