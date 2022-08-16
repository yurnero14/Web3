'use strict';

const db = require('./Db');
const axios = require('axios');
let sql;

sql = `CREATE TABLE IF NOT EXISTS colors(ID INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)`;
db.run(sql);
async function getData (url){
    
    const {data} = await axios.get(url);
    console.log(typeof(data));
    const array = data.split('\n');
    console.log(typeof(array));
    array.forEach((d)=>{
        let color = {
            name: d
        }
        console.log(color.name)
        let sqll = `INSERT INTO colors(name) VALUES(?)`;
        db.run(sqll, [color.name], (err)=>{
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
getData("https://gist.githubusercontent.com/mordka/c65affdefccb7264efff77b836b5e717/raw/e65646a07849665b28a7ee641e5846a1a6a4a758/colors-list.txt");