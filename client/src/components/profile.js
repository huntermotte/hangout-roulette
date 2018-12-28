import React from 'react';
import {connect} from 'react-redux';
import * as actions from '../actions/index';
import styles from '../styles/profile.css';
import {Link} from 'react-router';

export class Profile extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.getUserData()
  }

  render() {
    return(
      <div className="profileMain" >
      <nav className="profileNav" >
        <Link to={'/explore'}><button className="profileButton explore" >Go Back to Explore</button></Link>
        <button className="profileButton logout" onClick={(event) => {
          event.preventDefault()
          this.props.logoutUser()
        }}>Logout</button>
      </nav>
        <h1 className="profileHeader" >My Venues and Notes</h1>
        {this.props.userVenues.map((venue, index) => {
          return(
            <div className="venue-with-notes" key={index}>
              <h2 className="venue"> {venue.name} </h2>
                <ul>
                  {venue.notes.map((note, index) => {
                    return(
                      <li className="note" key={index}> {note.note} </li>
                    )
                  })}
                </ul>
            </div>
          )
        })}
        <div className="background-below-notes">
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  getUserData: () => dispatch(actions.getUserData()),
  logoutUser: () => dispatch(actions.logoutUser())
})

const mapStateToProps = (state, props) => {
  let userVenues = [];
  if (state.userData) {
    for (let i=0; i < state.userData.length; i++) {
      userVenues[i] = state.userData[i]
    }
  }
  return {
    userVenues
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
