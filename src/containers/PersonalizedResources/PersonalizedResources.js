import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { PersonalizedResourceRow, LoadingSpinner } from 'src/components';

function fetchPersonalizedResourcesAction(state) {
  let userId;

  if (state.session.user.role === 'guest') {
    userId = state.session.user.id;
  }

  return {
    type: 'CALL_API',
    method: 'get',
    url: `/api/wizard/${userId}/resources`,
    // Right now we add the resources to both reducers
    // TODO: consider refactoring and only passes the actual resource objects
    // to the resource reducer, then pass only the resource_ids array to the
    // client reducer
    successType: ['RECEIVE_RESOURCES_SUCCESS', 'RECEIVE_PERSONALIZED_RESOURCES_SUCCESS']
  };
}

export class PersonalizedResources extends Component {
  static fetchData({ store }) {
    return store.dispatch(fetchPersonalizedResourcesAction(store.getState()));
  }

  static propTypes = {
    isLoaded: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    resources: PropTypes.arrayOf(PropTypes.object).isRequired,
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
      if (resources.length) {
        content = (
          <div>
            <h3>Your Personalized Resources</h3>
            <p>Based on your responses, we recommend you check out the following resources:</p>
            <div className="resource-list">
              {resources.length && resources.map((resource, i) => (
                <PersonalizedResourceRow resource={resource} key={i} displayTags={user.isStaff()}/>
              ))}
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
        if (getState().wizard.resources.length) {
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
