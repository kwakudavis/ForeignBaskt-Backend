/** List of functions
 *   addCustomer(customer_id,name,address,mobile) - Adds a new customer 
 *   updateCustomerDetails(customer_id,name,address,mobile)-  Updates the details of a customer
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
  await db
    .collection("customers")
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
  return await db
    .collection("customers")
    .doc(customer_id)
    .get()
    .then((data) => {
      console.log(data.data());
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

  getCustomerDetails(customer_id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      "Getting customer failed with error", err;
    });
});

////Router to add a new customer
router.post("/add", (req, res) => {
  var customer_id = req.body.customer_id;
  var name = req.body.name;
  var address = req.body.address;
  var mobile = req.body.mobile;

  addCustomer(customer_id, name, address, mobile);
  res.send("Customer with ID " + customer_id + " succesfully");
});

/// Router to update details of a customer
router.put("/update", (req, res) => {
  var customer_id = req.body.customer_id;
  var name = req.body.name;
  var address = req.body.address;
  var mobile = req.body.mobile;

  updateCustomerDetails(customer_id, name, address, mobile);
  res.send("Customer details updated succesfully");
});

//And then export the posts router
module.exports = router;
