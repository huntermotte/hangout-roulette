import React from 'react';
import {connect} from 'react-redux';
import * as actions from '../actions/index';
import VenueMap from './map';
import {Link} from 'react-router';
import Profile from './profile';
import Bars from './bars';
import styles from '../styles/explore.css';

export class Explore extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    let fourSquareUrl = 'https://api.foursquare.com/v2/venues/explore?ll=' + this.props.userLatitude + ',' + this.props.userLongitude + '&client_id=G21UGA10DG4RYZZFJPZTORRVYB3NHGE2SVWJO33BB2XKHVQR&client_secret=OJF0EI1MJGAXWX3LPJKIEQKU0E4UJRP333PNBC2R5LIFIAWO&v=20161016&section=food'
    this.props.getNewVenueSuggestions(fourSquareUrl)
  }


  render() {
    return(
      <div className="exploreMain" >
        <nav className="exploreNav" >
          <Link to={'/bars'}><button className="venue-options choice2">Bars</button></Link>
          <Link to={'/profile'}><button className="exploreButton notes">My Venues and Notes</button></Link>
          <button className="exploreButton logoutButton" onClick={(event) => {
            event.preventDefault()
            this.props.logoutUser()
          }}>Logout</button>
          <div className="location-editor">
           <p className="edit-location">Edit Location</p>
           <form className="zip-code-form" onSubmit={(event) => {
             event.preventDefault()
             let zip = event.target.userZIP.value;
             console.log(zip)
             this.props.getUserLocation(zip)
             setTimeout(() => {
               let fourSquareUrl = 'https://api.foursquare.com/v2/venues/explore?ll=' + this.props.userLatitude + ',' + this.props.userLongitude + '&client_id=G21UGA10DG4RYZZFJPZTORRVYB3NHGE2SVWJO33BB2XKHVQR&client_secret=OJF0EI1MJGAXWX3LPJKIEQKU0E4UJRP333PNBC2R5LIFIAWO&v=20161016&section=food'
               this.props.getNewVenueSuggestions(fourSquareUrl)
             }, 1000)
           }} >
            <input className="venueLocation" type="text" required="false" name="userZIP" placeholder="Enter ZIP Code" />
            <input className="locationChange" type="submit" value="Submit" />
           </form>
          </div>
        </nav>

        <h1 className="exploreHeader" >Why Not {this.props.venueName}?</h1>

          <button className='save-button' onClick={(event) => {
            event.preventDefault()
            let name = this.props.venueName
            this.props.addVenueToSavedList(name)
          }}>Save This Venue!</button><br />

          <h2 style={{display: 'inline'}}>Add some notes to remember about this venue  </h2>

          <form className='add-note-form' onSubmit={(event) => {
            event.preventDefault()
            let name = this.props.venueName
            let note = event.target.userInput.value
            this.props.addNoteToVenue(name, note)
            event.target.userInput.value = ''
          }} >
            <input className="note-text" type="text" required="true" name="userInput" placeholder="Add your note here" />
            <input className="noteAdd" type="submit" value="Add" />
          </form>
          <h3>Please click 'Save This Venue' in order to add notes!</h3>

          <h2>Notes for {this.props.venueName}: {this.props.notes.map((item, index) => <li key={index}> {item.note} </li>)}</h2>
          <h2>Address: {this.props.address}</h2>
          <h2>Category: {this.props.venueType}</h2>

          <button className="newSuggestionButton" style={{marginBottom: '20px'}} onClick={(event) => {
            event.preventDefault()
            let fourSquareUrl = 'https://api.foursquare.com/v2/venues/explore?ll=' + this.props.userLatitude + ',' + this.props.userLongitude + '&client_id=G21UGA10DG4RYZZFJPZTORRVYB3NHGE2SVWJO33BB2XKHVQR&client_secret=OJF0EI1MJGAXWX3LPJKIEQKU0E4UJRP333PNBC2R5LIFIAWO&v=20161016&section=food'
            this.props.getNewVenueSuggestions(fourSquareUrl)
          }}>Get another suggestion</button>

        <VenueMap mapLat={this.props.mapLat} mapLng={this.props.mapLng} latitude={this.props.latitude} longitude={this.props.longitude} />

      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  logoutUser: () => dispatch(actions.logoutUser()),
  getNewVenueSuggestions: (fourSquareUrl) => dispatch(actions.getNewVenueSuggestions(fourSquareUrl)),
  getUserLocation: (zip) => dispatch(actions.getUserLocation(zip)),
  addVenueToSavedList: (name) => dispatch(actions.addVenueToSavedList(name)),
  addNoteToVenue: (name, note) => dispatch(actions.addNoteToVenue(name, note)),
  grabNotesForSavedVenues: (name) => dispatch(actions.grabNotesForSavedVenues(name)),
  updateUserLocation: (userLatitude, userLongitude, mapLat, mapLng) => dispatch(actions.updateUserLocation(userLatitude, userLongitude, mapLat, mapLng))
})

const mapStateToProps = (state, props) => {
  let venueName = '';
  if (state.currentVenue.name) {
    venueName = state.currentVenue.name
  }
  let venueType = '';
  if (state.currentVenue.categories) {
    venueType = state.currentVenue.categories[0].pluralName
  }
  let price = '';
  if (state.currentVenue.price) {
    price = state.currentVenue.price.message
  }
  let address = '';
  if (state.currentVenue.location) {
    address = state.currentVenue.location.address
  }
  let latitude = '';
  if (state.currentVenue.location) {
    latitude = state.currentVenue.location.lat
  }
  let longitude = '';
  if (state.currentVenue.location) {
    longitude = state.currentVenue.location.lng
  }
  let notes = [];
  if (state.notes) {
    notes = state.notes
  }
  let addVenue = false;
  if (state.addVenue) {
    addVenue = state.addVenue
  }
  let userLatitude = ''
  if (state.userLatitude) {
    userLatitude = state.userLatitude
  }
  let userLongitude = ''
  if (state.userLongitude) {
    userLongitude = state.userLongitude
  }
  let mapLat = 0
  if (state.mapLat) {
    mapLat = state.mapLat
  }
  let mapLng = 0
  if (state.mapLng) {
    mapLng = state.mapLng
  }
  return {
    venueName,
    venueType,
    price,
    address,
    latitude,
    longitude,
    notes,
    addVenue,
    userLatitude,
    userLongitude,
    mapLat,
    mapLng
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Explore)
