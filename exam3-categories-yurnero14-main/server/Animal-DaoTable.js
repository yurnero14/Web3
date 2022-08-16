'use strict';

const db = require('./Db');
const axios = require('axios');
let sql;

sql = `CREATE TABLE IF NOT EXISTS animals(ID INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)`;
db.run(sql);
async function getData (url){
    
    const {data} = await axios.get(url);
    console.log(typeof(data));
    const array = data.split('\n');
    console.log(typeof(array));
    array.forEach((d)=>{
        let animal = {
            name: d
        }
        console.log(animal.name)
        let sqll = `INSERT INTO animals(name) VALUES(?)`;
        db.run(sqll, [animal.name], (err)=>{
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
getData("https://raw.githubusercontent.com/sroberts/wordlists/master/animals.txt");