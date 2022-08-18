'use strict';

const db = require('./Db');

exports.createResponse = (response) =>{
    return new Promise ((resolve, reject)=>{
        const sql = `INSERT into Responses(user_id, round_id) VALUES(?,?)`;
        db.run(sql,[response.user_id, response.round_id], (err)=>{
            if(err){
                reject(err);
                return;
            }
            else{
                resolve(response);
            }
        })
    })
}

// const res = {
//     user_id: 1,
//     round_id: 1
// }

// console.log((exports.createResponse(res)));

exports.getResponseId = (user_id, round_id) =>{
    return new Promise ((resolve, reject)=>{
        const sql = `SELECT id from Responses where user_id =? AND round_id = ?`;
        db.get(sql,[user_id, round_id], (err, row)=>{
            if(err){
                reject(err);
                return;
            }
            if(row === undefined){
                resolve({error: 'Response not found'});
            }
            else{
                resolve(row.id);
            }
        })
    })
}

exports.storeAnswers = (response_id, answers) =>{
    return new Promise ((resolve, reject)=>{
        const sql = `INSERT into Responses(answers) where response_id =? VALUES (?)`;
        for(let i = 0; i<answers.length; i++){
            db.run(sql, [response_id, answers[i]], (err)=>{
                if(err){
                    reject(err);
                    return;
                }
                else{
                    resolve(answers);
                }
            });
        }

    });
}
