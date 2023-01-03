// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
let response;
const mysql = require('mysql');

var config = require('./config.json');
var pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

// https://www.freecodecamp.org/news/javascript-promise-tutorial-how-to-resolve-or-reject-promises-in-js/#:~:text=Here%20is%20an%20example%20of,message%20Something%20is%20not%20right!%20.
function query(conx, sql, params) {
    return new Promise((resolve, reject) => {
        conx.query(sql, params, function(err, rows) {
            if (err) {
                // reject because there was an error
                reject(err);
            } else {
                // resolve because we have result(s) from the query. it may be an empty rowset or contain multiple values
                resolve(rows);
            }
        });
    });
}


// Take in as input a payload.
//
// {  body: '{    "username" : "name",   typeOfUser" : "usertype"   }'
//
// }
//
// ===>  { "result" : "12" }
//
exports.lambdaHandler = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

   // ready to go for CORS. To make this a completed HTTP response, you only need to add a statusCode and a body.
    let response = {
        headers: {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*", // Allow from anywhere
            "Access-Control-Allow-Methods": "POST" // Allow POST request
        }
    }; // response


    let actual_event = event.body;
    let info = JSON.parse(actual_event);
    console.log("info:" + JSON.stringify(info)); //  info.arg1 and info.arg2

    // get raw value or, if a string, then get from database if exists.
    
    let getWallet = (username) => {
                         return new Promise((resolve, reject) => {
                             pool.query("SELECT * FROM Users WHERE username=?", [username], (error, rows) => { //look for the user in the database
                                 if (error) { return reject(error); }
                                 if ((rows) && (rows.length == 1)) {
                                     //if the user exists, get its wallet
                                     return resolve(rows[0].wallet);

                                 }
                                 else {
                                     return resolve(null);
                                 }
                             });
                         });
                     };
    
    
    
    let buildProjectList = (username, typeOfUser, genre) => {
            return new Promise((resolve, reject) => {
                
                switch(typeOfUser){
                        case "admin":
                            
                            pool.query("SELECT * FROM Projects", (error, rows) => { //gets all if user is an admin
                                if (error) { return reject(error); }
                                if ((rows) && (rows.length >= 1)) {
                                    let newRows = [];
                                    for(let i =0; i < rows.length; i++){
                                        newRows.push(rows[i].name);
                                    }
                                    return resolve(newRows);
                                } else {
                                    return resolve(null); //no projects found to display
                                }
                            });
                            
                        break;
                            
                        case "designer":
                            
                            pool.query("SELECT * FROM Projects WHERE designer=?", [username], (error, rows) => { //gets only that designer's projects
                    
                                if (error) { return reject(error); }
                                if ((rows) && (rows.length >= 1)) {
                                   let newRows = [];
                                    for(let i =0; i < rows.length; i++){
                                        newRows.push(rows[i].name);
                                    }
                                    return resolve(newRows);
                                } else {
                                    return resolve(null); //no projects found to display
                                }
                                
                            });
                            
                            break;
                            
                            
                        case "supporter":
                            
                            
                            //check genre requested to implement search
                            if(genre === "None") { //keyword genre to return all genres
                                pool.query("SELECT * FROM Projects WHERE isLaunched=1", [], (error, rows) => {
                                    if (error) { return reject(error); }
                                    if ((rows) && (rows.length >= 1)) {
                                        let newRows = [];
                                        for(let i =0; i < rows.length; i++){
                                            newRows.push(rows[i].name);
                                        }
                                        return resolve(newRows);
                                    } else {
                                        return resolve(null); //no projects found to display
                                    }
                                }); 
                            } else {
                                //return the projects matching the specified genre
                                
                                pool.query("SELECT * FROM Projects WHERE genre=? AND isLaunched=1", [genre], (error, rows) => { //gets only that designer's projects
                                    if (error) { return reject(error); }
                                    if ((rows) && (rows.length >= 1)) {
                                        let newRows = [];
                                        for(let i =0; i < rows.length; i++){
                                            newRows.push(rows[i].name);
                                        }
                                        return resolve(newRows);
                                    } else {
                                        return resolve(null); //no projects found to display
                                    }
                                
                            });
                                
                            }
                            
                        
                    }
                     
                
            });
    };
    
    
    
    try {
        
        // 1. Query RDS for the first constant value
        // 2. Query RDS for the second constant value
        // ----> These have to be done asynchronously in series, and you wait for earlier 
        // ----> request to complete before beginning the next one
        const projectList = await buildProjectList(info.username, info.typeOfUser, info.genre);
        const wallet = await getWallet(info.username);
        
        
        
        if(projectList === null) {
          response.statusCode = 200;  
          response.wallet = wallet;
          response.projectList = projectList;
          response.msg = "No projects found";
        }
        else{
            response.statusCode = 200;
            response.wallet = wallet;
            response.projectList = projectList;
            
        }
    } catch (error) {
        console.log("ERROR: " + error);
        response.statusCode = 400;
        response.error = error;
    }
    
    

    
    // full response is the final thing to send back
    return response;
};