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
      return request(app).get("/api/not-a-path").expect(404);
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
  describe("/api/reviews/:review_id", () => {
    describe("GET", () => {
      it("200: responds with a single review object", () => {
        return request(app)
          .get("/api/reviews/1")
          .expect(200)
          .then(({ body }) => {
            expect(body.review).toEqual({
              review_id: 1,
              title: "Agricola",
              review_body: "Farmyard fun!",
              designer: "Uwe Rosenberg",
              review_img_url:
                "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
              votes: 1,
              category: "euro game",
              owner: "mallionaire",
              created_at: "2021-01-18T10:00:20.514Z",
            });
          });
      });
      it("400: responds with an error message when passed a bad review id", () => {
        return request(app)
          .get("/api/reviews/not-an-id")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid input");
          });
      });
      it("404: responds with correct error message for valid but non-existent review_id", () => {
        return request(app)
          .get("/api/reviews/999")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("ID does not exist");
          });
      });
    });
  });

  describe("/api/reviews/:review_id/comments", () => {
    describe("GET", () => {
      it("responds with an array of comments for the given review_id", () => {
        return request(app)
          .get("/api/reviews/2/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).toBeInstanceOf(Array);
            body.comments.forEach((comment) => {
              expect(comment).toMatchObject({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                review_id: expect.any(Number),
                created_at: expect.any(String),
                body: expect.any(String),
                author: expect.any(String),
              });
            });
          });
      });
      it("responds with most recent comments first", () => {
        return request(app)
          .get("/api/reviews/2/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).toBeSorted({
              descending: true,
              key: "created_at",
            });
          });
      });
      it("responds with an empty array if there are no comments for a given existent review_id", () => {
        return request(app)
          .get("/api/reviews/1/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments.length).toBe(0);
          });
      });
      it("404: responds with correct error message for valid but non-existent review_id", () => {
        return request(app)
          .get("/api/reviews/999/comments")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("ID does not exist");
          });
      });
      it("400: responds with correct error message for a bad review_id", () => {
        return request(app)
          .get("/api/reviews/not-an-id/comments")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid input");
          });
      });
    });
  });
});
