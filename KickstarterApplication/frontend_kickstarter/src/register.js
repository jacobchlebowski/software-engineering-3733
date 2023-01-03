const instance = axios.create ( {
  baseURL: 'https://olp7bebvoe.execute-api.us-east-1.amazonaws.com/Prod'
 });


function registerDesigner() {
        
        let arg1 = document.getElementById("username")
        let arg2 = document.getElementById("password")
        //prepare payload
        let msg = {}
        msg["username"] = arg1.value
        msg["password"] = arg2.value
        msg["typeOfUser"] = "designer"
        let value = JSON.stringify(msg)
    
        let data = {'body' : value }
        console.log(data);
      instance.post("/register",data).then(function (response) {
        //do something here
        console.log(response)
        if (400 === response.data.statusCode) {
          alert(response.data.error)
        }
        else if (200 === response.data.statusCode) {
          window.location = '/create.html?username=' + arg1.value;        }
        
      })
      .catch(function (error) {
        alert("Failed")
      }) 
}

function registerSupporter() {
        
  let arg1 = document.getElementById("username")
  let arg2 = document.getElementById("password")
  //prepare payload
  let msg = {}
  msg["username"] = arg1.value
  msg["password"] = arg2.value
  msg["typeOfUser"] = "supporter"
  let value = JSON.stringify(msg)

  let data = {'body' : value }
  console.log(data);
instance.post("/register",data).then(function (response) {
  //do something here
  if (400 === response.data.statusCode) {
    alert(response.data.error)
  }
  else if (200 === response.data.statusCode) {
    window.location = '/supporter.html?username=' + arg1.value;
  }
})
.catch(function (error) {
  alert("Failed")
})
}

function loginDesigner() {
        
  let arg1 = document.getElementById("usernamelog")
  let arg2 = document.getElementById("passwordlog")
  //prepare payload
  let msg = {}
  msg["username"] = arg1.value
  msg["password"] = arg2.value
  msg["typeOfUser"] = "designer"
  let value = JSON.stringify(msg)

  let data = {'body' : value }
  console.log(data);
  instance.post("/login",data).then(function (response) {
  //do something here
  console.log(response)
  if (400 === response.data.statusCode) {
    alert(response.data.error)
  }
  else if (200 === response.data.statusCode) {
    window.location = '/create.html?username=' + arg1.value;
  }
})
.catch(function (error) {
  alert("Failed")
  //add errors
})
}

function loginSupporter() {
        
  let arg1 = document.getElementById("usernamelog")
  let arg2 = document.getElementById("passwordlog")
  //prepare payload.
  let msg = {}
  msg["username"] = arg1.value
  msg["password"] = arg2.value
  msg["typeOfUser"] = "supporter"
  let value = JSON.stringify(msg)

  let data = {'body' : value }
  console.log(data);
  instance.post("/login",data).then(function (response) {
  //do something here
  if (400 === response.data.statusCode) {
    alert(response.data.error)
  }
  else if (200 === response.data.statusCode) {
    window.location = '/supporter.html?username=' + arg1.value;
  }
})
.catch(function (error) {
  alert("Failed")
  //add errors
})
}

function loginAdmin() {
        
  let arg1 = document.getElementById("usernamelog")
  let arg2 = document.getElementById("passwordlog")
  //prepare payload
  let msg = {}
  msg["username"] = arg1.value
  msg["password"] = arg2.value
  msg["typeOfUser"] = "admin"
  let value = JSON.stringify(msg)

  let data = {'body' : value }
  console.log(data);
  instance.post("/login",data).then(function (response) {
  //do something here!
  if (400 === response.data.statusCode) {
    alert(response.data.error)
  }
  else if (200 === response.data.statusCode) {
    window.location = '/admin.html?username=' + arg1.value;
  }
})
.catch(function (error) {
  alert("Failed")
  //add errors
})
}



