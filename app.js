const express = require("express");
const {
  getCategories,
  getReviews,
} = require("./server/controllers/controllers.js");

const app = express();

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.use((err, req, res, next) => {
  console.log(err, "<< err app.js ln 9");
  res.status(400).send({ msg: "Invalid input" });
});

module.exports = app;
