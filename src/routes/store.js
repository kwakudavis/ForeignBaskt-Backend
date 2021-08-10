/** list of Functions
 *  createInventory()  - Creates a new inventory and returns the id of the inventory.
 *  createStore(name, logo_url, address, mobile)  - Creates a new store, and assign an inventory to it
 *  getStore(store_id) -  Returns details of a store by taking the store id.
 *  getAllStores() - Returns a list of all stores in the database.
 *  updateStore(store_id, name, address, logo_url, mobile) - Updates the name, address, logo and mobile number of a store using store's id as reference.
 *  deleteStore(store_id) - Delete's a store using store id as reference.
 *  Nan - removeProductFromStore(store_id,productId) -  Remove a product from a store's inventory
 *  addProductToStore(store_id, productId, productPrice, inStock) - Add product to store's inventory
 *  Nan - updateProductInStore(store_id, productId, inStock) -  Update Product's stock status in store's inventory.
 *  getAllInventories() - Returns all of inventories.
 */

/** List of Routes
 *  router.get("/addproduct", (req, res)   -  Adds a new product to a store.
 *  Nan - router.get("/delproduct", (req, res) - Remove a product from a store's inventory.
 *  Nan - router.get("/updateproductInStore", (req, res) - Update a product's details in a store's inventory
 *  router.get("/", (req, res) - Returns the details of a store.
 *  router.get("/delete", (req, res) - Deletes a store.
 *  router.get("/create", (req, res) - Creates a new store.
 *  router.get("/update", (req, res) - Updates a store's details.
 *  router.get("/all", (req, res) - Returns all store objects
 *  router.get("/inventories", (req, res) - Returns all Inventory objects
 *
 */

////Import lodash utility tool

var _ = require("lodash");

///// Load firebase library
var { firebase } = require("../firebaseConfig");

//////// Connect to instance of firebase

var db = firebase.firestore();

//Load Express
var express = require("express");

//Get the router function in express.
var router = express.Router();

///// Create Store - Creates and stores a new store
//// on firebase.
/////////////////////

/// Function to create an inventory Document and return its ID
async function createInventory() {
  return db
    .collection("inventories")
    .add({ inventory: [] })
    .then((docRef) => {
      return docRef.id;
    })
    .catch((error) => {
      console.log("Error creating inventory");
    });
}

//////Function to  create a new store
async function createStore(name, logo_url, address, mobile) {
  ////// Perform Transation to create a new inventory and a new store, and also to assign the id of the inventory to the store.

  try {
    //////Create an inventory document and get its ID
    const inventory_id = await createInventory();

    ////// Create a new store and assigned inventory ID to it.

    db.collection("stores").add({
      name: name,
      address: address,
      logo_url: logo_url,
      mobile: mobile,
      inventory_id: inventory_id
    });

    console.log("Store has been created with id", inventory_id);
  } catch (err) {
    console.log(`$err`);
  }
}

/////////////// Get store details and inventory using store id
async function getStore(store_id) {
  return db
    .collection("stores")
    .doc(store_id)
    .get()
    .then((doc) => {
      return doc;
    })
    .catch((error) => {
      console.log("Error creating inventory");
    });
}

//////////////  Get a list of all stores
async function getAllStores() {
  const stores = await db.collection("stores");
  return stores.get().then((querySnapshot) => {
    const tempStore = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    return tempStore;
  });
}

///////////// Function to  Updates an existing Store
async function updateStore(store_id, name, address, logo_url, mobile) {
  var storeRef = db.collection("stores").doc(store_id);
  return storeRef
    .update({
      name: name,
      address: address,
      logo_url: logo_url,
      mobile: mobile
    })
    .then(() => {
      console.log("Store Document updated successfully");
    })
    .catch((error) => {
      console.log("Error performing  Store update:", error);
    });
}

