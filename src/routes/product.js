/** List of functions
 *   createProduct(name,imageurl) - Creates a new product
 *   updateproduct(id,name,imageurl) - Updates product details
 *   deleteproduct(id) - Delete an existing product
 *   fetchProduct(id) - Returns Product info. name and image url
 *   getallProducts() - Returns all products
 *
 */

/**
  -  NAN Route to create product
  -  NAN Route to update product
  -  NAN Route to delete product
  -  Route to get product details
  -  Route to get all products
 */

////Import lodash utility tool

var _ = require("lodash");

///// Load firebase library
var { firebase } = require("../firebaseConfig");

//////// Connect to instance of firebase
var db = firebase.firestore();

var express = require("express");

//require("../firebaseConfig");

//Get the router function in express.
var router = express.Router();

//////////// Function to create a ne product
async function createProduct(name, imageurl) {
  return db
    .collection("products")
    .add({ name: name, imageurl: imageurl })
    .then(() => {
      console.log("Product added succesfully");
    })
    .catch((err) => {
      console.log("Product addition failed with error", err);
    });
}

/////// Update Product - updates the details of an existing of an existing product.
async function updateProduct(id, name, imageurl) {
  return await db
    .collection("products")
    .doc(id)
    .update({ name: name, imageurl: imageurl })
    .then(() => {
      console.log("Product Updated Successfully");
    })
    .catch((err) => {
      console.log("Product update failed with error", err);
    });
}

///////Function to delete an already existing product

async function deleteProduct(id) {
  return await db
    .collection("products")
    .doc(id)
    .delete()
    .then(() => {
      console.log("Product deleted Successfully");
    })
    .catch((err) => {
      console.log("Product deletion failed with error", err);
    });
}

///////Fetch a particular product

async function fetchProduct(id) {
  return await db
    .collection("products")
    .doc(id)
    .get()
    .then((data) => {
      console.log("Product retieved Successfully", data.data());
      return data.data();
    })
    .catch((err) => {
      console.log("Product retrieved failed with error", err);
    });
}

////////////////////// Function to Get All Products

async function fetchAllProducts() {
  const products = await db.collection("products");
  return products.get().then((querySnapshot) => {
    const tempStore = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    return tempStore;
  });
}

/////////// Router to get a product's details
router.get("/fetch", (req, res) => {
  var product_id = req.query.product_id;

  fetchProduct(product_id)
    .then((data) => {
      res.send(data);
    })
    .catch(() => {
      console.log("Error getting product details");
    });
});

///////// Router to get all products

router.get("/all", (req, res) => {
  fetchAllProducts()
    .then((results) => {
      res.send(results);
    })
    .catch((error) => {
      console.log(error);
    });
});

///////Router to delete a product
router.delete("/delete", (req, res) => {
  var product_id = req.body.product_id;

  deleteProduct(product_id)
    .then(() => {
      res.send("Product deleted successfully");
    })
    .catch((err) => {
      console.log("Error deleting product.");
    });
});

//And then export the posts router
module.exports = router;
