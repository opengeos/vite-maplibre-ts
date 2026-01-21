import './style.css';

import 'maplibre-gl/dist/maplibre-gl.css';
import '@geoman-io/maplibre-geoman-free/dist/maplibre-geoman.css';
import 'maplibre-gl-geo-editor/style.css';
import 'maplibre-gl-layer-control/style.css';

import maplibregl from 'maplibre-gl';
import { Geoman } from '@geoman-io/maplibre-geoman-free';
import { GeoEditor, type GeoJsonLoadResult, type GeoJsonSaveResult, type AttributeChangeEvent, type DrawMode, type EditMode } from 'maplibre-gl-geo-editor';
import type { Feature, GeoJsonProperties, Geometry } from 'geojson';
import { LayerControl } from 'maplibre-gl-layer-control';
import { Legend, SearchControl } from 'maplibre-gl-components';

const BASE_MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
const map = new maplibregl.Map({
  container: 'map',
  style: BASE_MAP_STYLE,
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

  // Wait for Geoman to load
  map.on('gm:loaded', () => {
    console.log('Geoman loaded');

    // Create GeoEditor control with advanced features
    const geoEditor = new GeoEditor({
      position: 'top-left',
      collapsed: false,
      toolbarOrientation: 'vertical',
      columns: 2,
      showLabels: false,
      // Enable attribute editing panel instead of popup
      enableAttributeEditing: true,
      attributePanelPosition: 'right',
      attributePanelWidth: 320,
      attributePanelMaxHeight: '70vh', // Limit panel height (can also use pixels like 500)
      attributePanelTop: 10, // Offset from top (useful to avoid other controls)
      attributePanelSideOffset: 10, // Offset from right/left edge
      attributePanelTitle: 'Feature Properties',
      // Define attribute schema for different geometry types
      attributeSchema: {
        polygon: [
          { name: 'name', label: 'Name', type: 'string', required: true, placeholder: 'Enter name...' },
          {
            name: 'land_use',
            label: 'Land Use',
            type: 'select',
            options: [
              { value: 'residential', label: 'Residential' },
              { value: 'commercial', label: 'Commercial' },
              { value: 'industrial', label: 'Industrial' },
              { value: 'park', label: 'Park/Recreation' },
            ],
            defaultValue: 'residential',
          },
          { name: 'area_sqm', label: 'Area (sq m)', type: 'number', min: 0 },
          { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter description...' },
        ],
        line: [
          { name: 'name', label: 'Name', type: 'string', required: true },
          {
            name: 'road_type',
            label: 'Road Type',
            type: 'select',
            options: [
              { value: 'highway', label: 'Highway' },
              { value: 'main', label: 'Main Road' },
              { value: 'residential', label: 'Residential Street' },
              { value: 'path', label: 'Path/Trail' },
            ],
          },
          { name: 'lanes', label: 'Lanes', type: 'number', min: 1, max: 8, step: 1 },
          { name: 'speed_limit', label: 'Speed Limit (km/h)', type: 'number', min: 5, max: 130, step: 5 },
        ],
        point: [
          { name: 'name', label: 'Name', type: 'string', required: true },
          {
            name: 'category',
            label: 'Category',
            type: 'select',
            options: [
              { value: 'poi', label: 'Point of Interest' },
              { value: 'landmark', label: 'Landmark' },
              { value: 'facility', label: 'Facility' },
              { value: 'other', label: 'Other' },
            ],
            defaultValue: 'poi',
          },
          { name: 'active', label: 'Active', type: 'boolean', defaultValue: true },
        ],
        common: [
          { name: 'notes', label: 'Notes', type: 'textarea' },
          { name: 'color', label: 'Color', type: 'color', defaultValue: '#3388ff' },
          { name: 'created_date', label: 'Created Date', type: 'date' },
        ],
      },
      drawModes: [
        'polygon',
        'line',
        'rectangle',
        'circle',
        'marker',
        'circle_marker',
        'ellipse',
        'freehand',
      ],
      editModes: [
        'select',
        'drag',
        'change',
        'rotate',
        'cut',
        'delete',
        'scale',
        'copy',
        'split',
        'union',
        'difference',
        'simplify',
        'lasso',
      ],
      fileModes: ['open', 'save'],
      saveFilename: 'my-features.geojson',
      onFeatureCreate: (feature: Feature<Geometry, GeoJsonProperties>) => {
        console.log('Feature created:', feature);
      },
      onFeatureEdit: (feature: Feature<Geometry, GeoJsonProperties>, oldFeature: Feature<Geometry, GeoJsonProperties>) => {
        console.log('Feature edited:', feature, 'was:', oldFeature);
      },
      onFeatureDelete: (featureId: string | number) => {
        console.log('Feature deleted:', featureId);
      },
      onSelectionChange: (features: Feature<Geometry, GeoJsonProperties>[]) => {
        console.log('Selection changed:', features.length, 'features');
      },
      onModeChange: (mode: DrawMode | EditMode | null) => {
        console.log('Mode changed:', mode);
      },
      onGeoJsonLoad: (result: GeoJsonLoadResult) => {
        console.log(`Loaded ${result.count} features from ${result.filename}`);
      },
      onGeoJsonSave: (result: GeoJsonSaveResult) => {
        console.log(`Saved ${result.count} features to ${result.filename}`);
      },
      onAttributeChange: (event: AttributeChangeEvent) => {
        console.log('Attribute changed:', {
          isNew: event.isNewFeature,
          previous: event.previousProperties,
          new: event.newProperties,
        });
      },
    });

    // Connect GeoEditor with Geoman
    geoEditor.setGeoman(geoman);

    // Add the control to the map
    map.addControl(geoEditor, 'top-left');

    // Listen for GeoEditor events
    const container = map.getContainer();

    container.addEventListener('gm:copy', (e) => {
      console.log('Copy event:', (e as CustomEvent).detail);
    });

    container.addEventListener('gm:paste', (e) => {
      console.log('Paste event:', (e as CustomEvent).detail);
    });

    container.addEventListener('gm:union', (e) => {
      console.log('Union event:', (e as CustomEvent).detail);
    });

    container.addEventListener('gm:difference', (e) => {
      console.log('Difference event:', (e as CustomEvent).detail);
    });

    container.addEventListener('gm:split', (e) => {
      console.log('Split event:', (e as CustomEvent).detail);
    });

    container.addEventListener('gm:simplify', (e) => {
      console.log('Simplify event:', (e as CustomEvent).detail);
    });

    container.addEventListener('gm:lassoend', (e) => {
      console.log('Lasso selection:', (e as CustomEvent).detail);
    });

    container.addEventListener('gm:geojsonload', (e) => {
      console.log('GeoJSON loaded:', (e as CustomEvent).detail);
    });

    container.addEventListener('gm:geojsonsave', (e) => {
      console.log('GeoJSON saved:', (e as CustomEvent).detail);
    });

    // Add some sample features for demonstration
    const samplePolygon = {
      type: 'Feature' as const,
      id: 'sample-polygon',
      properties: {
        name: 'Downtown District',
        land_use: 'commercial',
        area_sqm: 45000,
        description: 'Main commercial district with shops and offices',
        notes: 'High foot traffic area',
        color: '#ff6b6b',
      },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [
          [
            [-122.43, 37.79],
            [-122.43, 37.77],
            [-122.41, 37.77],
            [-122.41, 37.79],
            [-122.43, 37.79],
          ],
        ],
      },
    };

    const samplePolygon2 = {
      type: 'Feature' as const,
      id: 'sample-polygon-2',
      properties: {
        name: 'Residential Area',
        land_use: 'residential',
        area_sqm: 32000,
        description: 'Quiet residential neighborhood',
        color: '#4ecdc4',
      },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [
          [
            [-122.42, 37.78],
            [-122.42, 37.76],
            [-122.40, 37.76],
            [-122.40, 37.78],
            [-122.42, 37.78],
          ],
        ],
      },
    };

    // Import sample features
    geoman.features.importGeoJsonFeature(samplePolygon);
    geoman.features.importGeoJsonFeature(samplePolygon2);

    console.log('GeoEditor initialized with sample features');
  });

  // Get all layers from the style
  const style = map.getStyle();
  if (!style || !style.layers) {
    return;
  }

  // Add Google Satellite basemap
  map.addSource('google-satellite', {
    type: 'raster',
    tiles: ['https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'],
    tileSize: 256,
    attribution: '&copy; Google',
  });

  map.addLayer(
    {
      id: 'Satellite',
      type: 'raster',
      source: 'google-satellite',
      minzoom: 14,
      paint: {
        'raster-opacity': 1,
      },
      layout: {
        visibility: 'visible'
      },
    },
  );

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
    id: 'OpenStreetMap',
    type: 'raster',
    source: 'raster-source',
    paint: {
      'raster-opacity': 1.0
    },
    layout: {
      visibility: 'none'
    },
  }, 'countries-layer'); // Insert below countries layer

  // Create the layer control with auto-detection
  const layerControl = new LayerControl({
    collapsed: false, // Start expanded to show features
    // layers: ['countries-layer', 'countries-outline', 'country-points', 'raster-layer'],
    panelWidth: 350,
    panelMinWidth: 240,
    panelMaxWidth: 450,
    basemapStyleUrl: BASE_MAP_STYLE
  });

  // Add the control to the map
  map.addControl(layerControl, 'top-right');

  // Add search control - allows searching for places
  const searchControl = new SearchControl({
    placeholder: 'Search for a place...',
    flyToZoom: 14,
    showMarker: true,
    markerColor: '#e74c3c',
    collapsed: true,
  });
  map.addControl(searchControl, 'top-right');

  // Listen for search result selection
  searchControl.on('resultselect', (event) => {
    console.log('Selected place:', event.result?.name, 'at', event.result?.lng, event.result?.lat);
  });

  // Add a legend with different shape types
  const shapeLegend = new Legend({
    title: 'Layer Types',
    items: [
      { label: 'Points of Interest', color: '#e74c3c', shape: 'circle' },
      { label: 'National Parks', color: '#2ecc71', shape: 'square' },
      { label: 'Rivers', color: '#3498db', shape: 'line' },
      { label: 'Roads', color: '#95a5a6', shape: 'line' },
      { label: 'Cities', color: '#9b59b6', shape: 'circle' },
    ],
    collapsible: true,
    collapsed: false,
    width: 180,
    position: 'bottom-left',
  });
  map.addControl(shapeLegend, 'bottom-left');

});
