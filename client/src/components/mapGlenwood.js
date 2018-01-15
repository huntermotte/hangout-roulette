import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import marker from './marker.png';

// const marker = new google.maps.Marker({})

const LocationMarker = ({ text }) => <div style={{
  height: 35,
  width: 25,
  top: -20,
  left: -30,
  fontWeight: 'bold',
  position: 'relative',
  color: 'black'
}}>
<img src={marker} />
</div>;

export default class VenueMapGlenwood extends Component {
  static defaultProps = {
    center: {lat: 35.7861, lng: -78.6472},
    zoom: 15
  };

  render() {
    return (
      <div className='googleMap' style={{
        height: '400px',
        width: '100%',
        textAlign: 'center',
        position: 'absolute',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '0px'
      }}>
      <GoogleMapReact
        defaultCenter={this.props.center}
        defaultZoom={this.props.zoom}
        style={{textAlign: 'center', marginRight: 'auto', marginLeft: 'auto'}}
      >
        <LocationMarker
          lat={this.props.latitude}
          lng={this.props.longitude}
          text={marker}
        />
      </GoogleMapReact>
      </div>
    );
  }
}
