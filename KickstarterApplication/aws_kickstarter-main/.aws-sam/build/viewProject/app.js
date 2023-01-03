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

    // get raw value or, if a string, then get from database if exists.
    let findProject = (value) => {
            return new Promise((resolve, reject) => {
                pool.query("SELECT * FROM Projects WHERE name=?", [value], (error, rows) => {
                    if (error) { return reject(error); }
                    if ((rows) && (rows.length >= 1)) {
                        
                        response.name = rows[0].name;
                        response.description = rows[0].description;
                        response.wallet = rows[0].wallet;
                        response.goal = rows[0].goal;
                        response.genre = rows[0].genre;
                        response.deadline = rows[0].deadline;
                        response.isLaunched = rows[0].isLaunched;
                        
                        return resolve(rows[0].name);
                        
                    } else {
                        return resolve(null); //no user found matching this username
                    }
                });
            });
    };
    
    
    
    let findProjectDesigner = (name,username) => {
            return new Promise((resolve, reject) => {
                pool.query("SELECT * FROM Projects WHERE name=? AND designer=?", [name,username], (error, rows) => {
                    if (error) { return reject(error); }
                    if ((rows) && (rows.length >= 1)) {
                        
                        response.name = rows[0].name;
                        response.description = rows[0].description;
                        response.wallet = rows[0].wallet;
                        response.goal = rows[0].goal;
                        response.genre = rows[0].genre;
                        response.deadline = rows[0].deadline;
                        response.isLaunched = rows[0].isLaunched;
                        
                        return resolve(rows[0].name);
                        
                    } else {
                        return resolve(null); //no user found matching this username
                    }
                });
            });
    };
    
    let getPledges = (projectName) => {
        return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM Pledges WHERE projectName=?", [projectName], (error, rows) => { //gets only that designer's projects
                    
                if (error) { return reject(error); }
                    let newRows = [];
                    for(let i =0; i < rows.length; i++){
                        let pledge = {
                            name: rows[i].name,
                            reward: rows[i].reward,
                            cost: rows[i].cost,
                            quantity: rows[i].quantity
                        };
                        
                        newRows.push(pledge);
                    }
                    return resolve(newRows);
            });
        });
    };
    
 
    let getPledgeSupporters = (value) => {
            return new Promise((resolve, reject) => {
                pool.query("SELECT * FROM Donations WHERE pledgeName=?", [value], (error, rows) => {
                    let newRows = [];
                    if (error) { return reject(error); }
                    if ((rows) && (rows.length >= 1)) {
                        for(let i = 0; i < rows.length; i++){
                            newRows.push(rows[i].supporterName);
                        }
                    }
                    return resolve(newRows);
                });
            });
    };
    
    try {
        
        // 1. Query RDS for the first constant value
        // 2. Query RDS for the second constant value
        // ----> These have to be done asynchronously in series, and you wait for earlier 
        // ----> request to complete before beginning the next one
        
        //if the user is a designer... 
        if(info.typeOfUser === "designer"){
            const nameDesigner = await findProjectDesigner(info.name,info.username);
            const projectPledges = await getPledges(info.name);
          
            
            response.supporters = [];
            for(let i = 0; i < projectPledges.length; i++){
                let supportersList = await getPledgeSupporters(projectPledges[i].name);
                response.supporters.push(supportersList); //projectPledges.supporters
            }
            
            
            if(nameDesigner === null){
                response.statusCode = 400;
                response.error = "Project for designer not found or designer has no projects";
            }else{
                response.statusCode = 200;
                response.pledges = projectPledges;
            }
        }
        else if(info.typeOfUser === "supporter") {
            //else THIS    
            const name = await findProject(info.name);
            const pledges = await getPledges(info.name);
            const projectPledges = await getPledges(info.name);

            response.supporters = [];
            for(let i = 0; i < projectPledges.length; i++){
                let supportersList = await getPledgeSupporters(projectPledges[i].name);
                response.supporters.push(supportersList); //projectPledges.supporters
            }
             if(name === null) {
                 response.statusCode = 400;  
                 response.error = "Project not found";
                } else {
                 //whatever sending back put into TOSTRING();
                    response.statusCode = 200;
                    response.pledges = pledges;
                    //send back to user (message of success)
                }
        }
        
        
    } catch (error) {
        console.log("ERROR: " + error);
        response.statusCode = 400;
        response.error = error;
    }
    
    

    //full response is the final thing to send back
    return response;
};