///////  Function  to Delete an exisiting store
async function deleteStore(store_id) {
  await db
    .collection("stores")
    .doc(store_id)
    .delete()
    .then(() => {
      console.log("Store deleted successfully");
    })
    .catch((error) => {
      console.log("Deletion of stores failed with error", error);
    });
}

/** 
//////// Function to create a new product, Params:  productImageUrl, productname.
async function createProduct(productImageUrl, productname) {
  db.collection("products")
    .add({
      name: productname,
      image_url: productImageUrl
    })
    .then(console.log("Product added successfully"))
    .catch((err) => {
      console.log("Product creation failed with error", err);
    });
}
***/

///////////////////////////// Function to return all inventories
async function getAllInventories() {
  const inventories = await db.collection("inventories");
  return inventories.get().then((querySnapshot) => {
    const tempStore = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    return tempStore;
  });
}

//////////////////////// Remove Product from store's inventory
async function removeProductFromStore(store_id, productId) {
  try {
    ///Get store's inventory
    const store = await db
      .collection("stores")
      .doc(store_id)
      .get()
      .then((store) => {
        return store.data();
      });
    var store_inventory_id = store.inventory_id;
    console.log(store_inventory_id);
  } catch (err) {
    console.log(`$err`);
  }
}
//////////////////////// Add product to store
async function addProductToStore(store_id, productId, productPrice, inStock) {
  ///Add Product to store's inventory using product id

  try {
    ///Get store's inventory
    const store = await db
      .collection("stores")
      .doc(store_id)
      .get()
      .then(async (store) => {
        //Get inventory array
        var store_inventory_id = store.data().inventory_id;
        var old_inventory = await db
          .collection("inventories")
          .doc(store_inventory_id)
          .get()
          .then((data) => {
            return data.data().inventory;
          });

        ///Prepare product object
        var product = { productId: productId, productPrice: productPrice };

        ///Update inventory with new product
        var new_inventory = _.concat(old_inventory, product);

        console.log(new_inventory);

        db.collection("inventories")
          .doc(store.data().inventory_id)
          .set({ inventory: new_inventory })
          .then(() => {
            console.log("product added successfully to inventory");
          });
      });
  } catch (err) {
    console.log(`$err`);
  }
}

///////////////////////// Router to add product to store. Prams: store ID, PRODUCT ID, PRODUCT PRICE, INSTOCK (BOOLEAN)

router.get("/addproduct", (req, res) => {
  addProductToStore(
    "VegIupbAE8F7J2Ic1nNq",
    "W7o9NpdYLyelvDkubYzd",
    "7.99",
    "True"
  );
});

/////////////Get Router to Get a store's details using store id, accepts a store id
router.get("/", (req, res) => {
  getStore("VegIupbAE8F7J2Ic1nNq")
    .then((results) => {
      res.send(results.data());
    })
    .catch((error) => {
      console.log(error);
    });
});

///////////////////////////// Router to delete a store

router.get("/delete", (req, res) => {
  deleteStore("DYL5lsPb7vUoscpRx71q");
});

/////////////////////////////// Router to Create a new store

router.get("/create", (req, res) => {
  createStore("Mosta Afro", "#", "Buggiba", "+35677157245");
});

//////////////////////////////// Router to Update Store
router.get("/update", (req, res) => {
  updateStore(
    "PUXZdD9fUpXtJkvFSvr6",
    "Afro Corner Store",
    "Mhrihel",
    "#2",
    "77157243"
  );
});

////////////////////////  Router to get all stores in database

router.get("/all", (req, res) => {
  getAllStores()
    .then((results) => {
      res.send(results);
    })
    .catch((error) => {
      console.log(error);
    });
});

////////////////////// Route to Get All inventory

router.get("/allinventories", (req, res) => {
  getAllInventories()
    .then((results) => {
      res.send(results);
    })
    .catch((error) => {
      console.log(error);
    });
});

//And then export the posts router
module.exports = router;
