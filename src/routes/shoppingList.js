var express = require("express");

//Get the router function in express.
var router = express.Router();

router.get("/", (req, res) => {
  res.send("We are getting a shopping list");
});

//And then export the posts router
module.exports = router;
