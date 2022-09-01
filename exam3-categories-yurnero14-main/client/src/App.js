import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useState,useEffect } from 'react';
import { BrowserRouter, Routes, Route,Navigate} from 'react-router-dom';
import { CategoryDefault,LoginRoute, FormRoute} from './components/AppRoutes';
import { Container, Row, Alert, Nav } from 'react-bootstrap';
import { LogoutButton } from './components/AuthComponents';

import API from './API';

function App() {
  const [round, setRound]=useState([]);
  const [params, setParams]= useState({Category:"", Difficulty:""});
  const [response, setResponse]=useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const[user, setUser]=useState(null);

  //getRound for checking


  const createRound = (params)=>{

    setParams(params);
    API.createRound(params);

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
  const handleGuestLogin = ()=>{
		try{
			const guest={
				id:0,
				name:'Guest',
			}
			setUser(guest)
			setLoggedIn(true)
		}catch(err){
			throw err
		}
	}
 const getAllrounds = async()=>{
  const rounds=await API.getAllrounds();
  setRound(rounds);

 }
 
 
 
 
 
  return (
    <Container className='App'>
     {loggedIn && <LogoutButton logout={handleLogout} /> }
     
     <BrowserRouter>
     <Routes>
      {/* <Route path='/login' element={
        loggedIn? <Navigate replace to ='/' />:<LoginRoute login = {handleLogin}/>
      }/> */}
      <Route path='/' element={
        loggedIn?<FormRoute round={round} params={params} createRound={createRound}/>:<Navigate to ="/login" replace/> 
      }>
      <Route path='*' element={<CategoryDefault/>}/>
      <Route index element= {<h2>Please, specify the path</h2>}/>
      </Route>
      <Route path="/login" element={!loggedIn ? <LoginRoute login={handleLogin} guestLogin={handleGuestLogin}/> : <Navigate replace to='/' />} />
     </Routes>

     </BrowserRouter>
     </Container>
  );
}

export default App;
