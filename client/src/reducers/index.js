import * as actions from '../actions/index';

const initialState = {
  user: {},
  venueData: {},
  notes: [],
  currentVenue: {}
}

const usersReducer = (state=initialState, action) => {
  if (action.type === actions.RECEIVE_CREDENTIALS) {
    return {
      ...state,
      user: action.user
    }
  }
  else if (action.type === actions.LOGOUT_CURRENT_USER) {
    return {
      ...state,
      user: null
    }
  }
  else if (action.type === actions.RETRIEVE_VENUE_DATA) {
    return {
      ...state,
      venueData: action.venueData
    }
  }
  else if (action.type === actions.ACCEPT_VENUE_NOTES) {
    return {
      ...state,
      notes: action.notes
    }
  }
  else if (action.type === actions.SET_CURRENT_VENUE) {
    return {
      ...state,
      currentVenue: action.currentVenue
    }
  }
  else if (action.type === actions.INSERT_USER_DATA) {
    return {
      ...state,
      userData: action.userData
    }
  }
  else {
    return state
  }
};

export default usersReducer;
