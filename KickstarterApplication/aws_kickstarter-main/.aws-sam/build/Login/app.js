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
// {  body: '{    "username" : "name",   "password" : "Apassword",   "type" : "usertype"   }'
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

    // searches database for a username, and if found, checks if the password matches
    let CheckForUser = (name, password) => {
            return new Promise((resolve, reject) => {
                pool.query("SELECT * FROM Users WHERE username=?", [name], (error, rows) => { //look for the user in the database
                    if (error) { return reject(error); }
                    if ((rows) && (rows.length == 1)) { 
                        //if the user exists, check its password
                        if(rows[0].password === password){ //if password correct
                            return resolve(rows[0].typeOfUser); //return the found type of the user
                        } else { //if password incorrect
                            return reject("incorrect password");
                        }
                        
                    } else {
                        return reject("user not found");
                    }
                });
            });
    };
    
    try {
        
        // 1. Query RDS for the first constant value
        // 2. Query RDS for the second constant value
        // ----> These have to be done asynchronously in series, and you wait for earlier 
        // ----> request to complete before beginning the next one
        const output = await CheckForUser(info.username, info.password); //returns the type of the user if success, otherwise was an error
        let type;
        let promiseerror;
        
        // check for errors
        if (output === "incorrect password") {
            response.statusCode = 400;
            response.error = "Incorrect password";
        } else if(output === "user not found"){
            response.statusCode = 400;
            response.error = "Username " + info.username + " not found!";
        } else {
            // otherwise SUCCESS!
            response.statusCode = 200;
            response.username = info.username;
            response.type = info.typeOfUser;
        }
    } catch (error) {
        console.log("ERROR: " + error);
        response.statusCode = 400;
        response.error = error;
    }
    
    
    // full response is the final thing to send back
    return response;
}