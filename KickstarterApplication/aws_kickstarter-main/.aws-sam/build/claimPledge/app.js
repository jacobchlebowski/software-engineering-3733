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
// {  body: '{    "supporterName" : "name",   "pledgeName" : "name"   }'
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
    let getPledgeCost = (value) => {
            return new Promise((resolve, reject) => {
                pool.query("SELECT * FROM Pledges WHERE name=?", [value], (error, rows) => {
                    if (error) { return reject(error); }
                    if ((rows) && (rows.length >= 1)) {
                        return resolve(rows[0].cost);
                    } else {
                        return resolve(null); //no user found matching this username
                    }
                });
            });
    };
    
    let getPledgeQuantity = (value) => {
            return new Promise((resolve, reject) => {
                pool.query("SELECT * FROM Pledges WHERE name=?", [value], (error, rows) => {
                    if (error) { return reject(error); }
                    if ((rows) && (rows.length >= 1)) {
                        return resolve(rows[0].quantity);
                    } else {
                        return resolve(null); //no user found matching this username
                    }
                });
            });
    };
    
    let getPledgeProject = (value) => {
            return new Promise((resolve, reject) => {
                pool.query("SELECT * FROM Pledges WHERE name=?", [value], (error, rows) => {
                    if (error) { return reject(error); }
                    if ((rows) && (rows.length >= 1)) {
                        return resolve(rows[0].projectName);
                    } else {
                        return resolve(null); //no user found matching this username
                    }
                });
            });
    };
    
    let getWallet = (username) => {
                return new Promise((resolve, reject) => {
                    pool.query("SELECT * FROM Users WHERE username=?", [username], (error, rows) => { //look for the user in the database
                        if (error) { return reject(error); }
                        if ((rows) && (rows.length === 1)) { 
                            //if the user exists, get its wallet
                            return resolve(rows[0].wallet);
                            
                        } else {
                            return resolve(null);
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
        const resultCost = await getPledgeCost(info.pledgeName);
        const resultQuantity = await getPledgeQuantity(info.pledgeName);
        const resultProjectName = await getPledgeProject(info.pledgeName);
        const fetchedWallet = await getWallet(info.supporterName);
        const pledgeSupporters = await getPledgeSupporters(info.pledgeName);
        // console.log("PLEDGESUPPORTERS HERE");
        // console.log(Object.keys(pledgeSupporters).length);
        
        
        if(resultCost != null){ //if we find the pledge
            if(Object.keys(pledgeSupporters).length < resultQuantity) {
                if(fetchedWallet != null) {
                    if(fetchedWallet >= resultCost) { //if we have enough money
                        //claim the pledge
                        let status = await insertDonation(resultProjectName, resultCost, info.supporterName, info.pledgeName);
                        //projectName, amount, supporterName, pledgeName
                        
                        if(status === 200) {
                            response.msg = "Pledge claimed successfully";
                            //insertion successful
                        } else {
                            response.statusCode = 400;
                            response.error = "Couldn't make donation";
                            return response;
                        }
                        
                        let resultUpdateWallet = await updateWallet(fetchedWallet - resultCost, info.supporterName);
                        let resultUpdateProjWallet = await updateProjectWallet(resultCost, info.projectName)
                        //update wallet (subtract the cost)
                        
                        if(resultUpdateWallet === 200) {
                            response.newWallet = fetchedWallet - resultCost;
                        } else {
                            response.statusCode = 400;
                            response.error = "Couldn't update wallet";
                            return response;
                        }
                        if(resultUpdateProjWallet === 200) {
                            response.statusCode = 200;
                            return response;
                        } else {
                            response.statusCode = 400;
                            response.error = "couldn't update project wallet";
                            return response;
                        }
                    } else {
                        response.statusCode = 400;
                        response.error = "insufficient funds";
                        return response;
                    }
                } else { //cant get wallet error
                    response.statusCode = 400;
                    response.error = "Couldn't fetch wallet";
                    return response;
                }
            } else {
                response.statusCode = 400;
                response.error = "Pledge out of stock";
                return response;
            }
        } else {
            response.statusCode = 400;
            response.error = "pledge not found";
            return response;
        }
        
    } catch (error) {
        console.log("ERROR: " + error);
        response.statusCode = 400;
        response.error = error;
        return response;
    }

};