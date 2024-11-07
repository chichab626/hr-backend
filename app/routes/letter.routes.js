module.exports = app => {
    const letters = require("../controllers/letter.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Letter
    router.post("/", letters.create);
  
    // Retrieve all Letters
    router.get("/", letters.findAll);
  
    // Retrieve all Letters by status
    router.get("/status", letters.findAllByStatus);
  
    // Retrieve a single Letter with id
    router.get("/:id", letters.findOne);
  
    // Update a Letter with id
    router.put("/:id", letters.update);
  
    // Delete a Letter with id
    router.delete("/:id", letters.delete);
  
    // Delete all Letters
    router.delete("/", letters.deleteAll);
  
    app.use("/api/letters", router);
  };
  