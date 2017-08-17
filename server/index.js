// const LocalStrategy = require('passport-local').Strategy;
const {BasicStrategy} = require('passport-http');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const bcrypt = require('bcrypt');
// bcrypt js?? ^

const {User} = require('./models');
const app = express();

mongoose.connect('mongodb://localhost:27017/hangout-roulette-users')

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));

// API endpoints go here!

// create users
app.post('/api/register', (req, res) => {
  console.log(req.body)
  if (!req.body) {
    return res.status(400).json({message: "No request body"});
  }

  if (!('username' in req.body)) {
    return res.status(422).json({message: 'Missing field: username'});
  }

  let {username, password} = req.body;

  if (typeof username !== 'string') {
    return res.status(422).json({message: 'Incorrect field type: username'});
  }

  username = username.trim();
  if (username === '') {
    return res.status(422).json({message: 'Incorrect field length: username'});
  }

  if (!(password)) {
    return res.status(422).json({message: 'Missing field: password'});
  }

  if (typeof password !== 'string') {
    return res.status(422).json({message: 'Incorrect field type: password'});
  }
  password = password.trim();

  if (password === '') {
    return res.status(422).json({message: 'Incorrect field length: password'});
  }

  return User
  .find({username})
  .count()
  .exec()
  .then(count => {
    if (count > 0) {
      return res.status(422).json({message: 'Username already taken'});
    }

  return User.hashPassword(password)
  })
  .then(hash => {
     return User
    .create({
      username: username,
      password: hash
    })
  })
    .then(user => {
      res.json(user)
    })
});

const basicStrategy = new BasicStrategy((username, password, callback) => {
	let user;
	User
		.findOne({username: username})
		.exec()
		.then(_user => {
			user = _user;
			if (!user) {
				return callback(null, false, {message: 'Incorrect username'});
			}
			return user.validatePassword(password);
		})
		.then(isValid => {
			if (!isValid) {
				return callback(null, false, {message: 'Incorrect password'});
			}
			else {
				return callback(null, user);
			}
		})
		.catch(err => console.log('Invalid username or password'))
});

app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true
}));

passport.use(basicStrategy);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

const isAuthenticated = (req, res, next) => {
  if(req.user) {
    next()
  }
  else {
  res.redirect('/')
  }
}

// login endpoint
app.get('/api/me',
  passport.authenticate('basic', { session: true }),
  function(req, res) {
    res.json(req.user);
  });

// logout endpoint
app.get('/api/logout', function(req, res) {
  req.session.destroy(function (err) {
  	if(err){
  		res.send(err);
  		}
  		res.json({loggedOut : true})
    	});
  });


// Serve the built client
app.use(express.static(path.resolve(__dirname, '../client/build')));

// Unhandled requests which aren't for the API should serve index.html so
// client-side routing using browserHistory can function
app.get(/^(?!\/api(\/|$))/, (req, res) => {
    const index = path.resolve(__dirname, '../client/build', 'index.html');
    res.sendFile(index);
});

let server;
function runServer(port=3001) {
    return new Promise((resolve, reject) => {
        server = app.listen(port, () => {
            resolve();
        }).on('error', reject);
    });
}

function closeServer() {
    return new Promise((resolve, reject) => {
        server.close(err => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}

if (require.main === module) {
    runServer();
}

module.exports = {
    app, runServer, closeServer
};
