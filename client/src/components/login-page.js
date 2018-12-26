import React from 'react';
import {connect} from 'react-redux';
import * as actions from '../actions/index';
import raleigh from './raleigh.jpg';
import styles from '../styles/login.css';
import {Link} from 'react-router';

export class LoginPage extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <div className="login-div" style={{
        background: 'url(' + raleigh + ') no-repeat center center fixed',
        backgroundSize: 'cover',
        height: '100vh'
      }}>
        <form className="login-form" onSubmit={(event) => {
          event.preventDefault();
          let username = event.target.username.value;
          let password = event.target.password.value;
          let userLatitude = '42.33';
          let userLongitude = '-71.04';
          let mapLat = 42.33343;
          let mapLng = -71.04949;
          this.props.getLoggedInUser(username, password)
          this.props.updateUserLocation(userLatitude, userLongitude, mapLat, mapLng)
        }}>
          <label htmlFor="userUsername" className="usernameText">Enter Your Username:</label><br />
          <input type="text" required="true" name="username" className="newUsername form-control" placeholder="Username" />
          <br /><br />
          <label htmlFor="userPassword" className="passwordText">Enter Your Password:</label><br />
          <input type="password" name="password" className="newPassword form-control" placeholder="Password" /><br />
          <br />
            <div className="buttons">
              <input type="submit" required="true" className="btn btn-default submit" value="Login" />
              <Link to={'/'}><button type="button" className="btn btn-default home">Home</button></Link>
            </div>
        </form>
        <div className="demo">
          <h3>Demo Username: demo</h3>
          <h3>Demo Password: demo</h3>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  getLoggedInUser: (username, password) => dispatch(actions.getLoggedInUser(username, password)),
  updateUserLocation: (userLatitude, userLongitude, mapLat, mapLng) => dispatch(actions.updateUserLocation(userLatitude, userLongitude, mapLat, mapLng))
})

const mapStateToProps = (state, props) => {
  let userLatitude = ''
  if (state.userLatitude) {
    userLatitude = state.userLatitude
  }
  let userLongitude = ''
  if (state.userLongitude) {
    userLatitude = state.userLongitude
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
    userLatitude,
    userLongitude,
    mapLat,
    mapLng
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
