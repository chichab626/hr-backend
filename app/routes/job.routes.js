module.exports = app => {
  const job = require("../controllers/job.controller.js");

  var router = require("express").Router();

  // Create a new User
  router.post("/", job.create);

  // Retrieve all employee
  router.get("/", job.findAll);

  // Retrieve all published employee
  router.get("/published", job.findAllPublished);

  // Retrieve a single User with id
  router.get("/:id", job.findOne);

  // Update a User with id
  router.put("/:id", job.update);

  // Delete a User with id
  router.delete("/:id", job.delete);

  // Delete all employee
  router.delete("/", job.deleteAll);

  app.use("/api/job", router);
};
