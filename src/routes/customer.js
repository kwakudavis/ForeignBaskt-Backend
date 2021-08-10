/** List of functions
 *   addCustomer(user_id,name,address,mobile) - Adds a new customer 
 *   updateCustomerDetails(user_id,name,address,mobile)-  Updates the details of a customer
 *   Nan deleteCustomer(customer_id)-  Delete records of a customer
 *   getCustomerDetails(customer_id) - Get details of a particular customer
 * /

/**
  -  Post Route to add a new customer
  -  Put Route to update the records of a customer
  -  Nan Route to delete the records of a customer
  -  Get Route to get details of a particular customer
 */

////Import lodash utility tool

var _ = require("lodash");

///// Load firebase library
var { firebase } = require("../firebaseConfig");

//////// Connect to instance of firebase
var db = firebase.firestore();

//Import express
var express = require("express");

/** 
///Import body parser
const bodyParser = require("body-parser");

//// Configure express to utilize body parser
express.use(bodyParser.urlencoded({ extended: false }));
express.use(bodyParser.json());*/

//////////////// Function to add a new customer
async function addCustomer(customer_id, name, address, mobile) {
  db.collection("customers")
    .add({
      customer_id: customer_id,
      name: name,
      address: address,
      mobile: mobile
    })
    .then(() => {
      console.log("Customer added successfully");
    })
    .catch((err) => {
      console.log(err);
    });
}

//////////////// Function to update details of an existing customer
async function updateCustomerDetails(customer_id, name, address, mobile) {
  db.collection("customers")
    .doc(customer_id)
    .set({
      customer_id: customer_id,
      name: name,
      address: address,
      mobile: mobile
    })
    .then(() => {
      console.log("Customer updated successfully");
    })
    .catch((err) => {
      console.log(err);
    });
}

/////////Function to get details of a customer
async function getCustomerDetails(customer_id) {
  return db
    .collection("customers")
    .doc(customer_id)
    .get()
    .then((data) => {
      return data.data();
    })
    .catch((err) => {
      console.log(err);
    });
}

//Get the router function in express.
var router = express.Router();

//////// Router to get details of a particular customer
router.get("/", (req, res) => {
  var customer_id = req.query.customer_id;
  try {
    var customerDetails = getCustomerDetails(customer_id);
    res.send(customerDetails);
  } catch (err) {
    console.log(err);
  }

  /** updateCustomerDetails(
    "Opi6qJUzFJpY5Zi3OMip",
    "asd",
    "Daniel",
    "flat 9",
    "712321393"
  );*/
});

//And then export the posts router
module.exports = router;
