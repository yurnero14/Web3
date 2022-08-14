'use strict';

const express = require('express');
const res = require('express/lib/response');
const {check, validationResult} = require('express-validator');
const morgan = require('morgan');
// const dao = require('./dao');
// const userDao = require('./dao/userDao');
const cors = require('cors');

//passport related imports
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');



// init express
const app = new express();
const port = 3001;

// set up the midddleware==>> Links the application needed for the web app
app.use(morgan('dev'));
app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials: true
};

passport.use(new LocalStrategy(async function verify(username, password, cb){
    const user = await userDao.getUser(username, password);
    if(!user){
        return cb(null, false, 'Incorrect username or password');
    }
    return cb(null, user);
}));

passport.serializeUser(function(user,cb){
  cb(null,user);
});

passport.deserializeUser(function(user,cb){
  cb(null,user);
});

app.use(session({
  secret: "shhhh...it's a secret",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.authenticate('session'));

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()){
    return next();
  }
  return res.status(401).json({error: 'Unauthorized'});
}

const errorFormatter = ({location, msg, param, value, nestedErrors}) => { 
  return `${location}[${param}]: ${msg}`;
}


// activate the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});