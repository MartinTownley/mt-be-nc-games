const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");

const {
  categoryData,
  commentData,
  reviewData,
  userData,
} = require("../db/data/test-data");
const db = require("../db/connection.js");

beforeEach(() => {
  return seed({ categoryData, commentData, reviewData, userData });
});

afterAll(() => {
  return db.end();
});

describe("/api/reviews", () => {
  describe("GET", () => {
    it("responds with an array of reviews", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          console.log(body, "<< body");
        });
    });
    it("responds with the reviews in descending order by date", () => {});
    test("status: 404, responds with an error message when passed resource that doesn't exist", () => {
      return request(app).get("/api/somethingDifferent").expect(404);
    });
  });
});
