// routes/auth.routes.js

module.exports = app => {
  const auth = require("../controllers/auth.controller.js");

  var router = require("express").Router();

  // Login route
  router.post("/login", auth.login);

  // You can add more routes here for register, logout, etc.

  app.use("/api/auth", router);
};
