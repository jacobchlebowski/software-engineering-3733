const instance = axios.create ( {
    baseURL: 'https://olp7bebvoe.execute-api.us-east-1.amazonaws.com/Prod'
});


function createProject() {

    let name = document.getElementById("name")
    let desc = document.getElementById("description")
    let genre = document.getElementById("genre")
    let goal = document.getElementById("goal")
    let deadline = document.getElementById("deadline")

    const urlParams = new URLSearchParams(window.location.search) 
    let username = urlParams.get("username")

    //prepare payload
    let msg = {}
    msg["name"] = name.value
    msg["description"] = desc.value
    msg["designer"] = username
    msg["genre"] = genre.value
    msg["goal"] = goal.value
    msg["deadline"] = deadline.value
    let value = JSON.stringify(msg)

    let data = { 'body' : value }
    console.log(data);
    instance.post("/createProject",data).then(function (response) {
        //do something here
        console.log(response)
        location.reload()
    })
        .catch(function (error) {
            alert("Failed")
        })
}

function listProjects() {

    let projects = [];
    
    let msg = {}
    const urlParams = new URLSearchParams(window.location.search) 
    msg["username"] = urlParams.get("username")
    msg["typeOfUser"] = "designer"
    msg["genre"] = "None"
    let value = JSON.stringify(msg)
    let data = { 'body' : value }
    console.log(data)
    document.getElementById("projectList").innerHTML = ""

    instance.post("/listProjects",data).then(function (response) {
        //do something here
        if (400 === response.data.statusCode) {
        }
        else if (200 === response.data.statusCode) {
            console.log(response)
            let table = document.getElementById("projectList")
            // name, description, wallet, goal, deadline, isLaunched
            let defaultRow = table.insertRow(0)
            let defaultName = defaultRow.insertCell(0)

            defaultName.innerHTML = "name"

            let arr = Array.from(response.data.projectList)
            console.log(arr)
            for (let i = 0; i < arr.length; i++) {
                let row = table.insertRow(1)
                let cell = row.insertCell(0)
                cell.innerHTML = arr[i]
            }
        }

        // response.data.forEach()document.getElementById("projectsList")
    })
    .catch(function (error) {
        
    })
}

