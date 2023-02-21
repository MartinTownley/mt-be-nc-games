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

describe("/api/categories", () => {
  describe("GET", () => {
    it("responds with an array of categories", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body }) => {
          expect(body.categories).toBeInstanceOf(Array);
          expect(body.categories.length).toBe(4);
          body.categories.forEach((category) => {
            expect(category).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String),
            });
          });
        });
    });
    test("status: 404, responds with an error message when passed resource that doesn't exist", () => {
      return request(app).get("/api/somethingTotallyDifferent").expect(404);
    });
  });
});
