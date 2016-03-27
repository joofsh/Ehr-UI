import React from 'react';
import expect from 'expect';
import { createRenderer } from 'react-addons-test-utils';
import { buildResource } from 'src/reducers/resource';
import {
  ResourceMap,
  WASHINGTON_DC_COORDINATES,
  DEFAULT_ZOOM,
  FOCUSED_ZOOM
} from '../ResourceMap/ResourceMap';
import { resources } from '../../__tests__/mocks/mockData';
import _filter from 'lodash/filter';


describe('Component - ResourceMap', () => {
  let renderer;
  let modeledResources = resources.map(r => buildResource(r));
  let resourcesWithAddress = _filter(resources, (r) => !!r.address);
  let handleMarkerClick = () => {
    return true;
  };
  let handleInfoWindowClose = () => {
    return true;
  };

  beforeEach(() => {
    renderer = createRenderer();
  });

  it('renders map with all markers', () => {
    expect(resourcesWithAddress.length).toBe(2);

    renderer.render(
      <ResourceMap
        resources={modeledResources}
        handleMarkerClick={handleMarkerClick}
        handleInfoWindowClose={handleInfoWindowClose}
      />
    );

    let result = renderer.getRenderOutput();
    expect(result.type.name).toBe('GoogleMapLoader');

    let googleMapElement = result.props.googleMapElement;
    expect(googleMapElement.type.name).toBe('GoogleMap');
    expect(googleMapElement.props.children.length).toBe(2);

    // Not viewing a specific resource
    expect(googleMapElement.props.activeResourceId).toNotExist();
    expect(googleMapElement.props.center).toBe(WASHINGTON_DC_COORDINATES);
    expect(googleMapElement.props.zoom).toBe(DEFAULT_ZOOM);
    expect(googleMapElement.props.children[0].props.visible).toBe(true);
    expect(googleMapElement.props.children[1].props.visible).toBe(true);
  });

  it('renders map with active resource', () => {
    renderer.render(
      <ResourceMap
        resources={modeledResources}
        handleMarkerClick={handleMarkerClick}
        handleInfoWindowClose={handleInfoWindowClose}
        activeResourceId={resourcesWithAddress[0].id}
      />
    );

    let result = renderer.getRenderOutput();
    expect(result.type.name).toBe('GoogleMapLoader');

    let googleMapElement = result.props.googleMapElement;
    expect(googleMapElement.type.name).toBe('GoogleMap');
    expect(googleMapElement.props.children.length).toBe(2);

    // viewing a specific resource
    expect(googleMapElement.props.center).toNotBe(WASHINGTON_DC_COORDINATES);
    expect(googleMapElement.props.center.lat)
      .toBe(+resourcesWithAddress[0].address.lat);
    expect(googleMapElement.props.center.lng)
      .toBe(+resourcesWithAddress[0].address.lng);
    expect(googleMapElement.props.zoom).toBe(FOCUSED_ZOOM);
    expect(googleMapElement.props.children[0].props.visible).toBe(true);
    expect(googleMapElement.props.children[1].props.visible).toBe(false);
  });
});