function viewProject() {

    let name = document.getElementById("view")
    //prepare payload
    let msg = {}

    const urlParams = new URLSearchParams(window.location.search) 
    let username = urlParams.get("username")
    
    msg["typeOfUser"] = "designer"
    msg["username"] = username
    msg["name"] = name.value
    let value = JSON.stringify(msg)

    let data = { 'body' : value }
    console.log(data);

    instance.post("/viewProject",data).then(function (response) {
        //do something here
        console.log(response)
        if (400 === response.data.statusCode) {
            alert(response.data.error)
          }
          else if (200 === response.data.statusCode) {
            let table = document.getElementById("details")
            table.innerHTML = ""
            let defaultRow = table.insertRow(0)
            let defaultName = defaultRow.insertCell(0)
            let defaultDescription = defaultRow.insertCell(1)
            let defaultWallet = defaultRow.insertCell(2)
            let defaultGenre = defaultRow.insertCell(3)
            let defaultGoal = defaultRow.insertCell(4)
            let defaultDeadline = defaultRow.insertCell(5)
            let defaultIsLaunched = defaultRow.insertCell(6)
            let defaultProgress = defaultRow.insertCell(7)

            defaultName.innerHTML = "name"
            defaultDescription.innerHTML = "description"
            defaultWallet.innerHTML = "wallet"
            defaultGenre.innerHTML = "genre"
            defaultGoal.innerHTML = "goal"
            defaultDeadline.innerHTML = "deadline" 
            defaultIsLaunched.innerHTML = "launched"
            defaultProgress.innerHTML = "progress"

            let row = table.insertRow(1)
            let name = row.insertCell(0)
            let description = row.insertCell(1)
            let wallet = row.insertCell(2)
            let genre = row.insertCell(3)
            let goal = row.insertCell(4)
            let deadline = row.insertCell(5)
            let launched = row.insertCell(6)
            let progress = row.insertCell(7)
            name.innerHTML = response.data.name
            description.innerHTML = response.data.description
            wallet.innerHTML = response.data.wallet
            genre.innerHTML = response.data.genre
            goal.innerHTML = response.data.goal
            deadline.innerHTML = response.data.deadline
            progress.innerHTML = "$" + response.data.wallet + " / $" + response.data.goal
            if (response.data.isLaunched === 1) {
                launched.innerHTML = "Launched"
            }
            else {
                launched.innerHTML = "Not Launched"
            }
            
            let pledgeTable = document.getElementById("pledgeDetails")
            pledgeTable.innerHTML = ""
            let pledgeRow = pledgeTable.insertRow(0)
            let pledgeName = pledgeRow.insertCell(0)
            let pledgeDescription = pledgeRow.insertCell(1)
            let pledgeCost = pledgeRow.insertCell(2)
            let pledgeQuantity = pledgeRow.insertCell(3)
            let pledgeSupporters = pledgeRow.insertCell(4)

            pledgeName.innerHTML = "name"
            pledgeDescription.innerHTML = "reward"
            pledgeCost.innerHTML = "cost"
            pledgeQuantity.innerHTML = "# claimed"
            pledgeSupporters.innerHTML = "supporters"

            for (let i = 0; i < response.data.pledges.length; i++) {
                let row = pledgeTable.insertRow(1)
                let cell0 = row.insertCell(0)
                let cell1 = row.insertCell(1)
                let cell2 = row.insertCell(2)
                let cell3 = row.insertCell(3)
                let cell4 = row.insertCell(4)
                

                cell0.innerHTML = response.data.pledges[i].name
                cell1.innerHTML = response.data.pledges[i].reward
                cell2.innerHTML = response.data.pledges[i].cost
                cell3.innerHTML = response.data.supporters[i].length + '/' + response.data.pledges[i].quantity
                if (response.data.supporters[i].length === 0) {
                    cell4.innerHTML = "No supporters"
                }
                else {
                    cell4.innerHTML = response.data.supporters[i]
                }
            } 
          }
    })
        .catch(function (error) {
        })


}

// async function viewPledge(name) {

//     //prepare payload
//     let msg = {}
//     msg["name"] = name
//     let value = JSON.stringify(msg)

//     let data = { 'body' : value }
//     console.log("----------------------------------")
//     console.log(data);
//     instance.post("/viewPledge",data).then(function (response) {
//         //do something here
//         console.log("wwwwwwwwwwwwwwwwwwwww")
//         console.log(response.data)
//         // return Promise.resolve(response.data).then(() => console.log(response.data))
//         return response.data
//     })
//         .catch(function (error) {
//             alert("Failed")
//         })
// }

function createPledge() {

    let proj = document.getElementById("proj")
    let name = document.getElementById("pledge")
    let desc = document.getElementById("pledgedescription")
    let amount = document.getElementById("pledgeamount")
    let quantity = document.getElementById("quantity")
    
    const urlParams = new URLSearchParams(window.location.search) 
    let username = urlParams.get("username")

    //prepare payload
    let msg = {}
    msg["projectName"] = proj.value
    msg["name"] = name.value // name of pledge
    msg["reward"] = desc.value
    msg["cost"] = amount.value
    msg["quantity"] = quantity.value
    msg["username"] = username
    let value = JSON.stringify(msg)

    let data = { 'body' : value }
    console.log(data);
    instance.post("/createpledge",data).then(function (response) {
        //do something here
        console.log(response)
        location.reload()
    })
        .catch(function (error) {
            alert("Failed")
        })
}

function deleteProject() {

    //prepare payload
    let msg = {}

    const urlParams = new URLSearchParams(window.location.search) 
    let username = urlParams.get("username")

    msg["confirm"] = document.getElementById("confirmProject").value
    msg["name"] = document.getElementById("deleteProject").value
    msg["username"] = username
    let value = JSON.stringify(msg)

    let data = { 'body' : value }
    console.log(data);
    instance.post("/deleteProject",data).then(function (response) {
        //do something here
        console.log(response)
        if (400 === response.data.statusCode) {
            alert(response.data.error)
          }
          else if (200 === response.data.statusCode) {
            alert("Project successfully deleted")
            location.reload()
          }
    })
        .catch(function (error) {
        })
}

