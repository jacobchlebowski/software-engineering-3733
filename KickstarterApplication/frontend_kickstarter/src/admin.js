const instance = axios.create ( {
    baseURL: 'https://olp7bebvoe.execute-api.us-east-1.amazonaws.com/Prod'
});

function listProjects() {
    
    let msg = {}
    const urlParams = new URLSearchParams(window.location.search) 
    msg["username"] = urlParams.get("username")
    msg["typeOfUser"] = "admin"
    msg["genre"] = "None" 
    let value = JSON.stringify(msg)
    let data = { 'body' : value }
    document.getElementById("projectList").innerHTML = ""

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
            // let defaultDescription = defaultRow.insertCell(1)
            // let defaultWallet = defaultRow.insertCell(2)
            // let defaultGoal = defaultRow.insertCell(3)
            // let defaultDeadline = defaultRow.insertCell(4)
            // let defaultIsLaunched = defaultRow.insertCell(5)


            defaultName.innerHTML = "name"
            // defaultDescription.innerHTML = "description"
            // defaultWallet.innerHTML = "wallet"
            // defaultGoal.innerHTML = "goal"
            // defaultDeadline.innerHTML = "deadline" 
            // defaultIsLaunched.innerHTML = "launched"

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
                
                // const claims = viewPledge(response.data.pledges[i][0])
                // console.log("[][][][][][][][[][][][][][][][]")
                // console.log(claims.quantity)
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

function reapProjects() {

    //prepare payload
    let msg = {}

    let value = JSON.stringify(msg)

    let data = { 'body' : value }
    console.log(data);
    instance.post("/reapProjects",data).then(function (response) {
        //do something here
        console.log(response)
        if (400 === response.data.statusCode) {
            alert(response.data.error)
          }
          else if (200 === response.data.statusCode) {
            alert("Reap Projects Successful")
            location.reload()
          }
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

window.onload = () => {
    listProjects()
}