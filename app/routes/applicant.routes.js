module.exports = app => {
  const applicant = require("../controllers/applicant.controller.js");

  var router = require("express").Router();

  // Create a new applicant
  router.post("/", applicants.create);

  // Retrieve all applicants
  router.get("/", applicants.findAll);

  // Retrieve all published applicants
  router.get("/published", applicants.findAllPublished);

  // Retrieve a single applicant with id
  router.get("/:id", applicants.findOne);

  // Update a applicant with id
  router.put("/:id", applicants.update);

  // Delete a applicant with id
  router.delete("/:id", applicants.delete);

  // Delete all applicants
  router.delete("/", applicants.deleteAll);

  app.use("/api/applicants", router);
};