function deletePledge() {

    //prepare payload
    let msg = {}

    const urlParams = new URLSearchParams(window.location.search) 
    let username = urlParams.get("username")

    msg["confirm"] = document.getElementById("confirmPledge").value
    msg["name"] = document.getElementById("pledgePledge").value
    // msg["project"] = document.getElementById("pledgeProject").value
    msg["username"] = username
    let value = JSON.stringify(msg)

    let data = { 'body' : value }
    console.log(data);
    instance.post("/deletePledge",data).then(function (response) {
        //do something here
        console.log(response)
        if (400 === response.data.statusCode) {
            alert(response.data.error)
          }
          else if (200 === response.data.statusCode) {
            alert("Pledge successfully deleted")
            location.reload()
          }
    })
        .catch(function (error) {
        })
}

function launchProject() {

    //prepare payload
    let msg = {}

    const urlParams = new URLSearchParams(window.location.search) 
    let username = urlParams.get("username")
    
    msg["launch"] = 1
    msg["confirm"] = document.getElementById("confirmLaunch").value
    msg["name"] = document.getElementById("projectLaunch").value
    msg["username"] = username
    let value = JSON.stringify(msg)

    let data = { 'body' : value }
    console.log(data);
    instance.post("/setLaunched",data).then(function (response) {
        //do something here
        console.log(response)
        if (400 === response.data.statusCode) {
            alert(response.data.error)
          }
          else if (200 === response.data.statusCode) {
            alert("Project successfully launched")
            location.reload()
          }
    })
        .catch(function (error) {
        })
}

function reviewProjectActivity() {

    let name = document.getElementById("projectActivity")
    //prepare payload
    let msg = {}
    const urlParams = new URLSearchParams(window.location.search) 
    let username = urlParams.get("username")
    
    msg["typeOfUser"] = "supporter"
    msg["supporterName"] = username
    msg["name"] = name.value
    let value = JSON.stringify(msg)

    let data = { 'body' : value }
    console.log(data);
    instance.post("/reviewProjectActivity",data).then(function (response) {
        //do something here
        console.log(response)
        if (400 === response.data.statusCode) {
            alert(response.data.error)
          }
          else if (200 === response.data.statusCode) {
            let table = document.getElementById("activity")
            table.innerHTML = ""
            let defaultRow = table.insertRow(0)
            let defaultProject = defaultRow.insertCell(0)
            let defaultAmount = defaultRow.insertCell(1)
            let defaultPledge = defaultRow.insertCell(2)
            let defaultDirect = defaultRow.insertCell(3)
            let defaultSupporter = defaultRow.insertCell(4)

            defaultProject.innerHTML = "project name"
            defaultAmount.innerHTML = "amount"
            defaultPledge.innerHTML = "pledge name"
            defaultDirect.innerHTML = "type of activity"
            defaultSupporter.innerHTML = "supporter name"

            for (let i = 0; i < response.data.activity.length; i++){
                let row = table.insertRow(1)
                let twoProject = row.insertCell(0)
                let twoAmount = row.insertCell(1)
                let twoPledge = row.insertCell(2)
                let twoDirect = row.insertCell(3)
                let twoSupporter = row.insertCell(4)
                twoProject.innerHTML = response.data.activity[i].projectName
                twoAmount.innerHTML = response.data.activity[i].amount
                twoPledge.innerHTML = response.data.activity[i].pledgeName
                if (response.data.activity[i].projectName != "addFunds" && response.data.activity[i].pledgeName != null) {
                    twoDirect.innerHTML = "Claimed Pledge"
                }
                else if (response.data.activity[i].pledgeName === null && response.data.activity[i].projectName != "addFunds") {
                    twoDirect.innerHTML = "Direct Support"
                }
                else {
                    twoDirect.innerHTML = "addFunds"
                }
                twoSupporter.innerHTML = response.data.activity[i].supporterName
            } 
          }
    })
        .catch(function (error) {
        })
}

window.onload = () => {
    listProjects()
}