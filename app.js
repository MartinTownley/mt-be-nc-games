const express = require("express");
const {
  getCategories,
  getReviews,
  getCommentsByReviewId,
  getReviewById,
} = require("./server/controllers/controllers.js");
const {
  handle404NonExistentPath,
  handleCustomErrors,
  handle500ServerError,
} = require("./server/controllers/errorHandlingControllers");

const app = express();

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

console.log("** app.js: I'm before app.get('/api/reviews/:review_id)");

//----
app.get("/api/reviews/:review_id", getReviewById);
//----

console.log("** app.js: I'm after app.get('/api/reviews/:review_id)");

app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);
// non existent paths:
//app.use(handle404NonExistentPath);

app.use(handleCustomErrors);

app.use((err, req, res, next) => {
  console.log(" ", err, " << app.use error block");
  res.status(400).send({ msg: "Invalid input" });
});
app.use(handle500ServerError);

module.exports = app;
