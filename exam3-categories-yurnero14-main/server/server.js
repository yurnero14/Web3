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
const catDao = require('./Category_data-dao');
const uti = require('./utilities');
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


function getFirstLetters(str) {
    const firstLetters = str
      .split(',')
      .map(word => word[0])
      .join('');

    return firstLetters;
}


const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials: true
};

// passport.use(new LocalStrategy(async function verify(username, password, cb){
//     const user = await userDao.getUser(email, password);
//     if(!user){
//         return cb(null, false, 'Incorrect email or password');
//     }
//     return cb(null, user);
// }));

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
},
async function verify(email, password, cb){
  const user = await userDao.getUser(email, password);
  if(!user){
    return cb(null, false, 'Incorrect email or password');
  }
  return cb(null, user);
}))

passport.serializeUser(function(user, cb){
  cb(null,user);
});

passport.deserializeUser(function(user, cb){
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
    // console.log(req.body)
    req.login(user, (err) => {
      if(err)
      {
        return next(err);
      }
      return res.json(req.user.email);
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

app.post('/api/RoundAndResponse', isLoggedIn, async(req,res)=>{
  const errors = validationResult(req).formatWith(errorFormatter);
  if(!errors.isEmpty()){
    return res.status(422).json({errors: errors.array().join(', ')});
  }
  // console.log(req.body);
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

      //TImestamp updation TODO
      const result = await rDao.createRound(round);
      // const resp = await resDao.createResponse(req.user.id, );
      // console.log(typeof(result));
      // const b= parseInt(result);
      const resp = {
        user_id: req.user.id,
        round_id: result.id,
      }
      // console.log(b);
      // console.log(typeof(b));
      const reso = await resDao.createResponse(resp);

      // await resDao.createResponse(resp);
      // console.log(reso);
      result["resp_id"] = reso.id;
      result["user_id"] = reso.user_id;
      console.log(result);
      res.json(result);

    }
  }
  catch(err){
    res.status(503).json();
    console.log(err);
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

app.put('/api/answer/:respId', isLoggedIn, async(req, res)=>{
  const reso= await resDao.getResponse(req.params.respId);
  const round = await rDao.getRound(reso.round_id);
  console.log("round is:", round);
  const data = await catDao.getAllCategoryDataBycatId(round.cat_Id);
  const count = await rDao.countRoundId(round.cat_Id, round.letter);
  const listofRounds= await rDao.getRoundList(round.cat_Id, round.letter);
  const listofUserRounds = await resDao.getRoundsPlayedByUser(req.user.id);
  // const listofuserResp = await resDao.getAllanswersfromRoundandUserid(round_id, req.user.id);
  let allresp = [];
  for(let i=0; i<listofRounds.length; i++){
    let resp = {answers: await resDao.getAllanswerfromRoundid(listofRounds[i].id)//(listofRounds[i].id);
  }
    console.log("id is:", listofRounds[i].id);
    console.log("resp is:", resp.answers);
    let stringofansw =resp.answers
    console.log("douche bag is :", stringofansw)
    console.log("the lenght is :", stringofansw.length);
    let length=stringofansw.length;
    
    if(stringofansw[0].answers!==null){
    console.log(stringofansw[0].answers);
    console.log("String of answ is:",stringofansw[0].answers);

    if(stringofansw[0].answers!==null){
    // let dummy = stringofansw[0].answers;
    // console.log("Dummy is:", dummy);
    let words = await uti.stringToarray(stringofansw[0].answers);
    for(let j=0; j<words.length; j++){
      allresp.push(words[j]);
      console.log("success");
    }
  }
}
    else if(stringofansw[0].answers===null){
      allresp=allresp;
    }
    // console.log(typeof(stringofansw[0].answers));
    // allresp.push(stringofansw[0].answers);
  }
  console.log('all resp are:', allresp);
  let userResp =[];
  console.log("List of rounds:",listofRounds);
  console.log("rounds played by User:", listofUserRounds);
  let idArr=[];
  for(let i=0; i<listofRounds.length; i++){
    idArr.push(listofRounds[i].id);
  }
  const notplayedbyuser=idArr.filter(r=>!listofUserRounds.includes(r));
  console.log("not played by user", notplayedbyuser);
  const respnotofuser=[];
  for(let i=0; i<notplayedbyuser.length; i++){
    const resp = {answers: await resDao.getAllanswerfromRoundid(notplayedbyuser[i])}//(listofRounds[i].id);
    let stringofansw =resp.answers
    // respnotofuser.push(resp.answers);
    let words = await uti.stringToarray(stringofansw[0].answers);
    for(let j=0; j<words.length; j++){
      respnotofuser.push(words[j]);
    }
    console.log(typeof(stringofansw[0].answers));
  }

  console.log("resp not of user: ", respnotofuser)
//getting rounds that are played by user 
let same=[]
for(let i=0; i<listofRounds.length; i++){
  for(let j=0; j<listofUserRounds.length;j++){
    if(listofRounds[i].id == listofUserRounds[j]){
      same.push(listofRounds[i].id);
    }
  }
}

console.log("same is:", same);

//  for(let i=0; i<listofRounds.length; i++){
//     const resp = await resDao.getAllanswersfromRoundandUserid(listofRounds[i].id, req.user.id)//(listofRounds[i].id);
//     userResp.push(resp.answers);
//  }
 for(let i = 0; i<same.length; i++){
  const resp= await resDao.getAllanswersfromRoundandUserid(same[i], req.user.id);
  // console.log("Yeh kia hai: ", resp);
  let stringofansw =resp;
  console.log(stringofansw);
  console.log(typeof(stringofansw));
  // console.log("Yeh bhi kuch hai:", stringofansw[0]);
  if(stringofansw[0]===null){
    userResp=userResp;
  }
  else{
  // let words=await uti.stringToarray(stringofansw);
  //console.log("Yeh words hain:", words);
  for(let j=0; j<stringofansw.length; j++){
    userResp.push(stringofansw[j]);
  }
}
  // userResp.push(resp.answers); //user kay similar round kay answer agye 
 }
 let userRespstring=userResp.toString();
 console.log(userRespstring);
 userResp=uti.stringToarray(userRespstring);
 console.log("User responses are: ", userResp);
  let score = 0;
  // 1-get response, 2- get round object using rounid (GET ROUND) 3- check for time expoiry
  //4-calculate score 5- Insert answer and score
  // console.log(req.user.id);
  // console.log(req.body.answers);
  // const letter = await rDao.getLetter(req.params.roundId);
  // if(Math.floor(Date.now()/1000)-round.StartTime>=60){
  //   return res.status(422).json({error: `Round has expired`})
  // }

  // {"answers" : "sarib, bhai, barhy"}
  const RoundExpiry = uti.TimeExpiry(round.StartTime);
  if(RoundExpiry>=60){
    return res.status(422).json({error: `Round has expired`})
  }
  const anssss= await uti.stringToarray(req.body.answers);
  const ans = uti.removeduplicates(anssss);

  console.log("answers given:", anssss);
  console.log("removing dups:", ans);

  try{
    if(Object.keys(req.body).length ===0){
      return res.status(422).json({error: `Empty body request`})
    }
    if(req.body.answers.length===0 || req.body.answers.length < 2){
      return res.status(422).json({error: `Incomplete answer`})
    }
    

    else{
      // const respId = await resDao.getResponseId(req.user.id, req.params.roundId); //this is just checking
      const fl= 0;
      console.log(round.difficulty);
      console.log(ans.length);
      console.log(ans[0][0].toLowerCase());
      // console.log(data);
      if(round.difficulty===1 && ans.length<2){
        score=0;
        return res.status(422).json({error: `Incomplete answer`})
      }
      
      if(round.difficulty===1 && ans.length>=2){
      for(let i=0; i<ans.length; i++){
        if(ans[i][fl].toLowerCase()===round.letter && data.some(x=>x.Data===ans[i])===true){
          if(count<2){
            console.log("I am here");
            score=score + 5;
          }
          //if count >2 tou phir check krna hai kay response jo hai wo pehle exist krta hai ya nai letter aur category ko 
          // use krkay saray rounds ki list nikal lo aur ab is list pr foreach chala kr responses bulao un responses mein 
          //apna answers check kro 
          //all resp has all resps from relevant rounds
          //userresps has particular useresps on relevant rounds 
          if(count>2 && (allresp.some(x=>x.some(y=>y===ans[i])))===false ){
            score=score + 10;
          }
          if(count>2 && (allresp.some(x=>x.some(y=>y===ans[i])))===true && (userResp.some(x=>x.some(y=>y===ans[i])))===false){
            score=score + 5;
          }
          // if(count>2 && (allresp.some(x=>x.some(y=>y==ans[i])))===true && (userResp.some(x=>x.some(y=>y==ans[i])))===true){
          //   score=score + 0;
          // }
          if(count>2 && notplayedbyuser===[]){
            score=score+10
          }
          if(count>2 && respnotofuser.some(x=>x.some(y=>y===ans[i]))===true){
            score=score+5
          }

        }
        else{
          score=score + 0;
        }

      }}
      else if(round.difficulty===2 && ans.length<3){
        score=0;
        return res.status(422).json({error: `Incomplete answer`})
      }
      else if(round.difficulty===2 && ans.length>=3){
        for(let i=0; i<ans.length; i++){
          if(ans[i][fl].toLowerCase()==round.letter && data.some(x=>x.Data==ans[i])===true){
            if(count<2){
              score=score + (5*2);
            }
            //if count >2 tou phir check krna hai kay response jo hai wo pehle exist krta hai ya nai letter aur category ko 
            // use krkay saray rounds ki list nikal lo aur ab is list pr foreach chala kr responses bulao un responses mein 
            //apna answers check kro 
            //all resp has all resps from relevant rounds
            //userresps has particular useresps on relevant rounds 
            if(count>2 && (allresp.some(x=>x.some(y=>y==ans[i])))===false ){
              score=score + (10*2);
            }
            if(count>2 && (allresp.some(x=>x.some(y=>y==ans[i])))===true && (userResp.some(x=>x.some(y=>y==ans[i])))===false){
              score=score + (5*2);
            }
            // if(count>2 && (allresp.some(x=>x.some(y=>y==ans[i])))===true && (userResp.some(x=>x.some(y=>y==ans[i])))===true){
            //   score=score + 0;
            // }
            if(count>2 && notplayedbyuser===[]){
              score=score+(10*2)
            }
            if(count>2 && respnotofuser.some(x=>x.some(y=>y==ans[i]))===true){
              score=score+(5*2)
            }
  
          }
          else{
            score=score + 0;
          }
  
        }

      }
      else if(round.difficulty===3 && ans.length<4){
        score=0;
        return res.status(422).json({error: `Incomplete answer`})
      }
      else if(round.difficulty===3 && ans.length>=4){
        for(let i=0; i<ans.length; i++){
          if(ans[i][fl].toLowerCase()===round.letter && data.some(x=>x.Data==ans[i])===true){
            if(count<2){
              score=score + (5*3);
            }
            //if count >2 tou phir check krna hai kay response jo hai wo pehle exist krta hai ya nai letter aur category ko 
            // use krkay saray rounds ki list nikal lo aur ab is list pr foreach chala kr responses bulao un responses mein 
            //apna answers check kro 
            //all resp has all resps from relevant rounds
            //userresps has particular useresps on relevant rounds 
            if(count>2 && (allresp.some(x=>x.some(y=>y==ans[i])))===false ){
              score=score + (10*3);
            }
            if(count>2 && (allresp.some(x=>x.some(y=>y==ans[i])))===true && (userResp.some(x=>x.some(y=>y==ans[i])))===false){
              score=score + (5*3);
            }
            // if(count>2 && (allresp.some(x=>x.some(y=>y==ans[i])))===true && (userResp.some(x=>x.some(y=>y==ans[i])))===true){
            //   score=score + 0;
            // }
            if(count>2 && notplayedbyuser===[]){
              score=score+(10*3)
            }
            if(count>2 && respnotofuser.some(x=>x.some(y=>y==ans[i]))===true){
              score=score+(5*3)
            }
  
          }
          else{
            score=score + 0;
          }
  
        }

      }
      else if(round.difficulty===4 && ans.length<6){
        score=0;
        return res.status(422).json({error: `Incomplete answer`})
      }
      else if(round.difficulty===4 && ans.length>=6){
        for(let i=0; i<ans.length; i++){
          if(ans[i][fl].toLowerCase()===round.letter && data.some(x=>x.Data==ans[i])===true){
            if(count<2){
              score=score + (5*4);
            }
            //if count >2 tou phir check krna hai kay response jo hai wo pehle exist krta hai ya nai letter aur category ko 
            // use krkay saray rounds ki list nikal lo aur ab is list pr foreach chala kr responses bulao un responses mein 
            //apna answers check kro 
            //all resp has all resps from relevant rounds
            //userresps has particular useresps on relevant rounds 
            if(count>2 && (allresp.some(x=>x.some(y=>y==ans[i])))===false ){
              score=score + (10*4);
            }
            if(count>2 && (allresp.some(x=>x.some(y=>y==ans[i])))===true && (userResp.some(x=>x.some(y=>y==ans[i])))===false){
              score=score + (5*4);
            }
            // if(count>2 && (allresp.some(x=>x.some(y=>y==ans[i])))===true && (userResp.some(x=>x.some(y=>y==ans[i])))===true){
            //   score=score + 0;
            // }
            if(count>2 && notplayedbyuser===[]){
              score=score+(10*4)
            }
            if(count>2 && respnotofuser.some(x=>x.some(y=>y==ans[i]))===true){
              score=score+(5*4)
            }
  
          }
          else{
            score=score + 0;
          }
  
        }

      }
      // let ArrayString = req.body.answers[0].toString();
      // for(let i=1; i<req.body.answers.length; i++){
      //   ArrayString = ArrayString + "," + req.body.answers[i];
      // }
      /*BHai list nai save horhi*/
      // console.log(typeof(req.body.answers));
      // req.body.answers.forEach(element =>{
      //   if(element[0]!==round.letter){
      

      //   }
      // })
      console.log("i am hereeee");
      console.log(score);
      
      const anstring=ans.toString();
      
      console.log(anstring);
      const result = await resDao.storeAnswers(req.params.respId, anstring); // still no idea how to retrieve round id from round table
      // if(result[0])
      console.log(result);
      const point= await resDao.storeScore(score, req.params.respId);
      console.log("mein yahan hu");
      console.log(point);
      return res.status(200).json({answers:result, score: point});
    }

  }
  catch(err){
    res.status(500).json();
  }

})

// app.put('/api/scoreCalc/:respId', isLoggedIn, async(req, res)=>{
//   const resp = await resDao.getroundId(req.params.respId);
//   const round = await rDao.getRound(resp.round_id);
//   const catData= await catDao.getAllCategoryData();
//   const count = await rDao.countRoundId(round.cat_Id, round.letter);
//   const answ = await resDao.getAllanswersfromroundId(resp.round_id);
//   const userlist = await resDao.getUserlist(resp.round_id);
//   const useresp = await resDao.getAllanswersbyUserId(req.user.id);
//   let score = 0;
//   if(round.difficulty===1){
//     if(resp.answers.length<2){
//       await resDao.storeScore(score,req.params.respId, req.user.id);
//       return res.status(422).json({error: `Incomplete answer`})
//     }
//     else{

//       resp.answers.forEach(element => {
//         if(catData.some(element)){
//           if(count<2){
//             score=score+5;

//           }
//           if((count>2 && answ.some(element)===false))
//           {
//             score=score+10;
//           }
//           if((count>2 && answ.some(element)===true && userlist.some(req.user.id)===false))
//           {
//             score=score+5;
//           }
//           if((count>2 && answ.some(element)===true && userlist.some(req.user.id)===true && useresp.some(element)===true))
//           {

//             score=score+10;
//           }




//         }
//         else{
//           score = score + 0;
//         }

//       });
//       const result = await resDao.storeScore(score,req.params.respId, req.user.id);
//       return res.status(200).json(result);
//     }
//   }

//   else if(round.difficulty===2){
//     if(resp.answers.length<3){
//       await resDao.storeScore(score,req.params.respId, req.user.id);
//       return res.status(422).json({error: `Incomplete answer`})
//     }
//     else{
//       resp.answers.forEach(element => {
//         if(catData.some(element)){
//           if(count<2){
//             score=score+(5*2);

//           }
//           if((count>2 && answ.some(element)===false))
//           {
//             score=score+(10*2);
//           }
//           if((count>2 && answ.some(element)===true && userlist.some(req.user.id)===false))
//           {
//             score=score+(5*2);
//           }
//           if((count>2 && answ.some(element)===true && userlist.some(req.user.id)===true && useresp.some(element)===true))
//           {

//             score=score+(10*2);
//           }

//         }
//         else{
//           score = score + 0;
//         }

//       });

//     }
//     const result = await resDao.storeScore(score,req.params.respId, req.user.id);
//     return res.status(200).json(result);

//   }
//   else if(round.difficulty===3){
//     if(resp.answers.length<4){
//       await resDao.storeScore(score,req.params.respId, req.user.id);
//       return res.status(422).json({error: `Incomplete answer`})
//     }
//     else{
//       resp.answers.forEach(element => {
//         if(catData.some(element)){
//           if(count<2){
//             score=score+(5*3);

//           }
//           if((count>2 && answ.some(element)===false))
//           {
//             score=score+(10*3);
//           }
//           if((count>2 && answ.some(element)===true && userlist.some(req.user.id)===false))
//           {
//             score=score+(5*3);
//           }
//           if((count>2 && answ.some(element)===true && userlist.some(req.user.id)===true && useresp.some(element)===true))
//           {

//             score=score+(10*3);
//           }

//         }
//         else{
//           score = score + 0;
//         }

//       });

//     }
//     const result = await resDao.storeScore(score,req.params.respId, req.user.id);
//     return res.status(200).json(result);

//   }

//   else if(round.difficulty===4){
//     if(resp.answers.length<6){
//       await resDao.storeScore(score,req.params.respId, req.user.id);
//       return res.status(422).json({error: `Incomplete answer`})
//     }
//     else{
//       resp.answers.forEach(element => {
//         if(catData.some(element)){
//           if(count<2){
//             score=score+(5*4);

//           }
//           if((count>2 && answ.some(element)===false))
//           {
//             score=score+(10*4);
//           }
//           if((count>2 && answ.some(element)===true && userlist.some(req.user.id)===false))
//           {
//             score=score+(5*4);
//           }
//           if((count>2 && answ.some(element)===true && userlist.some(req.user.id)===true && useresp.some(element)===true))
//           {

//             score=score+(10*4);
//           }

//         }
//         else{
//           score = score + 0;
//         }

//       });

//     }
//     const result = await resDao.storeScore(score,req.params.respId, req.user.id);
//     return res.status(200).json(result);

//   }



// })

// activate the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});