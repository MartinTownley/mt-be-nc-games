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

describe("app", () => {
  describe("server errors", () => {
    test("404: responds with an error message when the path is invalid", () => {
      return request(app).get("/api/somethingTotallyDifferent").expect(404);
    });
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
    });
  });

  describe("/api/reviews", () => {
    describe("GET", () => {
      it("responds with an array of reviews", () => {
        return request(app)
          .get("/api/reviews")
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toBeInstanceOf(Array);
            expect(body.reviews.length).toBe(13);
            body.reviews.forEach((review) => {
              expect(review).toMatchObject({
                owner: expect.any(String),
                title: expect.any(String),
                review_id: expect.any(Number),
                category: expect.any(String),
                review_img_url: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                designer: expect.any(String),
                comment_count: expect.any(Number),
              });
            });
          });
      });
      it("responds with the reviews in descending order by date", () => {
        return request(app)
          .get("/api/reviews")
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toBeSorted({
              descending: true,
              key: "created_at",
            });
          });
      });
    });
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
    });
  });

  describe("/api/reviews", () => {
    describe("GET", () => {
      it("responds with an array of reviews", () => {
        return request(app)
          .get("/api/reviews")
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toBeInstanceOf(Array);
            expect(body.reviews.length).toBe(13);
            body.reviews.forEach((review) => {
              expect(review).toMatchObject({
                owner: expect.any(String),
                title: expect.any(String),
                review_id: expect.any(Number),
                category: expect.any(String),
                review_img_url: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                designer: expect.any(String),
                comment_count: expect.any(Number),
              });
            });
          });
      });
      it("responds with the reviews in descending order by date", () => {
        return request(app)
          .get("/api/reviews")
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toBeSorted({
              descending: true,
              key: "created_at",
            });
          });
      });
    });
  });

  describe("/api/reviews/:review_id/comments", () => {
    describe("GET", () => {
      // it("responds with an array of comments for the given review_id", () => {
      //   return request(app)
      //     .get("/api/reviews/2/comments")
      //     .expect(200)
      //     .then(({ body }) => {
      //       console.log(body);
      //       //expect (body.reviews.comments).
      //     });
      // });
    });
  });
});
