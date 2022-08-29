import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  CategoryDefault,
  LoginRoute,
  MainLayout,
	NotFound,
} from "./components/AppRoutes";
import { Container, Row, Alert, Nav } from "react-bootstrap";
import { LogoutButton } from "./components/AuthComponents";

import API from "./API";
import CreateRoundForm from "./components/CreateRound";
import ResponseForm from "./components/ResponseForm";
import Navigation from "./components/Navigation";
import HallOfFame from "./components/HallOfFame";
import MyScore from "./components/MyScore";

function App() {
	return (
	<BrowserRouter>
      <Container fluid className="App">
        <Routes>
          <Route path="/*" element={<Main/>} />
        </Routes>
      </Container>
   </BrowserRouter>
	);
}
function Main(){
	const [round, setRound] = useState([]);
  const [response, setResponse] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
	
	// for Hall of Fame
	const dummyScores =[
		{name: 'sarib',score:{animals:2,colors:4,countries:100}},
		{name: 'arham',score:{animals:4,colors:1,countries:12}},
		{name: 'anas',score:{animals:3,colors:5,countries:13}},
		{name: 'zayan',score:{animals:10,colors:2,countries:30}}
	]
  // for My Score
	const dummyScore={ animals: 1, colors: 2, countries: 4 }
	
	const findLeaders=(scores)=>{
		let animalsLeader={name:'',score:0}, colorsLeader={name:'',score:0}, countriesLeader={name:'',score:0};
		scores.map(obj=>{
			if(obj.score.animals>animalsLeader.score){
			 animalsLeader.score=obj.score.animals
			 animalsLeader.name=obj.name
			}
			if(obj.score.colors>colorsLeader.score){
			 colorsLeader.score=obj.score.colors
			 colorsLeader.name=obj.name
			}
			if(obj.score.countries>countriesLeader.score){
			 countriesLeader.score=obj.score.countries
			 countriesLeader.name=obj.name
			}
		})
		return {animalsLeader:animalsLeader, colorsLeader:colorsLeader, countriesLeader:countriesLeader}
	}
	const leaders = findLeaders(dummyScores)

  const createRound = (round) => {
    setRound((oldRounds) => [[...oldRounds, round]]);
    API.createRound(round);
  };

  useEffect(() => {
		const init = async () => {
			try {
				const user = await API.getUserInfo();  // here you have the user info, if already logged in
				setUser(user);
				setLoggedIn(true);
			} catch (err) {
				setUser(null);
				setLoggedIn(false);
			}
		};
		init();
	}, []);  // This useEffect is called only the first time the component is mounted.
	
	const handleLogin = async (credentials) => {
		try {
			const user = await API.logIn(credentials)
			setUser(user);
			setLoggedIn(true);
		} catch(err){
			throw err;
		}
	}
	const handleLogout = async () => {
		await API.logOut();
		setLoggedIn(false);
		setUser(null);
	}
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

  return (
    <>
        <Navigation logout = {handleLogout} user={user} loggedIn = {loggedIn} />
        
        <Routes>
          <Route path="/" element={
            loggedIn ? <CategoryDefault/>   : <Navigate to="/login" replace/>
          }>
            <Route index element={<MainLayout user={user} />}/>
            <Route path="*" element={<NotFound />} />
            <Route path="createRoundForm" element={<CreateRoundForm />} />
            <Route path="responseForm" element={<ResponseForm/>} />
            <Route path="myScore" element={<MyScore user={user} score={dummyScore}/>} />
            <Route path="hof" element={<HallOfFame leaders={leaders} />} />
          </Route>
          <Route path="/login" element={!loggedIn ? <LoginRoute login={handleLogin} guestLogin={handleGuestLogin}/> : <Navigate replace to='/' />} />
        
        </Routes>
      </>
  );
}
export default App;
