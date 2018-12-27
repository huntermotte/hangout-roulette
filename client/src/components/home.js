import React from 'react';
import video from './DTRDrone.mp4';
import styles from '../styles/home.css';
import {Link} from 'react-router';

export default function Home(props) {
  return(
    <div className="container" style={{position: 'relative'}}>

      <Link to={'/'}><button className="homeButton">Home</button></Link>
      <Link to={'/register'}><button className="registerButton">Register</button></Link>
      <Link to={'/login'}><button className="loginButton">Login</button></Link>

      <h1 className="title" style={{
        position: 'absolute',
        textAlign: 'left',
        width: '100%',
        color: 'white',
        fontFamily: 'Ubuntu',
        fontWeight: 'bold',
        marginTop: '5px',
        marginLeft: '5px'
        }}>Hangout Roulette
      </h1>
      <h1 className="header1" style={{
        position: 'absolute',
        textAlign: 'center',
        top: '30%',
        width: '100%',
        color: 'white',
        fontFamily: 'Ubuntu',
        fontWeight: 'bold'
      }}
      >Where Should We Go?</h1>
      <h2 className="header2" style={{
        position: 'absolute',
        textAlign: 'center',
        top: '40%',
        width: '100%',
        color: 'white',
        fontFamily: 'Ubuntu',
        fontWeight: 'bold'
      }}
      >Get help picking out a bar or restaurant wherever you are</h2>

      <h2 className="header3" style={{
        position: 'absolute',
        textAlign: 'center',
        top: '45%',
        width: '100%',
        color: 'white',
        fontFamily: 'Ubuntu',
        fontWeight: 'bold'
      }}>
        Save your favorite spots and add notes to remember for next time
      </h2>

      <Link to={'/register'}>
        <button className="getStarted">
          Get Started
        </button>
      </Link>

      <video className="video" id="background-video" autoPlay loop muted width="100%" height="100%">
        <source src={video} type="video/mp4" />
        <source src={video} type="video/ogg" />
        Your browser does not support the video tag.
      </video>

    </div>
  )
}
