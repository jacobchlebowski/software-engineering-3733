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

    // get raw value or, if a string, then get from database if exists.

    
    let deleteProject = (name) => {
        return new Promise((resolve,reject) => {
            pool.query("DELETE FROM Projects WHERE name=?",[name], (err) => {
                if(err){
                    return resolve(400);
                }else{
                    return resolve(200);
                }
            });
        });
    }
    
    
    let projectExists = (value) => {
            return new Promise((resolve, reject) => {
                pool.query("SELECT * FROM Projects WHERE name=?", [value], (error, rows) => {
                    if (error) { return reject(error); }
                    if ((rows) && (rows.length >= 1)) {
                        return resolve("project-name exists");
                    } else {
                        return resolve(null); //project does NOT EXIST, TEHREFORE CANNOT DELETE
                    }
                });
            });
    };
    
    
    // let designerExists = (value) => {
    //         return new Promise((resolve, reject) => {
    //             pool.query("SELECT * FROM Users WHERE username=?", [value], (error, rows) => {
    //                 if (error) { return reject(error); }
    //                 if ((rows) && (rows.length >= 1)) {
    //                     return resolve(value) //designer with username exists
    //                 } else {
    //                     return resolve("designer does not exist"); //designer does not exist
    //                 }
    //             });
    //         });
    // };
    
    
    
    try {
        //test
        // 1. Query RDS for the first constant value
        // 2. Query RDS for the second constant value
        // ----> These have to be done asynchronously in series, and you wait for earlier 
        // ----> request to complete before beginning the next one
        const name = await projectExists(info.name);
        
        if(info.confirm === 'confirm'){
            if(name === null){
                response.statusCode = 400;  
                response.error = "Project does not exist";
          
            return response;
            } else {
                let status = await deleteProject(info.name);
                if(status === 200) {
                  response.statusCode = 200;
                  //send back to user (message of success)
                   response.msg = "successfully deleted project";
                } else {
                      response.statusCode = 400;
                      response.msg = "database error";
                    }
            
            return response;
            //new change for test
            }
        } else{
            //user did NOT type 'confirm' to delete project
            response.statusCode = 400;
            response.error = "user did not type in confirm"
            return response;
        }
    
        
        
    } catch (error) {
        console.log("ERROR: " + error);
        response.statusCode = 400;
        response.error = error;
        
        return response;
    }
    
};

