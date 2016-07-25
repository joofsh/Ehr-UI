import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchTagsAction } from 'src/actions';
import {
  FontIcon,
  LoadingSpinner,
  MaxHeightContainer,
  SearchBar,
  TagForm
} from 'src/components';

import { collectionFilter } from 'src/reducers/search';


export class Tags extends Component {
  static fetchData({ store }) {
    return store.dispatch(fetchTagsAction(true));
  }

  static propTypes = {
    fetchTags: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    addEmptyTag: PropTypes.func.isRequired,
    toggleEditTag: PropTypes.func.isRequired,
    deleteTag: PropTypes.func.isRequired,
    tags: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    params: PropTypes.object,
    children: PropTypes.node
  };

  componentDidMount() {
    this.props.fetchTags();
  }

  render() {
    let {
      children,
      handleSubmit,
      isFetching,
      addEmptyTag,
      deleteTag,
      toggleEditTag,
      tags
    } = this.props;
    let content;

    if (isFetching) {
      content = <LoadingSpinner large absolute center/>;
    } else {
      content = (<div>
        <div className="row">
          <header className="col-xs-12 tag-header">
            <h1>Manage Tags</h1>
          </header>
          <div className="col-xs-10">
            <SearchBar
              name="tagFilter"
              placeholder="Find a Tag..."
            />
          </div>
          <div className="col-xs-2">
            <button className="btn btn-primary pull-right" onClick={addEmptyTag}>
              <FontIcon type="plus"/> Tag
            </button>
          </div>
        </div>
        <div className="form-horizontal">
          {tags.map((tag, i) => (
            <TagForm
              {...tag}
              key={i}
              index={i}
              formKey={i.toString()}
              initialValues={tag}
              onSubmit={handleSubmit}
              deleteTag={deleteTag}
              toggleEditTag={toggleEditTag}
            />
          ))}
        </div>
      </div>);
    }

    require('./Tags.scss');
    return (<div className="container container-tags">
      <div className="row">
        <MaxHeightContainer className="col-xs-12 pull-right">
          { children || content }
        </MaxHeightContainer>
      </div>
    </div>);
  }
}

function createOrUpdateTagAction(tag) {
  let method;
  let url = '/api/tags';

  // Existing tag
  if (tag.id) {
    method = 'put';
    url = `${url}/${tag.id}`;
  } else {
    method = 'post';
  }

  // Remove un-editable attributes
  let _tag = Object.assign({}, tag);
  delete _tag.isEditing;
  delete _tag.id;

  return {
    type: 'CALL_API',
    url,
    method,
    data: { tag: _tag }
  };
}

function deleteTagAction(tagId) {
  return {
    type: 'CALL_API',
    url: `/api/tags/${tagId}`,
    method: 'del'
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTags: () => {
      dispatch((dispatch, getState) => {
        if (getState().tag.lastUpdated &&
          getState().tag.tags.length &&
          getState().tag.tags[0].resources) {
          return;
        }

        dispatch({ type: 'REQUEST_TAGS' });
        dispatch(fetchTagsAction(true));
      });
    },
    handleSubmit: (tag, tagIndex) => {
      let action = createOrUpdateTagAction(tag);
      return dispatch(action).then(response => {
        if (action.method === 'put') {
          dispatch({ type: 'RECEIVE_TAG_SUCCESS', payload: { tag: response } });
        } else {
          dispatch({ type: 'RECEIVE_NEW_TAG_SUCCESS',
                   payload: { tag: response, tagIndex } });
        }
        return Promise.resolve();
      }, (err) => {
        let errorInfo = JSON.parse(err.text).errors || {};
        let errorDetails = '';
        for (let key in errorInfo) {
          if (!errorInfo.hasOwnProperty(key)) continue;

          errorDetails += `${key} ${errorInfo[key].join(', ')}`;
        }

        let errorMessage = `We were unable to save this tag. Reason: ${errorDetails}`;
        return Promise.reject({ _error: errorMessage });
      });
    },
    addEmptyTag: () => {
      return dispatch({ type: 'ADD_EMPTY_TAG' });
    },
    deleteTag: (tagId, tagIndex) => {
      let val;

      // If there is a tagId, delete the tag from the database,
      // otherwise remove the unsaved tag from the array by index
      if (tagId) {
        val = dispatch(deleteTagAction(tagId)).then(() => {
          dispatch({ type: 'RECEIVE_DELETE_TAG_SUCCESS',
                  payload: { tagId } });
        });
      } else {
        val = dispatch({ type: 'RECEIVE_DELETE_TAG_SUCCESS',
                       payload: { tagIndex } });
      }
      return val;
    },
    toggleEditTag: (tagIndex) => {
      dispatch({ type: 'TOGGLE_EDIT_TAG', payload: { tagIndex } });
    }
  };
}

function mapStateToProps(state) {
  let tags = collectionFilter(state.tag.tags,
                                   state.search.tagFilter,
                                  ['id', 'name', 'weight', 'type']);

  return {
    tags,
    isFetching: state.tag.isFetching
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tags);
