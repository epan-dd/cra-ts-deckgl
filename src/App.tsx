import React, {useState, useEffect} from 'react';
import DeckGL from '@deck.gl/react';
import {LineLayer, ScatterplotLayer} from '@deck.gl/layers';
import {TripsLayer} from '@deck.gl/geo-layers';
import {StaticMap} from 'react-map-gl';

import { bart } from './data/bart'
import tripsData from './data/trips'

function App() {
  return (
    <div className="App">
      <Map />
    </div>
  );
}

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
  pitch: 0,
  bearing: 0
};

// Data to be used by the LineLayer
const data = [
  {sourcePosition: [-122.41669, 37.7653], targetPosition: [-122.42669, 37.781]},
  {sourcePosition: [-122.41669, 37.7753], targetPosition: [-122.41669, 37.781]}
];

const layer = new ScatterplotLayer({
  id: 'bart-stations',
  data: bart,
  stroked: false,
  filled: true,
  getPosition: (d: any) => d.coordinates,
  getRadius: (d: any) => 1000,
  getFillColor: [255, 200, 0]
});

// DeckGL react component
function Map({
  // buildings = DATA_URL.BUILDINGS,
  trips = tripsData,
  trailLength = 180,
  initialViewState = INITIAL_VIEW_STATE,
  // mapStyle = MAP_STYLE,
  // theme = DEFAULT_THEME,
  loopLength = 1800, // unit corresponds to the timestamp in source data
  animationSpeed = 20
}) {
  const [time, setTime] = useState(0);
  const [animation] = useState<{ id?: any }>({});

  const animate = () => {
    setTime(t => (t + animationSpeed) % loopLength);
    animation.id = window.requestAnimationFrame(animate);
  };

  useEffect(
    () => {
      animation.id = window.requestAnimationFrame(animate);
      return () => window.cancelAnimationFrame(animation.id);
    },
    [animation]
  );

  const layers = [
    new TripsLayer({
      id: 'trips',
      data: trips,
      getPath: (d: any) => d.path,
      getTimestamps: d => d.timestamps,
      getColor: d => [253, 128, 93],
      opacity: 0.3,
      widthMinPixels: 2,
      rounded: true,
      trailLength,
      currentTime: time,
    }),
    layer,
    new LineLayer({id: 'line-layer', data}),
  ];

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={layers}
    >
      <StaticMap mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_API} />
    </DeckGL>
  );
}

export default App;
