import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import RegisterPage from './components/register-page';
import LoginPage from './components/login-page';
import {Link} from 'react-router';

class App extends Component {
  render() {
    return (
      <div className="App">
        <nav className="mainNav">
          <Link to={'/'}><button>Home</button></Link>
          <Link to={'/register'}><button>Register</button></Link>
          <Link to={'/login'}><button>Login</button></Link>
        </nav>

        <div>{this.props.children}</div>

      </div>
    );
  }
}

export default App;
