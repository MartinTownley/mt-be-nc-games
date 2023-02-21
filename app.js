const express = require("express");
const { getReviews } = require("./server/controllers/controllers.js");

const app = express();

app.get("/api/reviews", getReviews);

module.exports = app;
