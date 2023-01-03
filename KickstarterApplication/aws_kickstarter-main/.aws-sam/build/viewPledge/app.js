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
// {  body: '{    "name" : "name"   }'
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

    // get raw value or, if a string, then get from database if exists.
    let findPledge = (value) => {
            return new Promise((resolve, reject) => {
                pool.query("SELECT * FROM Pledges WHERE name=?", [value], (error, rows) => {
                    if (error) { return reject(error); }
                    if ((rows) && (rows.length >= 1)) {
                        
                        response.name = rows[0].name;
                        response.reward = rows[0].reward;
                        response.cost = rows[0].cost;
                        response.projectName = rows[0].projectName;
                        response.quantity = rows[0].quantity;
                        response.username = rows[0].username;
                        
                        return resolve(rows[0].name);
                        
                    } else {
                        return resolve(null); //no user found matching this username
                    }
                });
            });
    };
    
    let getPledgeSupporters = (value) => {
            return new Promise((resolve, reject) => {
                pool.query("SELECT * FROM Donations WHERE pledgeName=?", [value], (error, rows) => {
                    if (error) { return reject(error); }
                    let newRows = [];
                    if ((rows) && (rows.length >= 1)) {
                        
                        for(let i = 0; i < rows.length; i++){
                            newRows.push(rows[i].supporterName);
                        }
                    }
                    return resolve(newRows); //no user found matching this username
                });
            });
    };
 
    
    try {
        
        // 1. Query RDS for the first constant value
        // 2. Query RDS for the second constant value
        // ----> These have to be done asynchronously in series, and you wait for earlier 
        // ----> request to complete before beginning the next one
        const name = await findPledge(info.name);
        const pledgeSupporters = await getPledgeSupporters(info.name);
        
        if(name === null) {
          response.statusCode = 400;  
          response.error = "Project not found";
        } else {
            //whatever sending back put into TOSTRING();
            response.statusCode = 200;
            response.supporters = pledgeSupporters;
            //send back to user (message of success)
            
        }
    } catch (error) {
        console.log("ERROR: " + error);
        response.statusCode = 400;
        response.error = error;
    }
    
    

    //full response is the final thing to send back
    return response;
};