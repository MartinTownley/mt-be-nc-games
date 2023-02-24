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
    describe("PATCH", () => {
      it("200: responds with the updated review when given a POSITIVE value for inc_votes", () => {
        const requestBody = { inc_votes: 10 };
        return request(app)
          .patch("/api/reviews/1")
          .send(requestBody)
          .expect(200)
          .then(({ body }) => {
            expect(body.updated_review).toEqual({
              review_id: 1,
              title: "Agricola",
              review_body: "Farmyard fun!",
              designer: "Uwe Rosenberg",
              review_img_url:
                "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
              votes: 11,
              category: "euro game",
              owner: "mallionaire",
              created_at: "2021-01-18T10:00:20.514Z",
            });
          });
      });
      it("200: responds with the updated review when given a NEGATIVE value for inc_votes", () => {
        const requestBody = { inc_votes: -3 };
        return request(app)
          .patch("/api/reviews/3")
          .send(requestBody)
          .expect(200)
          .then(({ body }) => {
            expect(body.updated_review).toEqual({
              review_id: 3,
              title: "Ultimate Werewolf",
              designer: "Akihisa Okui",
              owner: "bainesface",
              review_img_url:
                "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?w=700&h=700",
              review_body: "We couldn't find the werewolf!",
              category: "social deduction",
              created_at: "2021-01-18T10:01:41.251Z",
              votes: 2,
            });
          });
      });
      it("400: responds with the correct error message for a request body with missing essential properties", () => {
        // psql 23502: not null violation
        const requestBody = {};
        return request(app)
          .patch("/api/reviews/1")
          .send(requestBody)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid input");
          });
      });
      it("400: responds with the correct error message for an incorrect datatype", () => {
        const requestBody = { inc_votes: "incorrect-datatype" };
        return request(app)
          .patch("/api/reviews/1")
          .send(requestBody)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid input");
          });
      });
      it("400: responds with the correct error message for a bad review_id", () => {
        const requestBody = { inc_votes: 2 };
        return request(app)
          .patch("/api/reviews/not-and-id")
          .send(requestBody)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid input");
          });
      });
      it("404: responds with the correct error messsage for a valid but non-existent review_id", () => {
        const requestBody = { inc_votes: 2 };
        return request(app)
          .patch("/api/reviews/999")
          .send(requestBody)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("ID does not exist");
          });
      });
    });
  });

  describe("/api/reviews/:review_id/comments", () => {
    describe("GET", () => {
      it("200: responds with an array of comments for the given review_id", () => {
        return request(app)
          .get("/api/reviews/2/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).toBeInstanceOf(Array);
            expect(body.comments.length).toBe(3);
            body.comments.forEach((comment) => {
              expect(comment).toMatchObject({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                review_id: 2,
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

    describe("POST", () => {
      it("201: responds with the newly created comment object", () => {
        const requestBody = {
          username: "mallionaire",
          body: "I am the newly inserted comment body",
        };
        return request(app)
          .post("/api/reviews/1/comments")
          .send(requestBody)
          .expect(201)
          .then(({ body }) => {
            expect(body.comment).toMatchObject({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              body: "I am the newly inserted comment body",
              author: "mallionaire",
              review_id: 1,
            });
          });
      });
      it("400: responds with the correct error message for a request body with missing essential properties", () => {
        // psql 23502: not null violation
        const requestBody = {
          username: "mallionaire",
        };
        return request(app)
          .post("/api/reviews/1/comments")
          .send(requestBody)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid input");
          });
      });
      it("400: responds with the correct error message for an incorrect datatype", () => {
        const requestBody = {
          username: "not-a-username",
          body: "I am a valid body",
        };
        return request(app)
          .post("/api/reviews/1/comments")
          .send(requestBody)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid input");
          });
      });
      it("400: responds with the correct error message for a bad review_id", () => {
        const requestBody = {
          username: "mallionaire",
          body: "I am a valid body",
        };
        return request(app)
          .post("/api/reviews/not-an-id/comments")
          .send(requestBody)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid input");
          });
      });
      it("404: responds with correct error message for valid but non-existent review_id", () => {
        const requestBody = {
          username: "mallionaire",
          body: "I am a valid body",
        };
        return request(app)
          .post("/api/reviews/999/comments")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("ID does not exist");
          });
      });
    });
  });
});
