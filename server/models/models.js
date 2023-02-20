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
