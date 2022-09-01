import Round from "./Round";
import Resp from "./Resp";

const SERVER_URL = "http://localhost:3001";

//create Round and Response

const createRound = async (params) => {
  const response = await fetch(SERVER_URL + "/api/RoundAndResponse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      category: params.category,
      difficulty: params.difficulty,
    }),
  });
console.log("I am here");
  if (!response.ok) {
    const errMessage = await response.json();
    throw errMessage;
  } else return null;
};

const logIn = async (credentials) => {
    console.log(credentials);
  const response = await fetch(SERVER_URL + "/api/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(credentials),
    
  });
  console.log(response);

  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetails = await response.text();
    throw errDetails;
  }
};

const getUserInfo = async () => {
  const response = await fetch(SERVER_URL + "/api/sessions/current", {
    credentials: "include",
  });
  const user = await response.json();
  if (response.ok) {
    return user;
  } else {
    throw user;
  }
};

const logOut = async () => {
  const response = await fetch(SERVER_URL + "/api/sessions/current", {
    method: "DELETE",
    credentials: "include",
  });
  if (response.ok) return null;
};

const getAllrounds = async()=>{
  const response = await fetch(SERVER_URL + '/api/rounds');
  const roundJson = await response.json();
  if(response.ok){
    return roundJson.map(r=>new Round(r.id, r.cat_Id, r.letter, r.difficulty, r.StartTime));
  }
  else
    throw roundJson;
}

const API = { createRound, logIn, getUserInfo, logOut, getAllrounds };
export default API;
