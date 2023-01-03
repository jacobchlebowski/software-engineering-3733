// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
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
// {  body: '{    "projectName" : "project1",   "name" : "pledgeName",   "reward" : "aDescription",   "cost" : "19.00",   "quantity" : "5"   }'
//
// }

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
    let checkForPledge = (value) => {
            return new Promise((resolve, reject) => {
                pool.query("SELECT * FROM Pledges WHERE name=?", [value], (error, rows) => {
                    if (error) { return reject(error); }
                    if ((rows) && (rows.length >= 1)) {
                        return resolve("pledge found");
                    } else {
                        return resolve(null); //no user found matching this username
                    }
                });
            });
    };
    
    let checkForProject = (value) => {
            return new Promise((resolve, reject) => {
                pool.query("SELECT * FROM Projects WHERE name=?", [value], (error, rows) => {
                    if (error) { return reject(error); }
                    if ((rows) && (rows.length >= 1)) {
                        return resolve("project found");
                    } else {
                        return resolve(null); //no user found matching this username
                    }
                });
            });
    };
    
 
    
    


    let insertPledge = (projectName, name, reward, cost, quantity,username) => {
        
        return new Promise((resolve, reject) => {
            pool.query("INSERT INTO Pledges (projectName,name,reward,cost,quantity,username) VALUES (?,?,?,?,?,?)", [projectName, name, reward, cost, quantity,username], (err) => {
                if (err) { 
                    return resolve(400); 
                }
                else {
                    return resolve(200);
                }
            });            
        });
            
    };
    
    
    try {
        
        // 1. Query RDS for the first constant value
        // 2. Query RDS for the second constant value
        // ----> These have to be done asynchronously in series, and you wait for earlier 
        // ----> request to complete before beginning the next one
        const pledgeIfFound = await checkForPledge(info.name);
        const projectIfFound = await checkForProject(info.projectName);
        
        if(pledgeIfFound == "pledge found"){
            response.statusCode = 400;  
            response.error = "Pledge already exists";
        } else if(projectIfFound == null) {
            response.statusCode = 400;  
            response.error = "Project not found";
        } else {
            //otherwise SUCCESS! Username does not exist, and we can make a pledge...INTO DATABASE
            let status = await insertPledge(info.projectName, info.name, info.reward, info.cost, info.quantity,info.username);
            
            if(status === 200) {
                response.statusCode = 200;
                response.projectName = info.projectName;
                response.name = info.name;
                response.reward = info.reward;
                response.cost = info.cost;
                response.quantity = info.quantity;
                response.username = info.username;
            } else {
                response.statusCode = 400;
                response.error = "database error"
            }
        }
    } catch (error) {
        console.log("ERROR: " + error);
        response.statusCode = 400;
        response.error = error;
    }
    
    // full response is the final thing to send back
    return response;
};