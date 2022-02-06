/** List of functions
 *   placeOrder(customer_id,store_id,orderItems,orderTimeStamp,orderTotal) - Creates and stores a new order
 *   updateOrderStatus(order_id,order_status)
 *   addOrderItem(order_id, product_id, store_id)
 *   removeOrderItem(order_id, product_id)
 *   getUserOrderHistory(customer_id)
 *   Nan getOrdersByDate(date)
 *
 */

/**
  -  Get Route to get user's order  History
  -  Nan Route to get list of orders by date
  -  Route to remove item from order
  -  Post Route to add item to order 
  -  Put Route to update an order's status
  -  Post Route to place an order
 */

////Import lodash utility tool

var _ = require("lodash");

///// Load firebase library
var { firebase } = require("../firebaseConfig");

//////// Connect to instance of firebase
var db = firebase.firestore();

var express = require("express");

//////////////// Function to remove an item from an order
async function removeOrderItem(order_id, product_id) {
  /////////First Get Order

  var order;
  try {
    order = await db.collection("orders").doc(order_id).get();
    //console.log(order.data());
  } catch (err) {
    console.log("failed with error", err);
  }

  var orderItems = order.data().order_items;

  //Remove item from items array if it matches the product id.
  _.remove(orderItems, function (n) {
    return n.product_id === product_id;
  });

  ////// Update Order items array with new copy
  return await db
    .collection("orders")
    .doc(order_id)
    .update({ order_items: orderItems })
    .then(() => {
      console.log("Order Item removed Successfully");
    })
    .catch((err) => {
      console.log("Order item removal failed with error", err);
    });
}

///////////////// Function to add item to order
async function addOrderItem(order_id, order_item) {
  /////////First Get Order

  var order;
  try {
    order = await db.collection("orders").doc(order_id).get();
    console.log(order.data());
  } catch (err) {
    console.log("failed with error", err);
  }

  order = order.data().order_items;
  console.log(order);

  //Update Order Items array
  var newItemsArray = _.concat(order, order_item);

  ////// Update Order items array with new copy
  return await db
    .collection("orders")
    .doc(order_id)
    .update({ order_items: newItemsArray })
    .then(() => {
      console.log("Order Item Added Successfully");
    })
    .catch((err) => {
      console.log("Order item addition failed with error", err);
    });
}

////// Function to get user's order history
async function getUserOrderHistory(customer_id) {
  /// Get Orders where customer_id is given in param.

  return await db
    .collection("orders")
    .where("customer_id", "==", customer_id)
    .get()
    .then((querySnapshot) => {
      const tempStore = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      return tempStore;
    })
    .catch((err) => {
      console.log("Error getting users orders", err);
    });
}

////// Function to place an order
async function placeOrder(
  customer_id,
  store_id,
  orderItems,
  orderTotal,
  customerAddress,
  customerMobile,
  orderDeliveryTime
) {
  await db
    .collection("orders")
    .add({
      customer_id: customer_id,
      store_id: store_id,
      order_items: orderItems,
      customer_Address: customerAddress,
      customer_Mobile: customerMobile,
      orderDeliveryTime: orderDeliveryTime,
      orderTimeStamp: firebase.firestore.Timestamp.fromDate(
        new Date()
      ).toDate(),
      order_status: "pending",
      orderTotal: orderTotal
    })
    .then((docRef) => {
      /////Send a text message to user  containing Order List, order Total and delivery Time
      //and let them know they will be contacted before shopping begins and when package is being delivered.
      console.log("Order Added Successfully with ID", docRef.id);
    })
    .catch((error) => {
      console.log("Addition of order failed", error);
    });
}

/////////// Function to update status of an order

async function updateOrderStatus(order_id, order_status) {
  return await db
    .collection("orders")
    .doc(order_id)
    .update({ order_status: order_status })
    .then(() => {
      console.log("Order Status Updated Successfully");
    })
    .catch((err) => {
      console.log("Order status update failed with error", err);
    });
}

//Get the router function in express.
var router = express.Router();

////Router to add an item to an order
router.post("/additem", (req, res) => {
  var order_id = req.body.order_id;
  var order_item = req.body.order_item;

  addOrderItem(order_id, order_item)
    .then(() => {
      res.send("Item added to order successfully");
    })
    .catch((err) => {
      console.log("Failed to add item to order", err);
    });
});

////Router to place an order
router.post("/place", (req, res) => {
  var customer_id = req.body.customer_id;
  var store_id = req.body.store_id;
  var orderItems = req.body.orderItems;
  var orderTotal = req.body.orderTotal;
  var customerAddress = req.body.orderAddress;
  var customerMobile = req.body.orderMobile;
  var orderDeliveryTime = req.body.orderDeliveryTime;

  placeOrder(
    customer_id,
    store_id,
    orderItems,
    orderTotal,
    customerAddress,
    customerMobile,
    orderDeliveryTime
  );
  res.send("Order placed succesfully");

  //////Send an order confirmation to user
});

///////// Router to get the order history of a customer
router.get("/history", (req, res) => {
  var customer_id = req.query.customer_id;

  getUserOrderHistory(customer_id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log("Error getting customer's order history");
    });
});

/// Router to update status of an order
router.put("/update", (req, res) => {
  var order_id = req.body.order_id;
  var order_status = req.body.order_status;

  updateOrderStatus(order_id, order_status)
    .then(() => {
      res.send("Order status updated succesfully");
    })
    .catch((err) => {
      console.log("Error updating order status", err);
    });
});

///////////// Router to remove item from an order
router.delete("/deleteitem", (req, res) => {
  var product_id = req.body.product_id;
  var order_id = req.body.order_id;
  removeOrderItem(order_id, product_id)
    .then(() => {
      res.send("item deleted from order successfully");
    })
    .catch((err) => {
      console.log("Error removing item from order");
    });
});

//And then export the posts router
module.exports = router;
