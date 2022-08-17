// 'use strict';

// const db = require('./Db');
// const axios = require('axios');

// async function getData (url){
    
//     const {data} = await axios.get(url);
//     console.log(typeof(data));
//     const array = data.split('\n');
//     console.log(typeof(array));
//     array.forEach((d)=>{
//         let color = {
//             name: d
             
//         }
//         console.log(color.name)
//         let sqll = `INSERT INTO Category_Data(Data, cat_Id) VALUES(?,?) `;
//         db.run(sqll, [color.name, 3], (err)=>{
//             if(err)
//             {
//                 console.log(err);
//             }
//             else{
//                 console.log('success');
//             }
//         })
//     })
    
// }
// getData("https://gist.githubusercontent.com/mordka/c65affdefccb7264efff77b836b5e717/raw/e65646a07849665b28a7ee641e5846a1a6a4a758/colors-list.txt");

// 'use strict';

// const db = require('./Db');
// const axios = require('axios');

// async function getData (url){
    
//     const {data} = await axios.get(url);
//     console.log(typeof(data));
//     const array = data.split('\n');
//     console.log(typeof(array));
//     array.forEach((d)=>{
//         let animal = {
//             name: d
             
//         }
//         // console.log(color.name)
//         let sqll = `INSERT INTO Category_Data(Data, cat_Id) VALUES(?,?) `;
//         db.run(sqll, [animal.name, 1], (err)=>{
//             if(err)
//             {
//                 console.log(err);
//             }
//             else{
//                 console.log('success');
//             }
//         })
//     })
    
// }
// getData("https://raw.githubusercontent.com/sroberts/wordlists/master/animals.txt");




'use strict';

const db = require('./Db');
const axios = require('axios');

// async function getData (url){
    
//     const {data} = await axios.get(url);
//     console.log(typeof(data));
//     const array = data.split('\n');
//     console.log(typeof(array));
//     array.forEach((d)=>{
//         let country = {
//             name: d
             
//         }
//         // console.log(color.name)
//         let sqll = `INSERT INTO Category_Data(Data, cat_Id) VALUES(?,?) `;
//         db.run(sqll, [country.name, 2], (err)=>{
//             if(err)
//             {
//                 console.log(err);
//             }
//             else{
//                 console.log('success');
//             }
//         })
//     })
    
// }
// getData("https://gist.githubusercontent.com/dariusz-wozniak/656f2f9070b4205c5009716f05c94067/raw/b291d58154c85dad840859fef4e63efb163005b0/list-of-countries.txt");

// let sql = `DELETE FROM Category_Data WHERE id >=638`;
// db.run(sql, (err)=>{
//     if(err)
//     {
//         console.log(err);
//     }
//     else{
//         console.log('success');
//     }
// })