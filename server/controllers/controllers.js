const {
  fetchCategories,
  fetchReviews,
  fetchReviewById,
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
  //console.log("** controllers.js: I'm in getReviewById body");
  const { review_id } = request.params;
  fetchReviewById(review_id)
    // back from the model.
    .then((review) => {
      response.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};
