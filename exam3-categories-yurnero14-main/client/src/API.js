import Round from "./Round";
import Resp from "./Resp";

const SERVER_URL = "http://localhost:3001";

//create Round and Response

const createRound = async (round) => {
  const response = await fetch(SERVER_URL + "/api/RoundAndResponse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      category: round.category,
      difficulty: round.difficulty,
    }),
  });

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

const API = { createRound, logIn, getUserInfo, logOut };
export default API;
