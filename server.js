require('dotenv').config();

const express    = require('express'),
      { MongoClient, ObjectId } = require("mongodb"),
      app        = express()
      //spendingList     = []

app.use( express.static( 'public' ) )
app.use( express.static( 'views'  ) )
app.use( express.json() )


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

let collection;

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect()
    collection = await client.db("spendingDatabase").collection("collection0")
    // Send a ping to confirm a successful connection
    await client.db("spendingDatabase").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    console.log("Finished connection attempt.");
  }
}
run()
//run().catch(console.dir);

app.use( (req,res,next) => {
    if( collection !== null ) {
        next()
    }else{
        res.status( 503 ).send()
    }
});

// adding item to database
app.post( '/add', async (req,res) => {
    insertingItem = req.body;
    insertingItem.date = getDate();
    insertingItem.moneySaved = calcMoneySaved( parseFloat(insertingItem.price), parseFloat(insertingItem.discount) );
    const result = await collection.insertOne( insertingItem );
    res.set('Content-Type', 'application/json');
    res.status(200);
    res.json( result );
});

// middleware for authenticating users
/* app.use( function (req, res, next) {
    if (req.session.login === true) {
        next();
    } else {
        res.render('login', { msg:"Login failed, please try again", layout:false });
    }
}) */

app.get( "/index.html", (req, res) => {
    res.render('index', {msg:"You  have successfully logged in!", layout:false});
})

app.get( "/spending-list.html", (req,res) => {
    //res.set('Cache-Control', 'no-cache');
    res.render('spending-list.html')
})

app.get("/obtainData.json", async (req, res) => {
    const query = {}
    const allItems = await collection.find(query).toArray();
    res.set('Content-Type', 'application/json');
    //res.set('Cache-Control', 'no-cache');
    res.status(200);
    res.json(allItems);
})

// assumes req.body takes form { _id:5d91fb30f3f81b282d7be0dd } etc.
app.delete("/deleteItem", async (req, res) => {
    const result = await collection.deleteOne({ 
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