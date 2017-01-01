import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { PersonalizedResourceRow, LoadingSpinner } from 'src/components';
import _forOwn from 'lodash/forOwn';
import _isEmpty from 'lodash/isEmpty';
import Helmet from 'react-helmet';

function fetchPersonalizedResourcesAction(state) {
  let path, userId;

  if (state.session.user.isStaff()) {
    path = `/api/demo/wizard/resources`;
  } else {
    userId = state.session.user.id;
    path = `/api/wizard/${userId}/resources`;
  }

  return {
    type: 'CALL_API',
    method: 'get',
    url: path,
    // Right now we add the resources to both reducers
    // TODO: consider refactoring and only passes the actual resource objects
    // to the resource reducer, then pass only the resource_ids array to the
    // client reducer
    successType: [
      'RECEIVE_WIZARD_RESOURCES_SUCCESS',
      'RECEIVE_PERSONALIZED_RESOURCES_SUCCESS'
    ]
  };
}

export class PersonalizedResources extends Component {
  static fetchData({ store }) {
    return store.dispatch(fetchPersonalizedResourcesAction(store.getState()));
  }

  static propTypes = {
    isLoaded: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    resources: PropTypes.object.isRequired,
    fetchPersonalizedResources: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.fetchPersonalizedResources();
  }

  render() {
    let content;
    let {
      isLoaded,
      resources,
      user
    } = this.props;

    if (isLoaded) {
      if (!_isEmpty(resources)) {

        let resourceContent = [];
        _forOwn(resources, (_resources, tag) => {
          resourceContent.push(<fieldset key={tag} className="resourceGroup">
            <legend><h2>Resources for {tag}</h2></legend>
            {_resources.slice(0, 3).map((resource, i) => (
              <PersonalizedResourceRow resource={resource} key={i} displayTags={user.isStaff()}/>
            ))}
          </fieldset>);
        });

        content = (
          <div>
            <p>Based on your responses, we recommend you check out the following resources:</p>
            <div className="resource-list">
              {resourceContent}
            </div>
          </div>
        );
      } else {
        content = (
          <div className="no-resources">
            Sorry, we were unable to find personalized resources for you at this time
            <div className="no-resources-cta">
              <Link to="/resources" className="btn btn-primary btn-lg">
                View All Resources
              </Link>
            </div>
          </div>
        );
      }
    } else {
      content = <LoadingSpinner large absolute center/>;
    }

    require('./PersonalizedResources.scss');
    return (<div className="container container-personalizedResources">
      <Helmet title="My Resources"/>
      <div className="row">
        <div className="col-lg-12 content">
          {content}
        </div>
      </div>
    </div>);
  }
}

function mapStateToProps(state) {
  return {
    // TOOD: refactor this to work with not current user guests
    user: state.session.user,
    resources: state.wizard.resources,
    isLoaded: !!state.wizard.resourcesLastUpdated
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchPersonalizedResources: () => {
      dispatch((dispatch, getState) => {
        if (!_isEmpty(getState().wizard.resources)) {
          return;
        }

        dispatch(fetchPersonalizedResourcesAction(getState()));
      });
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PersonalizedResources);
