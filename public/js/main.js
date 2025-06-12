// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault();
  
  const item = document.querySelector( "#item" ),
        price = document.querySelector( "#price" ),
        discount = document.querySelector( "#discount" ),
        category = document.querySelector( "#category" ),
        note = document.querySelector( "#note" ),
        json = { "item": item.value, "price": price.value, "discount": discount.value, "category": category.value, "note": note.value },
        body = JSON.stringify( json )

  const response = await fetch( "/add", {
    method:"POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body
  }).then( function(serverresponse) {
      if (serverresponse.status === 200) {
        alert("Item was successfully added!");
      } else {
        alert("Oops, something went wrong!");
      }
  })
  window.location.reload(true);
}

// fills in the whole table for spending-list.html based on spendingdata in server.improved.js
const populateTable = async function() {
  const table = document.getElementById("itemtablebody");

  await fetch( "obtainData.json", {
    method:"GET"
  }).then( function(serverresponse) {
      if (serverresponse.status !== 200) {
        alert("Oops, something went wrong and table wasn't able to load!")
      }
      receivedData = serverresponse.json()
      return receivedData
  }).then( function(clientspendingdata) {
    clientspendingdata.forEach( item => {
      let row = table.insertRow();
      let tdate = row.insertCell(0);
      tdate.innerHTML = item.date;
      let titem = row.insertCell(1);
      titem.innerHTML = item.item;
      let tprice = row.insertCell(2);
      tprice.innerHTML = "$" + item.price;
      let tdiscount = row.insertCell(3);
      tdiscount.innerHTML = item.discount + "%";
      let tmoneySaved = row.insertCell(4);
      tmoneySaved.innerHTML = "$" + item.moneySaved;
      let tcategory = row.insertCell(5);
      tcategory.innerHTML = item.category;
      let tnote = row.insertCell(6);
      tnote.innerHTML = item.note;

      const editbutton = document.createElement('button');
      editbutton.textContent = "Edit Item";
      editbutton.value = item._id;
      editbutton.className = "editButton";
      editbutton.onclick = () => editPage(item._id);
      let forEditing = row.insertCell(7);
      forEditing.appendChild(editbutton);

      const abutton = document.createElement('button');
      abutton.textContent = "Delete Item";
      abutton.value = item._id;
      abutton.className = "deleteButton";
      abutton.onclick = () => deleteItem(item._id);
      let forDeleting = row.insertCell(8);
      forDeleting.appendChild(abutton);
    });
  });
  
}

const deleteItem = async function(idNum) {
  const theid = { "_id": idNum },
        dataforDelete = JSON.stringify( theid );

  await fetch( "deleteItem", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: dataforDelete
  }).then( function(serverresponse) {
    if (serverresponse.status === 200) {
      alert("Item deleted successfully!")
    } else {
      alert("Oops, something went wrong and the item was not deleted!")
    }
  })
  window.location.reload(true);
}

const getItem = async function() {

  await fetch( `getItem`, {
    method: "GET",
  }).then( function(serverresponse) {
    if (serverresponse.status !== 200) {
      alert("Oops, something went wrong!")
    }
    receivedData = serverresponse.json()
    return receivedData
  }).then(function(data) {
    const item = document.getElementById("eitem");
    item.value = data.item;
    const price = document.getElementById( "eprice" );
    price.value = data.price;
    const discount = document.getElementById( "ediscount" );
    discount.value = data.discount;
    const note = document.getElementById("enote");
    note.value = data.note;
  })
}

const editPage = async function(idNum) {

  await fetch( `edit?itemID=${idNum}`, {
    method: "GET",
  }).then( function(serverresponse) {
    if (serverresponse.status !== 200) {
      alert("Oops, something went wrong and the item cannot be edited!")
    } else {
      getItem();
      window.location.href = serverresponse.url;  
    }
  })
  console.log("Hello")
  //window.location.reload(true);
}

const login = async function(event) {
  event.preventDefault();
  
  const username = document.querySelector( "#username" ),
        password = document.querySelector( "#password" ),
        json = { "username": username.value, "password": password.value },
        body = JSON.stringify( json )

  const response = await fetch( "/login", {
    method:"POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body
  }).then( function(serverresponse) {
      if (serverresponse.redirected) {
        window.location.href = serverresponse.url;
        alert("You have logged in!")
      } else {
        window.location.reload(true);
        alert("Login failed! Please try again.");
      }
  })
}

const logout = async function(event) {
  event.preventDefault();

  const response = await fetch( "/logout", {
    method:"GET"
  }).then( function(serverresponse) {
      if (serverresponse.redirected) {
        //window.location.href = serverresponse.url;
        alert("Logged out!");
      } else {
        alert("Oh uh! Something went wrong! Please try again.");
      }
  })
  //window.location.reload(true);
}

const register = async function(event) {
  event.preventDefault();
  
  const regusername = document.querySelector( "#regusername" ),
        regpassword = document.querySelector( "#regpassword" ),
        json = { "username": regusername.value, "password": regpassword.value },
        regbody = JSON.stringify( json )

  const response = await fetch( "/register", {
    method:"POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: regbody
  }).then( function(serverresponse) {
      if (serverresponse.redirected) {
        window.location.href = serverresponse.url;
        alert("Successfully created an account!")
      } else {
        alert("Username already exists! Please enter a different username.");
      }
  })
}

// when window is loaded this will run first
window.onload = function() {
  if (window.location.pathname === "/" || window.location.pathname === "/index") {
    const button = document.getElementById("sending");
    button.onclick = submit; // this will call the function submit upon the button being clicked
  } else if (window.location.pathname === "/login") {
    const loggingin = document.getElementById("forlogin");
    loggingin.onclick = login;
  } else if (window.location.pathname === "/register") {
    const registering = document.getElementById("forregister");
    registering.onclick = register;
  }
  
};