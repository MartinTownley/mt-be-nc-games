const db = require("../../db/connection.js");
const { checkExists } = require("../../utils.js");

// -- CATEGORIES --
exports.fetchCategories = () => {
  const queryString = `
    SELECT *
    FROM categories
    `;
  return db.query(queryString).then((response) => {
    return response.rows;
  });
};

// -- REVIEWS --
exports.fetchReviews = (category) => {
  console.log(category, "<< model: category");
  const queryValues = [];
  let queryString = `
  SELECT reviews.*, CAST( COUNT(comment_id) AS INT ) AS comment_count
  FROM reviews
  LEFT JOIN comments ON reviews.review_id = comments.review_id
  `;

  if (category) {
    queryValues.push(category);
    queryString += ` WHERE category = $1`;
  }
  queryString += ` GROUP BY reviews.review_id
  ORDER BY reviews.created_at DESC
  ;
  `;
  return db.query(queryString, queryValues).then((response) => {
    return response.rows;
  });
};

exports.fetchReviewById = (id) => {
  const queryString = `
  SELECT * FROM reviews WHERE review_id = $1
  ;
  `;
  return db.query(queryString, [id]).then((response) => {
    const review = response.rows[0];
    if (review === undefined) {
      // manually reject the promise to trigger catch block in controllers
      return Promise.reject({
        status: 404,
        msg: "ID does not exist",
      });
    }
    return review;
  });
};

exports.fetchCommentsByReviewId = (id) => {
  const queryString = `
  SELECT * 
  FROM comments 
  WHERE comments.review_id = $1
  ORDER BY comments.created_at DESC
  ;
  `;
  return db
    .query(queryString, [id])
    .then((response) => {
      // check if the response is an empty array because there are no comments, or because the review_id doesn't exist:

      if (response.rows[0] === undefined) {
        return exports.fetchReviewById(id);
      }
      const comments = response.rows;
      return comments;
    })
    .then((response) => {
      // response will either be a review, or an array of comments.
      if (Array.isArray(response)) {
        return response; // in this case, the comments array.
      }
      return []; // to satisfy test "responds with an empty array if..."
    });
};

exports.insertCommentByReviewId = (id, username, comment_body) => {
  // check for 404 first:
  return exports.fetchReviewById(id).then((review) => {
    const queryString = `
    INSERT into comments
    (body, review_id, author)
    VALUES ($1, $2, $3) 
    RETURNING *
    ;`;
    return db
      .query(queryString, [comment_body, review.review_id, username])
      .then(({ rows }) => {
        const comment = rows[0];

        return comment;
      });
  });
};

exports.updateReviewById = (id, inc_votes) => {
  return exports.fetchReviewById(id).then((review) => {
    const queryString = `
    UPDATE reviews
    SET votes = votes + $1
    WHERE review_id = $2
    RETURNING *
    ;`;
    return db
      .query(queryString, [inc_votes, review.review_id])
      .then((response) => {
        const review = response.rows[0];
        return review;
      });
  });
};

// -- USERS --
exports.fetchUsers = () => {
  const queryString = `
    SELECT *
    FROM users
    `;
  return db.query(queryString).then((response) => {
    return response.rows;
  });
};
