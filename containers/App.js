import React, {Component} from 'react';
import mapboxgl from 'mapbox-gl';
import geojson from '../fixtures/geoJSON.js'
import './App.css';

export default class App extends Component {
  componentDidMount() {
    this.map = this.initMap()
    this.addInitialGateways()

    this.state = { input: '' }
  }

  initMap() {
    mapboxgl.accessToken = 'pk.eyJ1IjoidmljbWdzMTE3IiwiYSI6ImNqZHduZXdxMDA3cnoyeXFwMjNpa2Z2dmcifQ.DHF-2tVYtmzrBD4tbXhbEQ'
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/dark-v9',
      center: [-96, 38],
      zoom: 3
    });
    const nav = new mapboxgl.NavigationControl({ showZoom: true, showCompass: false });
    map.addControl(nav, 'top-left');

    return map
  }

  addInitialGateways() {
    for (let i = 0; i < geojson.features.length; i++) {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.width = geojson.features[i].properties.iconSize[0] + 'px';
      el.style.height = geojson.features[i].properties.iconSize[1] + 'px';

      const popup = new mapboxgl.Popup()
        .setText(geojson.features[i].properties.message);

      new mapboxgl.Marker(el)
          .setLngLat(geojson.features[i].geometry.coordinates)
          .setPopup(popup)
          .addTo(this.map);
    }
  }

  addRandomGateway() {
    const coord1 = -123 + Math.random() * 50
    const coord2 = 35 + Math.random() * 13
    const gateway = {
      "type": "Feature",
      "properties": {
          "message": this.state.input,
          "iconSize": [10, 10]
      },
      "geometry": {
          "type": "Point",
          "coordinates": [coord1, coord2]
      }
    }

    const el = document.createElement('div');
    el.className = 'markerNew';
    el.style.width = gateway.properties.iconSize[0] + 'px';
    el.style.height = gateway.properties.iconSize[1] + 'px';

    const popup = new mapboxgl.Popup()
      .setText(gateway.properties.message);

    const marker = new mapboxgl.Marker(el)
        .setLngLat(gateway.geometry.coordinates)
        .setPopup(popup)
        .addTo(this.map);
  }

  onInputChange() {
    this.setState({
      input: this.input.value
    })
  }

  render() {
    return(
      <div className='main'>
        <div id='map' style={{width: '100%', height: '500px'}} ref={el => this.mapContainer = el}></div>
        <div className='entry'>
          <input ref={el => this.input = el} onChange={this.onInputChange.bind(this)} type="text"/>
          <button onClick={this.addRandomGateway.bind(this)}>Add random gateway</button>
        </div>
      </div>
    )
  }
}
