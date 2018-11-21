import 'isomorphic-fetch';
import $ from 'jquery';
import {hashHistory} from 'react-router';

export const RECEIVE_CREDENTIALS = 'RECEIVE_CREDENTIALS';
export const receiveCredentials = (user) => ({
  type: RECEIVE_CREDENTIALS,
  user
});

export const LOGOUT_CURRENT_USER = 'LOGOUT_CURRENT_USER';
export const logoutCurrentUser = () => ({
  type: LOGOUT_CURRENT_USER
});

export const RETRIEVE_VENUE_DATA = 'RETRIEVE_VENUE_DATA';
export const retrieveVenueData = (venueData) => ({
  type: RETRIEVE_VENUE_DATA,
  venueData
})

export const ACCEPT_VENUE_NOTES = 'ACCEPT_VENUE_NOTES';
export const acceptVenueNotes = (notes) => ({
  type: ACCEPT_VENUE_NOTES,
  notes
})

export const CLEAR_VENUE_NOTES = 'CLEAR_VENUE_NOTES';
export const clearVenueNotes = () => ({
  type: CLEAR_VENUE_NOTES
})

export const SET_CURRENT_VENUE = 'SET_CURRENT_VENUE';
export const setCurrentVenue = (currentVenue) => ({
  type: SET_CURRENT_VENUE,
  currentVenue
})

export const INSERT_USER_DATA = 'INSERT_USER_DATA';
export const insertUserData = (userData) => ({
  type: INSERT_USER_DATA,
  userData
})

export const ADD_VENUE_SUCESS = 'ADD_VENUE_SUCESS';
export const addVenueSuccess = () => ({
  type: ADD_VENUE_SUCESS
})

export const saveUserInDatabase = (username, password) => {
  return (dispatch) => {
    return $.ajax({
      type: 'POST',
      data: JSON.stringify({username, password}),
      contentType: 'application/json',
      url: '/api/register',
      success: (user) => {
        dispatch(receiveCredentials(user))
        hashHistory.push('/login')
      },
      error: (err) => {
        console.log(err)
        alert('Please enter a unique username and/or password')
      }
    })
  }
}

export const addVenueToSavedList = (name) => {
  return (dispatch) => {
    $.ajax({
      type: 'POST',
      data: JSON.stringify({name}),
      contentType: 'application/json',
      url: '/api/venues',
      success:  (venue) => {
        console.log(venue)
        dispatch(retrieveVenueData(venue))
        dispatch(addVenueSuccess())
        alert('Venue successfully added!')
      },
      error: (err) => {
        console.log(err)
        alert('Venue already saved!')
      }
    })
  }
}

export const addNoteToVenue = (name, note) => {
  return (dispatch) => {
    $.ajax({
      type: 'PUT',
      data: JSON.stringify({name, note}),
      contentType: 'application/json',
      url: '/api/venues',
      success: (response) => {
        console.log(response)
        dispatch(retrieveVenueData(response))
        if (response.notes) {
          alert('Note added!')
        }
        else {
          alert('Please save venue first!')
        }
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
}

export const grabNotesForSavedVenues = (name) => {
  return (dispatch) => {
    $.ajax({
      type: 'POST',
      data: JSON.stringify({name}),
      contentType: 'application/json',
      url: '/api/venues/notes',
      success: (venue) => {
        if (venue[0]) {
          dispatch(acceptVenueNotes(venue[0].notes))
        }
        else {
          dispatch(clearVenueNotes())
        }
      },
      error: (err) => console.log(err)
    })
  }
}

export const getLoggedInUser = (username, password) => {
  return (dispatch) => {
    $.ajax({
      type: 'GET',
      headers: {
	    'content-type': "application/json",
	    authorization: "Basic " + btoa(username + ':' + password)
      },
      url: '/api/me',
      success: (user) => {
        dispatch(receiveCredentials(user))
        hashHistory.push('/explore')
      },
      error: (err) => {
        console.log(err)
        alert('Incorrect username or password! Please try again')
      }
    })
  }
}

export const logoutUser = () => {
  return (dispatch) => {
  $.ajax({
    type: 'GET',
    url: '/api/logout',
    success: function(data) {
      dispatch(logoutCurrentUser())
      if (data.loggedOut) {
        hashHistory.push('/')
      }
    }
  })
  }
}

export const getUserData = () => {
  return (dispatch) => {
    $.ajax({
      type: 'GET',
      url: '/api/venues',
      success: (response) => {
        dispatch(insertUserData(response))
      }
    })
  }
}

export const getUserLocation = (zip) => {
  return (dispatch) => {
    $.ajax({
      type: 'GET',
      url: '/api/location',
      success: (response) => {
        console.log(response)
        let lat = response.LAT;
        let lng = response.LNG;
      },
      error: (err) => console.log(err)
    })
  }
}

export const getNewVenueSuggestions = () => {
  return (dispatch) => {
    $.ajax({
      type: 'GET',
      url: 'https://api.foursquare.com/v2/venues/explore?ll=42.33,-71.04&client_id=G21UGA10DG4RYZZFJPZTORRVYB3NHGE2SVWJO33BB2XKHVQR&client_secret=OJF0EI1MJGAXWX3LPJKIEQKU0E4UJRP333PNBC2R5LIFIAWO&v=20161016&section=food',
      success: (data) => {
        let randomIndex = Math.floor(Math.random() * 30) + 1
        dispatch(retrieveVenueData(data.response.groups[0].items[randomIndex].venue))
        dispatch(setCurrentVenue(data.response.groups[0].items[randomIndex].venue))
        dispatch(grabNotesForSavedVenues(data.response.groups[0].items[randomIndex].venue.name))
      },
      error: (err) => console.log(err)
    })
  }
}

export const getNewBarSuggestions = () => {
  return (dispatch) => {
    $.ajax({
      type: 'GET',
      url: 'https://api.foursquare.com/v2/venues/explore?ll=42.33,-71.04&client_id=G21UGA10DG4RYZZFJPZTORRVYB3NHGE2SVWJO33BB2XKHVQR&client_secret=OJF0EI1MJGAXWX3LPJKIEQKU0E4UJRP333PNBC2R5LIFIAWO&v=20161016&section=drinks',
      success: (data) => {
        let randomIndex = Math.floor(Math.random() * 30) + 1
        dispatch(retrieveVenueData(data.response.groups[0].items[randomIndex].venue))
        dispatch(setCurrentVenue(data.response.groups[0].items[randomIndex].venue))
        dispatch(grabNotesForSavedVenues(data.response.groups[0].items[randomIndex].venue.name))
      },
      error: (err) => console.log(err)
    })
  }
}

export const getNewBarSuggestionsGlenwood = () => {
  return (dispatch) => {
    $.ajax({
      type: 'GET',
      url: 'https://api.foursquare.com/v2/venues/explore?ll=35.7861,-78.6472&client_id=G21UGA10DG4RYZZFJPZTORRVYB3NHGE2SVWJO33BB2XKHVQR&client_secret=OJF0EI1MJGAXWX3LPJKIEQKU0E4UJRP333PNBC2R5LIFIAWO&v=20161016&section=drinks',
      success: (data) => {
        let randomIndex = Math.floor(Math.random() * 30) + 1
        dispatch(retrieveVenueData(data.response.groups[0].items[randomIndex].venue))
        dispatch(setCurrentVenue(data.response.groups[0].items[randomIndex].venue))
        dispatch(grabNotesForSavedVenues(data.response.groups[0].items[randomIndex].venue.name))
      },
      error: (err) => console.log(err)
    })
  }
}
