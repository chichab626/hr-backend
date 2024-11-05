module.exports = app => {
  const checklist = require("../controllers/checklist.controller.js");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/", checklist.create);

  // Retrieve all Tutorials
  router.get("/", checklist.findAll);

  // Retrieve all published Tutorials
  router.get("/new-hires", checklist.findAllWithEmployee);

  // Retrieve a single Tutorial with id
  router.get("/:id", checklist.findOne);

  // Update a Tutorial with id
  router.put("/:id", checklist.update);

  // Delete a Tutorial with id
  router.delete("/:id", checklist.delete);

  // Delete all Tutorials
  router.delete("/", checklist.deleteAll);

  app.use("/api/checklist", router);
};
