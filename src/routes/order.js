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
  -  Route to get user's order  History
  -  Route to get list of orders by date
  -  Route to remove item from order
  -  Route to add item to order 
  -  Route to update an order's status
  -  Route to place an order
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

  await db
    .collection("orders")
    .where("customer_id", "==", customer_id)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
      });
    })
    .catch((err) => {
      console.log("Error getting users orders", err);
    });
}

////// Function to place an order
async function placeOrder(customer_id, store_id, orderItems, orderTotal) {
  await db
    .collection("orders")
    .add({
      customer_id: customer_id,
      store_id: store_id,
      order_items: orderItems,
      orderTimeStamp: firebase.firestore.Timestamp.fromDate(
        new Date()
      ).toDate(),
      orderStatus: "pending",
      orderTotal: orderTotal
    })
    .then((docRef) => {
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

router.get("/", (req, res) => {
  res.send("Orders");
  /** 
  placeOrder(
    "iujUEwfb0aaneKnVpsda",
    "F4cOCHgRVWcxYT1FzWdq",
    [
      { product_id: "W7o9NpdYLyelvDkubYzd", price: "3.40" ,Quantity:"4"},
      { product_id: "pKpHqXNGFOUN2sZnfDAe", price: "4.40", Quantity:"5" }
    ],
    "7.80"
  );
  // getUserOrderHistory("iujUEwfb0aaneKnVpsda");
  //updateOrderStatus("tV7Jykp1IHJu1ayzWVQw", "fulfilled");

  addOrderItem("8TNVAFd6fHOId7KilE1q", {
    product_id: "pKpHqXNGFOUN2sZnfDAe",
    price: "4.40",
    Quantity: "3"
  });*/

  removeOrderItem("8TNVAFd6fHOId7KilE1q", "pKNGFOUN2sZnfDAe");
});
//placeOrder(customer_id,store_id,orderItems,orderTimeStamp,orderTotal)

//And then export the posts router
module.exports = router;
