import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useState,useEffect } from 'react';
import { BrowserRouter, Routes, Route,Navigate} from 'react-router-dom';
import { CategoryDefault,LoginRoute } from './components/AppRoutes';
import { Container, Row, Alert, Nav } from 'react-bootstrap';
import { LogoutButton } from './components/AuthComponents';

import API from './API';

function App() {
  const [round, setRound]=useState([]);
  const [response, setResponse]=useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const[user, setUser]=useState(null);

  //getRound for checking


  const createRound = (round)=>{
    setRound(oldRounds =>[[...oldRounds, round]]);
    API.createRound(round);

  }

  useEffect(() => {
    const checkAuth = async () => {
      await API.getUserInfo(); // we have the user info here
      setLoggedIn(true);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if(loggedIn)
      console.log("logged in");
  },[loggedIn]);

  const handleLogin=async(credentials)=>{
    try{
      const user = await API.logIn(credentials);
      console.log(credentials);
      console.log(user);
      setUser(user);
      setLoggedIn(true);
      setMessage({msg: `Welcome, ${user.name}!`, type: 'success'});
    }
    catch(err){
      console.log(err);
      setMessage({msg: err, type: 'danger'});
    }
  };

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    // clean up everything
    setRound([]);
    setUser(null);
    setMessage('');
  };
 
 
 
 
 
 
 
  return (
    <Container className='App'>
     {loggedIn && <LogoutButton logout={handleLogout} /> }
     
     <BrowserRouter>
     <Routes>
      <Route path='/login' element={
        loggedIn? <Navigate replace to ='/' />:<LoginRoute login = {handleLogin}/>
      }/>
      <Route path='*' element={<CategoryDefault/>}/>
     </Routes>

     </BrowserRouter>
     </Container>
  );
}

export default App;
