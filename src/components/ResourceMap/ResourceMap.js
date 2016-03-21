import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { GoogleMapLoader, GoogleMap } from 'react-google-maps';
import { ResourceMarker } from 'src/components';

const WASHINGTON_DC_COORDINATES = {
  lat: 38.9165477,
  lng: -77.034559
};
const DEFAULT_ZOOM = 13;

export class ResourceMap extends Component {
  static propTypes = {
    resources: PropTypes.arrayOf(PropTypes.object).isRequired,
    handleMarkerClick: PropTypes.func.isRequired,
    handleInfoWindowClose: PropTypes.func.isRequired
  };


  render() {
    let { resources, handleMarkerClick, handleInfoWindowClose } = this.props;

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
          ref="googleMap"
        >
          {resources.map((resource, i) => {
            if (!resource.address) {
              return;
            }
            return (
              <ResourceMarker
                {...resource}
                key={i}
                handleMarkerClick={handleMarkerClick}
                handleInfoWindowClose={handleInfoWindowClose}
              />);
          })}
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
