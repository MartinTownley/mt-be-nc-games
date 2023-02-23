const express = require("express");
const {
  getCategories,
  getReviews,
  getCommentsByReviewId,
  getReviewById,
  postCommentByReviewId,
} = require("./server/controllers/controllers.js");
const {
  handle404NonExistentPath,
  handleCustomErrors,
  handle500ServerError,
} = require("./server/controllers/errorHandlingControllers");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewById);

app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);

app.post("/api/reviews/:review_id/comments", postCommentByReviewId);

app.use(handleCustomErrors);

app.use((err, req, res, next) => {
  res.status(400).send({ msg: "Invalid input" });
});

app.use(handle500ServerError);

module.exports = app;
