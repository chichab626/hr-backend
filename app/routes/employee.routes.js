module.exports = app => {
  const employee = require("../controllers/employee.controller.js");

  var router = require("express").Router();

  // Create a new User
  router.post("/", employee.create);

  // Retrieve all employee
  router.get("/", employee.findAll);

  // Retrieve all published employee
  router.get("/published", employee.findAllPublished);

  // Retrieve a single User with id
  router.get("/:id", employee.findOne);

  // Update a User with id
  router.put("/:id", employee.update);

  // Delete a User with id
  router.delete("/:id", employee.delete);

  // Delete all employee
  router.delete("/", employee.deleteAll);

  app.use("/api/employee", router);
};
