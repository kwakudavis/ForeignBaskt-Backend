/** 
////////Import API key authentication module
const apiKeyAuth = require("api-key-auth");

///////////// Create a collection of api keys

const apiKeys = new Map();

apiKeys.set("123456789", {
  id: 1,
  name: "api1",
  secret: "secret1"
});

apiKeys.set("987654321", {
  id: 2,
  name: "api2",
  secret: "secret2"
});

//////////// Function to get secret associated to a key id

function getSecret(keyId, done) {
  if (!apiKeys.has(keyId)) {
    return done(new Error("Unknown Api Key "));
  }

  //// Get api key by id
  const clientApp = apiKeys.get(keyId);

  //Pass api secret, and api key object (name and id of api secret) properties to done function.
  done(null, clientApp.secret, {
    id: clientApp.id,
    name: clientApp.name
  });
}


**/
///Import firebase utilities
var firebase = require("firebase");

////////////////////////////////////////////// LODASH //////////////////////////////////
//Load lodash
var _ = require("lodash");

var games = ["football", "basketball", "cricket", "Hockey", "Polo", "Skating"];

///Chunk

var chunked = _.chunk(games, 2);

console.log(chunked[0]);

//Import firebase analytics
require("firebase/analytics");

//Import firebase authentication, database and  store
require("firebase/auth");
require("firebase/database");
require("firebase/storage");

///Configure firebase

const firebaseConfig = {
  apiKey: "AIzaSyCqbvXjdXn6FntTK_HeJmH_jHGCVmPp47c",
  authDomain: "foreignbasket-df2e5.firebaseapp.com",
  databaseURL:
    "https://foreignbasket-df2e5-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "foreignbasket-df2e5",
  storageBucket: "foreignbasket-df2e5.appspot.com",
  messagingSenderId: "213245806986",
  appId: "1:213245806986:web:46c4b6929b1ec86b99a073",
  measurementId: "G-7RYZM315HC"
};

//Initialize Firebase presence in App
////firebase.initializeApp(firebaseConfig);

//Getting reference to  firbase database service

//var appDatabase = firebase.database();

var express = require("express");

var mongoose = require("mongoose");

//Parser
var bodyParser = require("body-parser");

var cors = require("cors");

require("dotenv/config");

var app = express();

//////////////////////// Use Keys, pass getSecret function and api-key-auth module as a parameter
//app.use(apiKeyAuth({ getSecret }));

//// Configure express to utilize body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Allow cross origin access
app.use(cors());

//////////////////////////////Connecting to a Database, eg: Mongoose////////////////////
//require the Mongoose package
//Dotenv package is installed to hide database link and username details or other
//details you would like to hide from public.

//Connect to the Mongo database
mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true },

  () => {
    console.log("we have connected to DB!");
  }
);

//////////////////////////////////////////////////////Routes/////////////////////

///Route can be created individually into files and loaded here

//app.get("/posts", (req, res) => {
//  res.send("We are posts");
//});

///So we would rather import them like so

var customerRoute = require("./routes/customer");
var shopperRoute = require("./routes/shopper");
var storeRoute = require("./routes/store");
var recipeRoute = require("./routes/recipe");
var shoppingListRoute = require("./routes/shoppingList");
var productRoute = require("./routes/product");
var orderRoute = require("./routes/order");

////////////////////////////////////Middlewares//////////////////////////////////////////////////////
///// Executes when a route is being hit

//Let the middleware run  the posts route anytime we go to posts

app.use("/customer", customerRoute);
app.use("/shopper", shopperRoute);
app.use("/store", storeRoute);
app.use("/recipe", recipeRoute);
app.use("/shoppingList", shoppingListRoute);
app.use("/product", productRoute);
app.use("/order", orderRoute);

/////////////////////////////////How to listen to the server /////////////////////////////////////////////////

app.listen(3000);

//var http = require("http");

//create a server object:
///http
// .createServer(function(req, res) {
//   res.write("Hello World!"); //write a response to the client
//  res.end(); //end the response
//})
//.listen(8080); //the server object listens on port 8080
