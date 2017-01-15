import React, { Component, PropTypes } from 'react';
import { Marker, InfoWindow } from 'react-google-maps';
import { push } from 'react-router-redux';

export default class ResourceMarker extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    address: PropTypes.object.isRequired,
    handleMarkerClick: PropTypes.func.isRequired,
    handleInfoWindowClose: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    isMapInfoVisible: PropTypes.bool.isRequired
  };

  constructor() {
    super();

    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onInfoWindowClose = this.onInfoWindowClose.bind(this);
    this.onTitleClick = this.onTitleClick.bind(this);
  }

  static contextTypes = {
    store: PropTypes.object
  };

  linkUrl() {
    return `/resources/${this.props.id}`;
  }

  onTitleClick(event) {
    event.preventDefault();
    this.context.store.dispatch(push(this.linkUrl()));
  }

  onMarkerClick() {
    this.props.handleMarkerClick(this.props.id);
  }

  onInfoWindowClose() {
    this.props.handleInfoWindowClose(this.props.id);
  }

  render() {
    let {
      id,
      title,
      visible,
      address: {
        lat, lng
      },
      isMapInfoVisible,
      ...rest
    } = this.props;
    return (<Marker
      {...rest}
      cursor="pointer"
      title={title}
      position={{
        lat: +lat,
        lng: +lng
      }}
      visible={visible}
      clickable
      onClick={this.onMarkerClick}
    >
    {isMapInfoVisible ?
      <InfoWindow
        onCloseclick={this.onInfoWindowClose}
      >
      <a href={this.linkUrl()} onClick={this.onTitleClick}>{title}</a>
      </InfoWindow> : null}
    </Marker>);
  }
}
