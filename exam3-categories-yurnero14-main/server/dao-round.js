'use strict';

const db = require('./Db');

function generateRandomLetter(){
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    return letters[Math.floor(Math.random() * letters.length)];
}


exports.createRound = (round) =>{
    return new Promise((resolve, reject)=>{
        
    })

}