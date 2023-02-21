const { fetchReviews } = require("../models/models.js");

exports.getReviews = (request, response, next) => {
  console.log("getReviews called!");
  fetchReviews()
    .then((reviews) => {
      response.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};
