import './style.css';

import 'maplibre-gl/dist/maplibre-gl.css';
import '@geoman-io/maplibre-geoman-free/dist/maplibre-geoman.css';
import 'maplibre-gl-geo-editor/style.css';
import 'maplibre-gl-layer-control/style.css';

import maplibregl from 'maplibre-gl';
import { Geoman } from '@geoman-io/maplibre-geoman-free';
import { GeoEditor } from 'maplibre-gl-geo-editor';
import { LayerControl } from 'maplibre-gl-layer-control';

const map = new maplibregl.Map({
  container: 'map',
  style: 'https://demotiles.maplibre.org/style.json',
  center: [0, 0],
  zoom: 2,
});

// Add navigation controls to top-right
map.addControl(new maplibregl.NavigationControl(), 'top-right');

// Add fullscreen control to top-right (after navigation)
map.addControl(new maplibregl.FullscreenControl(), 'top-right');

// Add globe control to top-right (after navigation)
map.addControl(new maplibregl.GlobeControl(), 'top-right');

map.on('load', () => {
  const geoman = new Geoman(map, {});

  map.on('gm:loaded', () => {
    const geoEditor = new GeoEditor({
      position: 'top-left',
      toolbarOrientation: 'vertical',
      columns: 2,
      drawModes: ['polygon', 'line', 'rectangle', 'circle', 'marker', 'freehand'],
      editModes: [
        'select', 'drag', 'change', 'rotate', 'cut', 'delete',
        'scale', 'copy', 'split', 'union', 'difference', 'simplify', 'lasso',
      ],
      showFeatureProperties: true,
      fitBoundsOnLoad: true,
      onFeatureCreate: (feature: any) => console.log('Created:', feature),
      onSelectionChange: (features: any[]) => console.log('Selected:', features.length),
    });

    geoEditor.setGeoman(geoman);
    map.addControl(geoEditor, 'top-left');
  });

  // Get all layers from the style
  const style = map.getStyle();
  if (!style || !style.layers) {
    return;
  }

  // Create a simple test GeoJSON (world bounding boxes for a few countries)
  const geojson: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'United States' },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [-125, 25], [-125, 49], [-66, 49], [-66, 25], [-125, 25]
          ]]
        }
      },
      {
        type: 'Feature',
        properties: { name: 'Brazil' },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [-73, -33], [-73, 5], [-34, 5], [-34, -33], [-73, -33]
          ]]
        }
      },
      {
        type: 'Feature',
        properties: { name: 'China' },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [73, 18], [73, 53], [135, 53], [135, 18], [73, 18]
          ]]
        }
      },
      {
        type: 'Feature',
        properties: { name: 'Australia' },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [113, -44], [113, -10], [154, -10], [154, -44], [113, -44]
          ]]
        }
      }
    ]
  };

  // Add GeoJSON source
  map.addSource('countries-source', {
    type: 'geojson',
    data: geojson
  });

  // Add fill layer (ensure it's on top of basemap)
  map.addLayer({
    id: 'countries-layer',
    type: 'fill',
    source: 'countries-source',
    paint: {
      'fill-color': '#088',
      'fill-opacity': 0.5
    }
  });

  // Add outline layer (on top of fill)
  map.addLayer({
    id: 'countries-outline',
    type: 'line',
    source: 'countries-source',
    paint: {
      'line-color': '#000',
      'line-width': 2,
      'line-opacity': 1.0
    }
  });

  // Add circle layer (points at country centers)
  map.addLayer({
    id: 'country-points',
    type: 'circle',
    source: 'countries-source',
    paint: {
      'circle-radius': 8,
      'circle-color': '#ef4444',
      'circle-opacity': 0.8,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff',
      'circle-stroke-opacity': 1
    }
  });

  // Add a raster layer (using MapLibre demo tiles as example)
  map.addSource('raster-source', {
    type: 'raster',
    tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
    tileSize: 256,
    attribution: '&copy; OpenStreetMap contributors'
  });

  map.addLayer({
    id: 'raster-layer',
    type: 'raster',
    source: 'raster-source',
    paint: {
      'raster-opacity': 0.3
    }
  }, 'countries-layer'); // Insert below countries layer

  // Create the layer control with auto-detection
  const layerControl = new LayerControl({
    collapsed: false, // Start expanded to show features
    // layers: ['countries-layer', 'countries-outline', 'country-points', 'raster-layer'],
    panelWidth: 350,
    panelMinWidth: 240,
    panelMaxWidth: 450
  });

  // Add the control to the map
  map.addControl(layerControl, 'top-right');
});
