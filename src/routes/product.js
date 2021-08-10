/** List of functions
 *   createProduct(name,imageurl) - Creates a new product
 *   updateproduct(id,name,imageurl) - Updates product details
 *   deleteproduct(id) - Delete an existing product
 *   fetchProduct(id) - Returns Product info. name and image url
 *   getallProducts() - Returns all products
 *
 */

/**
  -  Route to create product
  -  Route to update product
  -  Route to delete product
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

////// Router to create a new product
router.get("/create", (req, res) => {
  res.send("We are creating a product");

  createProduct(
    "tastytom2",
    "data:image/jpeg;base64,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"
  );

  //console.log(fetchProduct("-MfD6ahLcxjkeHLSVN6C"));
  //console.log(fetchAllProducts());
});

///// Route to update details of an existing product

router.get("/update", (req, res) => {
  res.send("We are updating a product");

  try {
    updateProduct("pKpHqXNGFOUN2sZnfDAe", "tastytom", "new tastytom image url");
  } catch (err) {
    console.log("failed to update with error", err);
  }
});

/////////// Router to get a product's details

router.get("/fetch", (req, res) => {
  res.send("We are fetching a product");

  try {
    fetchProduct("pKpHqXNGFOUN2sZnfDAe");
  } catch (err) {
    console.log("failed to update with error", err);
  }
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

router.get("/delete", (req, res) => {
  res.send("We are deleting a product");
  try {
    deleteProduct("BSt5vJJ1nZTENiajIu6P");
  } catch (err) {
    console.log("Product deletion failed with error", err);
  }
});

//And then export the posts router
module.exports = router;
