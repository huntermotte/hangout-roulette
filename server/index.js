const {BasicStrategy} = require('passport-http');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const bcrypt = require('bcrypt');

const {User, Venue, Location} = require('./models');
const app = express();

mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/hangout-roulette-users')

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));
// API endpoints go here!

// create users
app.post('/api/register', (req, res) => {
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


// save venue data and notes in database
app.post('/api/venues', isAuthenticated, (req, res) => {
  let {name} = req.body
  // check to see that venue doesnt already exist
  return Venue.find({name: name, 'userID': req.user._id})
  .count()
  .exec()
  .then(count => {
    if (count > 0) {
      return res.status(422).json({message: 'Venue already saved'});
    }
  })
  .then(() => {
    return Venue.create({
      name,
      userID: req.user._id
    })
  })
  .then((venue, err) => {
    if(err) {
    res.send(err)
    }
    res.json(venue)
  })
  .catch(err => console.log(err))
})

  // put request to push notes into notes array
  app.put('/api/venues', isAuthenticated, (req, res) => {
    let {note} = req.body
    let {name} = req.body
    let data = {
      note,
      userID: req.user._id
    }

    return Venue.find({name: name, 'userID': req.user._id})
    .count()
    .exec()
    .then(count => {
      if (count > 0) {
        return Venue.update({name: name, 'userID': req.user._id}, {$push: {"notes": data}}, (err, data) => {
          if(err) {
            res.send(err)
          }
          else {
            Venue.findOne({name}, (err, venue) => {
              if(err) {
                res.send(err)
              }

              res.json(venue)
            })
          }
        })
      }

      else {
        return res.json({message: 'Please save venue first!'})
      }
    })


  })

  // check if venue exists and get its notes. do a count, if it exists return the venue and put it in the state. loop thru venue notes in the component
  app.post('/api/venues/notes', isAuthenticated, (req, res) => {
    let {name} = req.body

    return Venue.find({name: name, 'userID': req.user._id})
    .then(venue => {
      if (venue.length > 0) {
        return res.json(venue)
      }
      return res.json({message: 'No notes for this venue'})
    })
    .catch(err => console.log(err))
  })

  app.get('/api/venues', isAuthenticated, (req, res) => {
    return Venue.find({'userID': req.user._id}, (err, venues) => {
      if (err) {
        res.send(err)
      }
      res.json(venues)
    })
  })

  app.post('/api/location', isAuthenticated, (req, res) => {

    let {zip} = req.body
    parseInt(zip, 10)
    console.log('this should be the zip: ', zip)

    return Location.find({ZIP: zip}, (err, latLong) => {
      if (err) {
        res.send(err)
      }
      res.json(latLong)
    })
  })



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
