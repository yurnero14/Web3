'use strict';

const db = require('./Db');
const axios = require('axios');
let sql;

sql = `CREATE TABLE IF NOT EXISTS countries(ID INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)`;
db.run(sql);
async function getData (url){
    
    const {data} = await axios.get(url);
    console.log(typeof(data));
    const array = data.split('\n');
    console.log(typeof(array));
    array.forEach((d)=>{
        let country = {
            name: d
        }
        console.log(country.name)
        let sqll = `INSERT INTO countries(name) VALUES(?)`;
        db.run(sqll, [country.name], (err)=>{
            if(err)
            {
                console.log(err);
            }
            else{
                console.log('success');
            }
        })
    })
    
}
getData("https://gist.githubusercontent.com/dariusz-wozniak/656f2f9070b4205c5009716f05c94067/raw/b291d58154c85dad840859fef4e63efb163005b0/list-of-countries.txt");