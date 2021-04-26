import React from 'react';
import DeckGL from '@deck.gl/react';
import {LineLayer, ScatterplotLayer} from '@deck.gl/layers';
import {StaticMap} from 'react-map-gl';

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
  data: [
    {name: 'Colma', passengers: 4214, coordinates: [-122.466233, 37.684638]},
    {name: 'Civic Center', passengers: 24798, coordinates: [-122.413756,37.779528]},
  ],
  stroked: false,
  filled: true,
  getPosition: (d: any) => d.coordinates,
  getRadius: (d: any) => 1000,
  getFillColor: [255, 200, 0]
});

// DeckGL react component
function Map() {
  const layers = [
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
