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


// this one doesnt need a payload really...

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
            pool.query("DELETE FROM Projects WHERE name=?",name, (err) => {
                if(err){
                    return resolve(400);
                }else{
                    return resolve(200);
                }
            });
        });
    };
    
    
    let getProjectsAndDeadlines = () => {
            return new Promise((resolve, reject) => {
                pool.query("SELECT * FROM Projects", (error, rows) => {
                    if (error) { return reject(error); }
                    let newRows = [];
                    if ((rows) && (rows.length >= 1)) {
                        for(let i = 0; i < rows.length; i++){
                            let project = []
                            project.push(rows[i].name);
                            project.push(rows[i].deadline);
                            project.push(rows[i].wallet);
                            project.push(rows[i].goal);
                            newRows.push(project);
                        }
                        return resolve(newRows);
                    } else {
                        return resolve(newRows); //no user found matching this username
                    }
                });
            });
    };
    
    
    //deadline is in the form "YYYY-MM-DD"
    let getDaysLeft = (deadline) => {
        const currDate = new Date();
        let currDay = currDate.getDate();
        let currMonth = currDate.getMonth() + 1;
        let currYear = currDate.getFullYear();
        
        var year = deadline.substring(0, 3);
        var month = deadline.substring(5, 6);
        var day = deadline.substring(8, 9);
        
        const deadlineDate = new Date();
        
        deadlineDate.setFullYear(year);
        deadlineDate.setMonth(month);
        deadlineDate.setDate(day);
        
        var Difference_In_Time = deadlineDate.getTime() - currDate.getTime();
        // To calculate the no. of days between two dates
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        
        return(Difference_In_Days);
        
    };
    
    
    let insertDonation = (projectName, amount, supporterName, pledgeName) => { //just inserts the donation into database
        
        return new Promise((resolve, reject) => {
            pool.query("INSERT INTO Donations (projectName,amount,supporterName,pledgeName,isDirectSupport) VALUES (?,?,?,?,?)", [projectName, amount, supporterName, pledgeName, false], (err) => {
                if (err) { 
                    return resolve("error refunding"); 
                }
                else {
                    return resolve("refunds successful");
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
    
    
    let getWallet = (username) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Users WHERE username=?", [username], (error, rows) => { //look for the user in the database
                if (error) { return reject(error); }
                if ((rows) && (rows.length == 1)) { 
                    //if the user exists, get its wallet
                    return resolve(rows[0].wallet);
                    
                } else {
                    // response.error("can't get wallet: user not found");
                    return resolve("user not found");
                }
            });
        });
    };
    
    let deletePledge = (name) => {
        return new Promise((resolve, reject) => {
            pool.query("DELETE FROM Pledges WHERE projectName=?", [name], (err) => {
                if (err) {
                    return resolve(400);
                }
                else {
                    return resolve(200);
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
        const projects = await getProjectsAndDeadlines();
        //2D array, each row is a project, column 0 is name and column 1 is date. column 2 is the wallet for the project, column 3 is the funding goal.
        
        let result = "no projects to delete!";
        
        for(let i = 0; i < projects.length; i++){
            if((getDaysLeft(projects[i][1]) < 0) && (projects[i][2] < projects[i][3])){  
            //if the days left are negative, the deadline has passed. AND if the wallet is less than the goal (we need to refund!)
                result = await deleteProject(projects[i][0]); //deletes the project
                let result2 = await deletePledge(projects[i][0]); //deletes the pledge
                //do all the refunds for that project
                
                let activity = await getProjectActivity(projects[i][0]); //returns a list of donations to the project
                for(let j = 0; j < activity.length; j++){ //for each donation associated with a reaped project
                    let donationResult = await insertDonation("refund", activity[j].amount, activity[j].supporterName, activity[j].pledgeName);
                    if(response.donationSuccess === "refunds successful" || response.donationSuccess == null){
                        response.donationSuccess = donationResult; //if theres an error make sure we catch it
                    }
                    let fetchedWallet = await getWallet(activity[j].supporterName); //get the users current wallet
                    let refundResult = await updateWallet(fetchedWallet + activity[j].amount, activity[j].supporterName); //refund the users
                }
            }
        }
        
        
        if(result === 400){
            response.statusCode = result;  
            response.error = "error deleting project(s)";
            return response;
        } else {
            if(result === 200) {
              response.statusCode = 200;
              //send back to user (message of success)
               response.msg = "successfully reaped project(s)";
            } else {
              response.statusCode = 200;
              response.msg = "no projects to reap";
            }
        //new change for test
        }
        
        return response;
        
    } catch (error) {
        console.log("ERROR: " + error);
        response.statusCode = 400;
        response.error = error;
        
        return response;
    }
    
};

