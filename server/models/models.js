const db = require("../../db/connection.js");

exports.fetchReviews = () => {
  const queryString = `
    SELECT *
    FROM reviews
    `;

  return db.query(queryString).then((response) => {
    return response.rows;
  });
};
