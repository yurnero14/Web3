'use strict';

const express = require('express');
const res = require('express/lib/response');
const {check, validationResult} = require('express-validator');
const morgan = require('morgan');
// const dao = require('./dao');
const userDao = require('./dao-users');
const cDao = require('./categories-dao');
const rDao = require('./dao-round');
const resDao = require('./dao-response');
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

function generateRandomLetter(){
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  return letters[Math.floor(Math.random() * letters.length)];
}

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials: true
};

passport.use(new LocalStrategy(async function verify(username, password, cb){
    const user = await userDao.getUser(email, password);
    if(!user){
        return cb(null, false, 'Incorrect email or password');
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
/***USER APIs ***/
app.post('/api/sessions', function (req, res, next){
  passport.authenticate('local', (err, user, info)=>{
    if(err)
    {
      return next(err);
    }
    if(!user){
      return res.status(401).json({error:info});
    }
    req.login(user, (err) => {
      if(err)
      {
        return next(err);
      }
      return res.json(req.user);
    });
  })(req, res, next);
});

app.get('/api/sessions/current', (req, res)=>{
  if(req.isAuthenticated()){
    res.status(200).json(req.user);
  }
  else{
    res.status(401).json({error: 'Not authenticated'});
  }
});

app.delete('/api/sessions/current', (req,res) =>{
  req.logout(()=>{
    res.status(200).json({});
  });
});
/*this one is just to check*/
app.get('/api/catidget/:category', async (req,res)=>{
  try{
    const cdId = await cDao.getCategoryId(req.params.category);
    if(cdId.error){
      res.status(404).json(cdId);
    }
    else{
      res.status(200).json(cdId);
      
    }
  }
  catch(err){
    res.status(500).end();
  }
  

});

app.post('/api/RoundAndResponse', async(req,res)=>{
  
  try{
    if(Object.keys(req.body).length === 0) {
      return res.status(422).json({error: `Empty body request`})
    }

    if(req.body.category==undefined || req.body.difficulty == undefined || req.body.difficulty > 4 || req.body.difficulty < 1){
      return res.status(422).json({error: 'Invalid input'});
    }
    const cdId = await cDao.getCategoryId(req.body.category);
    if(cdId.error){
      res.status(404).json(cdId);
    }
    else{
      const rand = generateRandomLetter();
      
      const round = {
        cat_Id: cdId,
        letter: rand,
        difficulty: req.body.difficulty,
        StartTime: Math.floor(Date.now() / 1000)
      }

      
      const result = await rDao.createRound(round);
      // const resp = await resDao.createResponse(req.user.id, );
      // console.log(typeof(result));
      const b= parseInt(result);
      const resp = {
        user_id: 1,
        round_id: b,
      }
      // console.log(b);
      // console.log(typeof(b));
      const reso = await resDao.createResponse(resp);
    
      // await resDao.createResponse(resp);
      res.json(result);
      
    }
  }
  catch(err){
    res.status(503).json();
  }

})

app.get('/api/roundId', async(req, res)=>{
  try{
    if(Object.keys(req.body).length === 0) {
      return res.status(422).json({error: `Empty body request`})
    }
    const cdId = await cDao.getCategoryId(req.body.category);
    if(cdId.error){
      res.status(404).json(cdId);
    }
    else{
      const result = await rDao.getRoundId(cdId, req.body.letter);
      return res.status(200).json(result);
    }
  }
  catch(err){
    res.status(501).json();
  }
})
// app.get('/api/roundIds', async(req, res)=>{
//   try{
//     const cdId = await cDao.getCategoryId(req.body.category);
//     if(cdId.error){
//       res.status(404).json(cdId);
//     }
//     else{
//       const result = await rDao.getRoundIds(cdId, req.body.letter);
//       return res.status(200).json(result);
//     }
//   }
//   catch(err){
//     res.status(501).json();
//   }
// })
app.get('/api/countRound', async(req, res)=>{
  try{
    if(Object.keys(req.body).length === 0) {
      return res.status(422).json({error: `Empty body request`})
    }
    if(req.body.category==undefined || req.body.letter==undefined ||req.body.letter.length !=1){
      return res.status(422).json({error: 'Invalid input'});
    }

    const cdId = await cDao.getCategoryId(req.body.category);
    if(cdId.error){
      res.status(404).json(cdId);
    }
    
    else{
      if(req.body.letter.toUpperCase()){
        req.body.letter = req.body.letter.toLowerCase();
      }
      const result = await rDao.countRoundId(cdId, req.body.letter);
      return res.status(200).json(result);
    }
    
  }
  catch(err){
    res.status(501).json();
  }
})
// activate the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});