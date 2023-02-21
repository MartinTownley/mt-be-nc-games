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
  const queryString = `
  SELECT * FROM reviews WHERE review_id = $1
  ;
  `;

  return db.query(queryString, [id]).then((response) => {
    return response.rows[0];
  });
};
