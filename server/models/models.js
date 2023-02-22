const db = require("../../db/connection.js");
exports.fetchCategories = () => {
  const queryString = `
    SELECT *
    FROM categories
    `;
  return db.query(queryString).then((response) => {
    return response.rows;
  });
};
exports.fetchReviews = () => {
  const queryString = `
  SELECT reviews.*, CAST( COUNT(comment_id) AS INT ) AS comment_count
  FROM reviews
  LEFT JOIN comments ON reviews.review_id = comments.review_id
  GROUP BY reviews.review_id
  ORDER BY reviews.created_at DESC
  ;
  `;
  return db.query(queryString).then((response) => {
    return response.rows;
  });
};
exports.fetchReviewById = (id) => {
  //console.log("** models.js: I'm in fetchReviewById body");
  const queryString = `
  SELECT * FROM reviews WHERE review_id = $1
  ;
  `;
  return db.query(queryString, [id]).then((response) => {
    // trigger error msg if rows are empty for 404
    // id number valid but non-existent
    // when an article doesn't exist, rows[0] will be undefined
    const review = response.rows[0];
    if (review === undefined) {
      // manually reject the promise to trigger catch block in controllers
      // reject this promise( db.query )
      // pass in object with status code and message to say why the promise is rejected
      //console.log(" ** fetchReviewById if block reached");
      return Promise.reject({
        status: 404,
        msg: "Invalid ID",
      });
    }

    //console.log(review, "<< review/rows[0]");
    return review;
    // goes back to controller
  });
};
exports.fetchCommentsByReviewId = () => {
  /* get an array of the comments for the given review_id:
  - comment_id
  - votes
  - created_at
  - author
  - body
  - review_id
  */
};
