'use strict';

const db = require('./Db');
// const cDao = require('./categories-dao');

// function generateRandomLetter(){
//     const letters = 'abcdefghijklmnopqrstuvwxyz';
//     return letters[Math.floor(Math.random() * letters.length)];
// }

function Round (id,category,letter,difficulty)
{
    this.id = id;
    this.category = category;
    this.letter = letter;
    this.difficulty = difficulty;
}
exports.createRound = (round) =>{
    return new Promise((resolve, reject)=>{
        // const cdId = cDao.getCategoryId(category);
        // const rand = generateRandomLetter();
        const sql = `INSERT INTO rounds(cat_Id, letter, difficulty, StartTime) VALUES(?,?,?,?)`;
        db.run(sql, [round.cat_Id, round.letter, round.difficulty, round.StartTime], (err)=>{
            if(err){
                reject(err);
                return;
            }
            else{
                // const result = exports.getRound(this.lastID);
                resolve(exports.getRoundId(round.cat_Id, round.letter)); //this will give me the last inserted row 

            }
        });
    });

}

exports.getRoundId = (cat_Id, letter) =>{
    return new Promise ((resolve,reject)=>{
        const sql = `SELECT id from rounds where cat_Id =? and letter =?`;
        db.get(sql, [cat_Id, letter], (err, row)=>{
            if(err){
                reject(err);
                return;
            }
            if(row === undefined){
                resolve({error: 'Round not found'});
            }
            else {
                resolve(row.id);
            }
        } );

    })
}

// exports.getRoundIds = (cat_Id, letter) =>{
//     return new Promise ((resolve,reject)=>{
//         const sql = `SELECT * from rounds where cat_Id =? and letter =?`;
//         db.all(sql, [cat_Id, letter], (err, row)=>{
//             if(err){
//                 reject(err);
//                 return;
//             }
//             else{
//             const rounds = row.map((r)=>{
//                 new Round(r.id);
//             });
//             resolve(rounds);
//         } 
//         } );

//     })
// }

exports.countRoundId = (cat_Id, letter) =>{
    return new Promise ((resolve, reject)=>{
        const sql = `SELECT count(*) as count from rounds where cat_Id =? and letter =?`;
        db.get(sql, [cat_Id, letter], (err, row)=>{
            if(err){
                reject(err);
                return;
            }
            else{
                resolve(row.count);
            }
        } );
    })
}

exports.getRound = (id) =>{
    return new Promise ((resolve, reject)=>{
        const sql = `SELECT * from rounds where id =?`;
        db.get(sql, [id], (err, row)=>{
            if(err){
                reject(err);
                return;
            }
            else{
                resolve(row);
            }
        } );
    })
}