const instance = axios.create ( {
    baseURL: 'https://olp7bebvoe.execute-api.us-east-1.amazonaws.com/Prod'
});



function listProjects(genreSearch) {
    
    let msg = {}
    const urlParams = new URLSearchParams(window.location.search) 
    msg["username"] = urlParams.get("username")
    msg["typeOfUser"] = "supporter"
    if (genreSearch === "None") {
        msg["genre"] = "None"
    }
    else {
        msg["genre"] = document.getElementById("genre").value
    }
    let value = JSON.stringify(msg)
    let data = { 'body' : value }
    document.getElementById("projectList").innerHTML = ""
    console.log(data)
    instance.post("/listProjects",data).then(function (response) {
        //do something here
        console.log(response)
        if (400 === response.data.statusCode) {
            // alert(response.data.error)
            console.log(response)
        }
        else if (200 === response.data.statusCode) {
            let table = document.getElementById("projectList")
            // name, description, wallet, goal, deadline, isLaunched
            let defaultRow = table.insertRow(0)
            let defaultName = defaultRow.insertCell(0)

            defaultName.innerHTML = "name"
            
            document.getElementById("balance").innerHTML = "Balance:" + response.data.wallet

            let arr = Array.from(response.data.projectList)
            for (let i = 0; i < arr.length; i++) {
                let row = table.insertRow(1)
                let cell = row.insertCell(0)
                // let view = row.insertCell(1)
                cell.innerHTML = arr[i]
                // view.innerHTML = '<button id="btn" name="${i}" onClick="viewProject(this)">View Project</button>'
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
    
    msg["typeOfUser"] = "supporter"
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
            defaultName.innerHTML = "name"
            defaultDescription.innerHTML = "description"
            defaultWallet.innerHTML = "wallet"
            defaultGenre.innerHTML = "genre"
            defaultGoal.innerHTML = "goal"
            defaultDeadline.innerHTML = "deadline" 
            defaultIsLaunched.innerHTML = "launched"

            let row = table.insertRow(1)
            let name = row.insertCell(0)
            let description = row.insertCell(1)
            let wallet = row.insertCell(2)
            let genre = row.insertCell(3)
            let goal = row.insertCell(4)
            let deadline = row.insertCell(5)
            let launched = row.insertCell(6)
            // let view = row.insertCell(1)
            name.innerHTML = response.data.name
            description.innerHTML = response.data.description
            wallet.innerHTML = response.data.wallet
            genre.innerHTML = response.data.genre
            goal.innerHTML = response.data.goal
            deadline.innerHTML = response.data.deadline
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
                // cell3.innerHTML = claims.value
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

function addFunds() {

    //prepare payload
    let msg = {}

    const urlParams = new URLSearchParams(window.location.search)
    let username = urlParams.get("username")
    msg["amount"] = document.getElementById("addFunds").value
    msg["supporterName"] = username
    let value = JSON.stringify(msg)

    let data = { 'body' : value }
    instance.post("/addFunds",data).then(function (response) {
        console.log(response)
        if (400 === response.data.statusCode) {
            alert(response.data.error)
        }
        else if (200 === response.data.statusCode) {
            alert("Funds added")
            location.reload()
        }
    })
}

function claimPledge() {

    //prepare payload
    let msg = {}

    const urlParams = new URLSearchParams(window.location.search) 
    let username = urlParams.get("username")
    msg["confirm"] = document.getElementById("confirmClaim").value
    msg["projectName"] = document.getElementById("projectClaim").value
    msg["pledgeName"] = document.getElementById("pledgeClaim").value
    msg["supporterName"] = username
    let value = JSON.stringify(msg)

    let data = { 'body' : value }
    console.log(data);
    instance.post("/claimPledge",data).then(function (response) {
        //do something here
        console.log(response)
        if (400 === response.data.statusCode) {
            alert(response.data.error)
          }
          else if (200 === response.data.statusCode) {
            alert("Pledge successfully claimed")
            location.reload()
          }
    })
}

function directSupport() {

    //prepare payload
    let msg = {}

    const urlParams = new URLSearchParams(window.location.search) 
    let username = urlParams.get("username")
    msg["projectName"] = document.getElementById("projectSupport").value
    msg["amount"] = document.getElementById("amount").value
    msg["supporterName"] = username
    let value = JSON.stringify(msg)

    let data = { 'body' : value }
    console.log(data);
    instance.post("/directSupport",data).then(function (response) {
        //do something here
        console.log(response)
        if (400 === response.data.statusCode) {
            alert(response.data.error)
          }
          else if (200 === response.data.statusCode) {
            alert("Direct Support Successful")
            location.reload()
          }
    })
}

function listProjects(genreSearch) {
    
    let msg = {}
    const urlParams = new URLSearchParams(window.location.search) 
    msg["username"] = urlParams.get("username")
    msg["typeOfUser"] = "supporter"
    if (genreSearch === "None") {
        msg["genre"] = "None"
    }
    else {
        msg["genre"] = document.getElementById("genre").value
    }
    let value = JSON.stringify(msg)
    let data = { 'body' : value }
    document.getElementById("projectList").innerHTML = ""
    console.log(data)
    instance.post("/listProjects",data).then(function (response) {
        //do something here
        console.log(response)
        if (400 === response.data.statusCode) {
            // alert(response.data.error)
            console.log(response)
        }
        else if (200 === response.data.statusCode) {
            let table = document.getElementById("projectList")
            // name, description, wallet, goal, deadline, isLaunched
            let defaultRow = table.insertRow(0)
            let defaultName = defaultRow.insertCell(0)

            defaultName.innerHTML = "name"
            
            document.getElementById("balance").innerHTML = "Balance:" + response.data.wallet

            let arr = Array.from(response.data.projectList)
            for (let i = 0; i < arr.length; i++) {
                let row = table.insertRow(1)
                let cell = row.insertCell(0)
                // let view = row.insertCell(1)
                cell.innerHTML = arr[i]
                // view.innerHTML = '<button id="btn" name="${i}" onClick="viewProject(this)">View Project</button>'
            }
        }

        // response.data.forEach()document.getElementById("projectsList")
    })
    .catch(function (error) {

    })
}

function reviewSupporterActivity() {

    let name = document.getElementById("view")
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
    instance.post("/reviewSupporterActivity",data).then(function (response) {
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

            defaultProject.innerHTML = "project name"
            defaultAmount.innerHTML = "amount"
            defaultPledge.innerHTML = "pledge name"
            defaultDirect.innerHTML = "type of activity"

            for (let i = 0; i < response.data.donations.length; i++){
                let row = table.insertRow(1)
                let twoProject = row.insertCell(0)
                let twoAmount = row.insertCell(1)
                let twoPledge = row.insertCell(2)
                let twoDirect = row.insertCell(3)
                twoProject.innerHTML = response.data.donations[i][0]
                twoAmount.innerHTML = response.data.donations[i][1]
                twoPledge.innerHTML = response.data.donations[i][2]
                if (response.data.donations[i][0] != "addFunds" && response.data.donations[i][2] != null) {
                    twoDirect.innerHTML = "Claimed Pledge"
                }
                else if (response.data.donations[i][2] === null && response.data.donations[i][0] != "addFunds") {
                    twoDirect.innerHTML = "Direct Support"
                }
                else {
                    twoDirect.innerHTML = "addFunds"
                }
            } 
          }
    })
        .catch(function (error) {
        })
}

window.onload = () => {
    listProjects("None")
    reviewSupporterActivity()
}