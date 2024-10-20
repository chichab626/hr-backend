module.exports = app => {
    const candidates = require("../controllers/candidate.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Candidate
    router.post("/", candidates.create);
  
    // Retrieve all Candidates with optional filters
    router.get("/", candidates.findAll);
  
    // Retrieve a Candidate by id
    router.get("/:id", candidates.findOne);
  
    // Update a Candidate's information by id
    router.put("/:id", candidates.update);
  
    // Delete a Candidate by id
    router.delete("/:id", candidates.delete);
  
    // Delete all Candidates
    router.delete("/", candidates.deleteAll);

    //bulk hire
    router.post("/bulk-hire", candidates.bulkHire);
  
  
    app.use("/api/candidates", router);
  };
  