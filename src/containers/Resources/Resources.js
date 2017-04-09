import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { buildUser } from 'src/reducers/session';

import {
  LoadingSpinner,
  ResourceRow,
  ResourceMap,
  MaxHeightContainer,
  SearchBar
} from 'src/components';
import { collectionFilter } from 'src/reducers/search';

function fetchResources() {
  return {
    type: 'CALL_API',
    method: 'get',
    url: '/api/resources',
    params: { length: 10000 },
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
    children: PropTypes.node,
    searchValue: PropTypes.string.isRequired,
    setInitialSearch: PropTypes.func.isRequired,
    user: PropTypes.object
  };

  componentDidMount() {
    this.props.setInitialSearch();
    this.props.fetchResources();
  }

  render() {
    let {
      resources,
      children,
      params: {
        id: activeResourceId
      },
      searchValue,
      user
    } = this.props;
    let resourceContent;

    let displayTags = user && user.isStaff();

    if (this.props.isFetching) {
      resourceContent = <LoadingSpinner large absolute center/>;
    } else {
      resourceContent = (<div>
        <SearchBar
          name="resourceFilter"
          placeholder="Find a Resource..."
          value={searchValue}
        />
        <div className="list-group resource-list">
          {resources.map((resource, i) => (
            <ResourceRow key={i} {...resource} displayTags={displayTags}/>
          ))}
        </div>
      </div>);
    }

    require('./Resources.scss');
    return (<div className="container-fluid container-resources">
      <Helmet title="Resources"/>
      <div className="row">
        <MaxHeightContainer className="col-md-6 col-xs-12 pull-right">
          { children || resourceContent }
        </MaxHeightContainer>
        <MaxHeightContainer className="col-md-6 col-xs-12 resource-map-wrapper">
          <ResourceMap resources={resources} activeResourceId={+activeResourceId}/>
        </MaxHeightContainer>
      </div>
    </div>);
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    fetchResources: () => {
      dispatch((dispatch, getState) => {
        if (getState().resource.lastUpdated && getState().resource.resources.length) {
          return;
        }

        dispatch({ type: 'REQUEST_RESOURCES' });
        dispatch(fetchResources());
      });
    },
    setInitialSearch: () => {
      let searchQuery = ownProps.location.query.query || '';
      dispatch({
        type: 'UPDATE_SEARCH_VALUE',
        payload: {
          name: 'resourceFilter',
          value: searchQuery
        }
      });
    }
  };
}

function mapStateToProps(state) {
  let resources = collectionFilter(state.resource.resources,
                                   state.search.resourceFilter,
                                  ['id', 'title', 'description', 'category',
                                    'operating_hours', 'email', 'phone', 'url',
                                    'address.street', 'address.city', 'address.state',
                                    'address.zipcode', 'note', 'languages', 'tags.name']);
  return {
    resources,
    searchValue: state.search.resourceFilter,
    isFetching: state.resource.isFetching,
    user: buildUser(state.session.user)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Resources);
