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
// {  body: '{    "supporterName" : "name",   "projectName" : "name",   "amount" : "19.00"   }'
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
    
    let getWallet = (username) => {
                return new Promise((resolve, reject) => {
                    pool.query("SELECT * FROM Users WHERE username=?", [username], (error, rows) => { //look for the user in the database
                        if (error) { return reject(error); }
                        if ((rows) && (rows.length == 1)) { 
                            //if the user exists, get its wallet
                            return resolve(rows[0].wallet);
                            
                        } else {
                            // response.error("can't get wallet: user not found");
                            return reject("user not found");
                        }
                    });
                });
        };
        
        
    let updateWallet = (wallet, username) => { //sets the supporter's wallet when claiming to a new lower amount
                return new Promise((resolve, reject) => {
                    pool.query("UPDATE Users SET wallet=? WHERE username=?", [wallet, username], (error, rows) => { //look for the user in the database
                        if (error) { return resolve(400); }
                        else { return resolve(200) }
                    });
                });
        };
        
        
    let updateProjectWallet = (amount, projname) => { //sets the projects's wallet when claiming to a new higher amount
            
                return new Promise((resolve, reject) => {
                pool.query("UPDATE Projects SET wallet=wallet + ? WHERE name=?", [amount, projname], (error, rows) => { //look for the user in the database
                    if (error) { return resolve(400); }
                    else { return resolve(200) }
                });
            });
    };


    let insertDonation = (projectName, amount, supporterName, pledgeName) => { //just inserts the donation into database
        
        return new Promise((resolve, reject) => {
            pool.query("INSERT INTO Donations (projectName,amount,supporterName,pledgeName,isDirectSupport) VALUES (?,?,?,?,?)", [projectName, amount, supporterName, pledgeName, false], (err) => {
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
        
        const fetchedWallet = await getWallet(info.supporterName);
        
        if(fetchedWallet >= info.amount){
            let resultUpdateWallet = await updateWallet(fetchedWallet - info.amount, info.supporterName); 
            //update wallet (take the funds)
            
            if(resultUpdateWallet === 200) {
                response.statusCode = 200;
                let status = await insertDonation(info.projectName, info.amount, info.supporterName, null);
                //projectName, amount, supporterName, pledgeName
                
                if(status === 200) {
                    response.statusCode = 200;
                    response.msg = "direct support succcessful"
                    //insertion successful
                } else {
                    response.statusCode = 400;
                    response.error = "Couldn't make donation"
                }
            } else {
                response.statusCode = 400;
                response.error = "Couldn't update wallet"
            }
            
            let resultUpdateProjWallet = await updateProjectWallet(info.amount, info.projectName)
            
            if (resultUpdateProjWallet === 200) {
                response.statusCode = 200;
            }
            else {
                response.statusCode = 400;
                response.error = "couldn't update project wallet";
            }

        } else { //cant get wallet error
            response.statusCode = 400;
            response.error = "Couldn't fetch wallet, or not enough funds"
        }
        
    } catch (error) {
        console.log("ERROR: " + error);
        response.statusCode = 400;
        response.error = error;
    }
    
    // full response is the final thing to send back
    return response;
};