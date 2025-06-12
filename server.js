require('dotenv').config();

const express    = require('express'),
      { MongoClient, ObjectId } = require("mongodb"),
      hbs = require('express-handlebars').engine,
      cookieSession = require('cookie-session'),
      app        = express()

app.engine( "handlebars", hbs() );
app.set( "view engine", "handlebars" )
app.set( "views", "./views" )

app.use( express.static( 'public' ) )
app.use( express.static( 'views'  ) )
app.use( express.json() )

app.use(cookieSession({
    name: 'session',
    keys: ['key2', 'key3'],
    loggedIn: false,
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }));

// middleware for authenticating users
/* app.use( function (req, res, next) {
    if (req.session.loggedIn === true) {
        next();
    } else {
        res.status(403);
        res.render('login', { msg:"Login failed, please try again", layout:false });
    }
}) */
function authenticate(req, res, next) {
    if (req.session.loggedIn === true) {
        next();
    } else {
        res.status(403);
        res.render('login', { layout:false });
    }
}

// cookie middleware
/* app.use( cookie({
    name: "session",
    keys: ["key1", "key2"]
})) */


const uri = `mongodb+srv://${process.env.USERNAME}:${process.env.PASS}@${process.env.HOST}/?retryWrites=true&w=majority&appName=a3-Webware`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
/* const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
}); */
const client = new MongoClient(uri);

let itemCollection;
let usersCollection;

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect()
    itemCollection = await client.db("spendingDatabase").collection("collection0")
    usersCollection = await client.db("spendingDatabase").collection("users")
    // Send a ping to confirm a successful connection
    await client.db("spendingDatabase").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    console.log("Finished connection attempt.");
  }
}
run()

app.use( (req,res,next) => {
    if( itemCollection !== null ) {
        next()
    }else{
        res.status( 503 ).send()
    }
});


// adding item to database
app.post( "/add", async (req, res) => {
    insertingItem = req.body;
    insertingItem.date = getDate();
    insertingItem.moneySaved = calcMoneySaved( parseFloat(insertingItem.price), parseFloat(insertingItem.discount) );
    insertingItem.itemUser = req.session.userID;
    const result = await itemCollection.insertOne( insertingItem );
    res.set('Content-Type', 'application/json');
    res.status(200);
    res.json( result );
})

app.get( "/login", authenticate, async (req, res) => {
    if (req.session.loggedIn === true) {
        res.render('index', {layout:false});
    } else {
        res.render('login', {layout:false});
    }
})

app.get("/logout", async (req, res) => {
    req.session.loggedIn = false;
    req.session.userId = null;
    res.redirect('login');
})

app.post( "/login", async (req, res) => {
    const userExistsCount = await usersCollection.countDocuments({ username: req.body.username, password: req.body.password });
    if (userExistsCount !== 0) {
        req.session.loggedIn = true;
        const currentuser = await usersCollection.findOne({ username: req.body.username, password: req.body.password });
        req.session.userID = currentuser._id.toString();
        res.status(200);
        res.redirect('index');
    } else {
        res.status(401);
        res.render('login', {layout:false});
    }
})

app.get( "/register", async (req, res) => {
    if (req.session.loggedIn === true) {
        res.render('index', {layout:false});
    } else {
        res.render('register', {layout:false});
    }
})

app.post( "/register", async (req, res) => {
    const userExistsCount = await usersCollection.countDocuments({ username: req.body.username });
    if (userExistsCount === 0) {
        insertingUser = req.body;
        const result = await usersCollection.insertOne( insertingUser );
        res.status(200);
        res.redirect('login');
    } else {
        res.status(422);
        res.render('register', {layout:false});
    }
})

app.get( "/index", authenticate, (req, res) => {
    res.render('index', {layout:false});
})

app.get( "/", authenticate, (req, res) => {
    res.render('index', {layout:false});
})

app.get( "/spending-list", authenticate, (req,res) => {
    //res.set('Cache-Control', 'no-cache');
    res.render('spending-list', {layout: false});
})

app.get("/obtainData.json", authenticate, async (req, res) => {
    const query = {itemUser: req.session.userID};
    const allItems = await itemCollection.find(query).toArray();
    res.set('Content-Type', 'application/json');
    res.status(200);
    res.json(allItems);
})

app.get("/edit", authenticate, async (req, res) => {
    req.session.editItemID = req.query.itemID;
    console.log(req.session.editItemID)
    res.render('edit', {layout:false});
})

app.get("/getItem", authenticate, async (req, res) => {
    const query = {_id:new ObjectId( req.session.editItemID )};
    const itemToEdit = await itemCollection.findOne(query);
    res.set('Content-Type', 'application/json');
    res.status(200);
    res.json(itemToEdit);
})

// assumes req.body takes form { _id:5d91fb30f3f81b282d7be0dd } etc.
app.delete("/deleteItem", authenticate, async (req, res) => {
    const result = await itemCollection.deleteOne({ 
        _id:new ObjectId( req.body._id )
      });
    //res.set('Cache-Control', 'no-cache');
    res.json( result );
})


const getDate = function() {
    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let currentDate = `${month}-${day}-${year}`;

    return currentDate;
}

const calcMoneySaved = function(paid, discount) {
    let monCalc = (paid * 100) / (100 - discount);
    return (monCalc - paid).toFixed(2);
}

app.listen( process.env.PORT || 3001 )
