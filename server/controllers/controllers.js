const {
  fetchCategories,
  fetchReviews,
  fetchReviewById,
  fetchCommentsByReviewId,
  insertCommentByReviewId,
} = require("../models/models.js");

exports.getCategories = (request, response, next) => {
  fetchCategories()
    .then((categories) => {
      response.status(200).send({ categories });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviews = (request, response, next) => {
  fetchReviews()
    .then((reviews) => {
      response.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewById = (request, response, next) => {
  const { review_id } = request.params;
  fetchReviewById(review_id)
    .then((review) => {
      response.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByReviewId = (request, response, next) => {
  const { review_id } = request.params;
  fetchCommentsByReviewId(review_id)
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByReviewId = (request, response, next) => {
  // destructure the request body here.
  //console.log("function: postCommentsByReviewId");
  //console.log("L_____", request.body, "<< request.body");
  const { username, body } = request.body;
  const { review_id } = request.params;
  console.log(username, "<< username");
  console.log(body, "<< body");
  console.log(review_id, "<< review_id");
  insertCommentByReviewId(review_id, username, body).then((comment) => {
    response.status(201).send({ comment });
  });
};
