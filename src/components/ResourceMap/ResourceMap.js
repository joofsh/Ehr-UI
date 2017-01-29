import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { GoogleMapLoader, GoogleMap } from 'react-google-maps';
import { ResourceMarker } from 'src/components';
import _filter from 'lodash/filter';

export const WASHINGTON_DC_COORDINATES = {
  lat: 38.9165477,
  lng: -77.034559
};
export const DEFAULT_ZOOM = 13;
export const FOCUSED_ZOOM = 16;

export class ResourceMap extends Component {
  static propTypes = {
    resources: PropTypes.arrayOf(PropTypes.object).isRequired,
    handleMarkerClick: PropTypes.func.isRequired,
    handleInfoWindowClose: PropTypes.func.isRequired,
    activeResourceId: PropTypes.number
  };

  render() {
    let {
      resources,
      handleMarkerClick,
      handleInfoWindowClose,
      activeResourceId
    } = this.props;
    let activeZoom, activeResources, activeCenter;

    if (activeResourceId) {
      activeResources = _filter(resources, (r) => (r.id === activeResourceId));
      if (activeResources[0].address) {
        activeZoom = FOCUSED_ZOOM;
        activeCenter = {
          lat: +activeResources[0].address.lat,
          lng: +activeResources[0].address.lng
        };
      } else {
        activeZoom = DEFAULT_ZOOM;
        activeCenter = WASHINGTON_DC_COORDINATES;
      }
    } else {
      activeZoom = DEFAULT_ZOOM;
      activeResources = resources;
      activeCenter = WASHINGTON_DC_COORDINATES;
    }

    let resourcesWithAddress = _filter(resources, (r) => !!r.address);

    require('./ResourceMap.scss');
    return (<GoogleMapLoader
      containerElement={
        <div
          className="resource-map"
        />
      }
      googleMapElement={
        <GoogleMap
          defaultZoom={DEFAULT_ZOOM}
          defaultCenter={WASHINGTON_DC_COORDINATES}
          zoom={activeZoom}
          center={activeCenter}
          ref="googleMap"
        >
          {resourcesWithAddress.map((resource, i) => (
              <ResourceMarker
                {...resource}
                key={i}
                handleMarkerClick={handleMarkerClick}
                handleInfoWindowClose={handleInfoWindowClose}
                visible={!activeResourceId || resource.id === activeResourceId}
              />
          ))}
        </GoogleMap>
      }
    />);
  }
}

function mapDispatchToProps(dispatch) {
  return {
    handleMarkerClick: (id) => {
      dispatch({
        type: 'SWITCH_MARKER_VISIBILITY',
        payload: { visibility: true, id }
      });
    },
    handleInfoWindowClose: (id) => {
      dispatch({
        type: 'SWITCH_MARKER_VISIBILITY',
        payload: { visibility: false, id }
      });
    },
  };
}

export default connect(
  null,
  mapDispatchToProps
)(ResourceMap);
