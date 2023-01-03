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
// {  body: '{    "projectName" : "name"   }'
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

    
    
    
    let findProject = (value) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Projects WHERE name=?", [value], (error, rows) => {
                if (error) { return reject(error); }
                if ((rows) && (rows.length >= 1)) {
                    return resolve(rows[0].name);
                } else {
                    return resolve(null); //no user found matching this username
                }
            });
        });
    };
    
    let getProjectActivity = (projectName) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Donations WHERE projectName=?", [projectName], (error, rows) => { //gets all if user is an admin
                if (error) { return reject(error); }
                if ((rows) && (rows.length >= 1)) {
                    let newRows = [];
                    for(let i =0; i < rows.length; i++){
                        let donation = {
                            projectName: rows[i].projectName,
                            amount: rows[i].amount,
                            pledgeName: rows[i].pledgeName,
                            isDirectSupport: rows[i].isDirectSupport,
                            supporterName: rows[i].supporterName
                        };
                    newRows.push(donation);
                    }
                    return resolve(newRows);
                } else {
                    return resolve(null); //no projects found to display
                }
            });
        });
    };
    
    
    try {
        
        // 1. Query RDS for the first constant value
        // 2. Query RDS for the second constant value
        // ----> These have to be done asynchronously in series, and you wait for earlier 
        // ----> request to complete before beginning the next one
        const resultProjectName = await findProject(info.name);
        const activity = await getProjectActivity(info.name);
        
        
        if(resultProjectName === null) {
          response.statusCode = 400;  
          response.error = "Project not found";
        } else {
            //whatever sending back put into TOSTRING();
            const activity = await getProjectActivity(info.name);
            response.statusCode = 200;
            response.activity = activity;
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