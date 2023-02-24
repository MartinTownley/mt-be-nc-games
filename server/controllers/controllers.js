const {
  fetchCategories,
  fetchReviews,
  fetchReviewById,
  fetchCommentsByReviewId,
  insertCommentByReviewId,
  updateReviewById,
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
  const { username, body } = request.body;
  const { review_id } = request.params;
  insertCommentByReviewId(review_id, username, body)
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchReviewById = (request, response, next) => {
  const { inc_votes } = request.body;
  const { review_id } = request.params;
  console.log(inc_votes, "<< inc_votes");
  console.log(review_id, "<< review_id");
  updateReviewById(review_id, inc_votes)
    .then((updated_review) => {
      console.log(updated_review, "<< updated review in controller");
      response.status(200).send({ updated_review });
    })
    .catch((err) => {
      next(err);
    });
};
