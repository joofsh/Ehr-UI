import React, { Component, PropTypes } from 'react';
import {  Marker, InfoWindow } from 'react-google-maps';

export default class ResourceMarker extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    address: PropTypes.object.isRequired,
    handleMarkerClick: PropTypes.func.isRequired,
    handleInfoWindowClose: PropTypes.func.isRequired,
    isMapInfoVisible: PropTypes.bool.isRequired
  };

  constructor() {
    super();

    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onInfoWindowClose = this.onInfoWindowClose.bind(this);
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
      visible
      clickable
      onClick={this.onMarkerClick}
    >
    {isMapInfoVisible ?
      <InfoWindow
        onCloseclick={this.onInfoWindowClose}
      >
        {title}
      </InfoWindow> : null}
    </Marker>);
  }
}
