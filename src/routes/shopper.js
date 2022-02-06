/**   Functions
 *    addShopper(name, mobile) - Adds a new shopper
 *    getShopper(shopper_id) - Gets details of a shopper
 *    getAllShoppers() - Gets list of all available shoppers
 *    updateShopper(shopper_id, name, mobile)  - Updates details of a particular shoper
 *    deleteShopper(shopper_id) - Deletes a shopper
 *
 */

/// Load firebase library
var { firebase } = require("../firebaseConfig");

//// Connect to instance of firestore
var db = firebase.firestore();

//// Load express library
var express = require("express");

//Get the router function in express.
var router = express.Router();

//// Function to add a new shopper field to the shopper collection.
function addShopper(name, mobile) {
  db.collection("shoppers")
    .add({
      name: name,
      mobile: mobile
    })
    .then((docRef) => {
      console.log("Document added with ID", docRef.id);
    })
    .catch((error) => {
      console.log("Addition of field failed with error:", error);
    });
}

///// Function to get all details of a shopper
function getShopper(shopper_id) {
  var shopperRef = db.collection("shoppers").doc(shopper_id);
  shopperRef
    .get()
    .then((doc) => {
      console.log(doc.data());
    })
    .catch((error) => {
      console.log("Error getting document");
    });
}

///// Function to get all shoppers
function getAllShoppers() {
  db.collection("shoppers")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data().name}`);
      });
    });
}

///// Function to update a shopper's details using shopper id

function updateShopper(shopper_id, name, mobile) {
  var shopperRef = db.collection("shoppers").doc(shopper_id);
  return shopperRef
    .update({
      name: name,
      mobile: mobile
    })
    .then(() => {
      console.log("Document updated successfully");
    })
    .error((error) => {
      console.log("Error performing update:", error);
    });
}

////// Function to delete a shopper using id

function deleteShopper(shopper_id) {
  var shopperRef = db.collection("shoppers").doc(shopper_id);
  shopperRef
    .delete()
    .then(() => {
      console.log("Shopper deleted successsfuly");
    })
    .catch(() => {
      "Error deleting shopper field ";
    });
}

//And then export the posts router
module.exports = router;
