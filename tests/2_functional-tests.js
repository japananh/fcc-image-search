const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const History = require("../models");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  before((done) => {
    History.collection.drop();
    done();
  });

  after((done) => {
    History.collection.drop();
    done();
  });

  suite("Test GET request to /api/images/${term}", () => {
    const term = `cat-${new Date().getTime()}`;
    const defaultItemPerPage = 10;

    test("GET request to /api/images/${term} with a default page", (done) => {
      chai
        .request(server)
        .get(`/api/images/${term}`)
        .end((_err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "response should be an object");
          assert.isAtLeast(res.body.total, 0, "total should be at least 0");
          assert.isAtLeast(
            res.body.total_pages,
            0,
            "total_pages should be at least 0"
          );
          assert.isArray(
            res.body.images,
            "response should have a property images as an array"
          );
          assert.isAtMost(
            res.body.images.length,
            defaultItemPerPage,
            `images should have at most ${defaultItemPerPage}`
          );

          if (res.body.images.length) {
            res.body.images.forEach((image) => {
              assert.containsAllKeys(image, [
                "id",
                "created_at",
                "updated_at",
                "promoted_at",
                "width",
                "height",
                "color",
                "description",
                "urls",
                "categories",
                "likes",
              ]);
            });
          }

          done();
        });
    });

    test("GET request to /api/images/${term} with a valid page", (done) => {
      chai
        .request(server)
        .get(`/api/images/${term}`)
        .query({ page: 2 })
        .end((_err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "response should be an object");
          assert.isAtLeast(res.body.total, 0, "total should be at least 0");
          assert.isAtLeast(
            res.body.total_pages,
            0,
            "total_pages should be at least 0"
          );
          assert.isArray(
            res.body.images,
            "response should have a property images as an array"
          );
          assert.isAtMost(
            res.body.images.length,
            defaultItemPerPage,
            `images should have at most ${defaultItemPerPage}`
          );

          if (res.body.images.length) {
            res.body.images.forEach((image) => {
              assert.containsAllKeys(image, [
                "id",
                "created_at",
                "updated_at",
                "promoted_at",
                "width",
                "height",
                "color",
                "description",
                "urls",
                "categories",
                "likes",
              ]);
            });
          }

          done();
        });
    });

    test("GET request to /api/images/${term} with an negative page", (done) => {
      chai
        .request(server)
        .get(`/api/images/${term}`)
        .query({ page: -1 })
        .end((_err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "response should be an object");
          assert.equal(
            res.body.error,
            "Invalid input",
            "response should return error"
          );

          done();
        });
    });

    test("GET request to /api/images/${term} with an invalid page", (done) => {
      chai
        .request(server)
        .get(`/api/images/${term}`)
        .query({ page: "1a" })
        .end((_err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "response should be an object");
          assert.equal(
            res.body.error,
            "Invalid input",
            "response should return error"
          );

          done();
        });
    });
  });

  suite("Test GET request to /api/recent", () => {
    test("Viewing all recent queries", (done) => {
      chai
        .request(server)
        .get(`/api/recent/images`)
        .end((_err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body, "response should be an array");

          if (res.body.length) {
            res.body.forEach((item) => {
              assert.containsAllKeys(item, [
                "term",
                "type",
                "created_at",
                "updated_at",
                "id",
                "page",
                "per_page",
              ]);
            });
          }

          done();
        });
    });
  });
});
