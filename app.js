const express = require("express");
const { getCategories } = require("./server/controllers/controllers.js");

const app = express();

app.get("/api/categories", getCategories);

module.exports = app;
