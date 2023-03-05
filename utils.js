const db = require("./db/connection.js");

exports.checkCategoryExists = (category) => {
  return db
    .query(`SELECT * FROM categories WHERE slug = $1;`, [category])
    .then((response) => {
      if (response.rows.length === 0) {
        // resource does not exist
        return Promise.reject({ status: 404, msg: "Resource not found" });
      } else {
        return [];
      }
    });
};
