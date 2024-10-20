module.exports = app => {
    const applicants = require("../controllers/applicant.controller.js");

    var router = require("express").Router();

    // Route for bulk upsert
    router.post('/bulk-upsert', applicants.bulkUpsert);
    router.post('/bulk-hire', applicants.bulkHireAndWithdraw);

        // Route for bulk upsert
        router.post('/bulk-delete', applicants.bulkDelete);

    // Create a new applicant
    router.post("/", applicants.create);

    // Retrieve all applicants
    router.get("/", applicants.findAll);

    // Retrieve a single applicant with id
    router.get("/:id", applicants.findOne);

    // Update a applicant with id
    router.put("/:id", applicants.update);

    // Delete a applicant with id
    router.delete("/:id", applicants.delete);

    router.post("/bulk-reset", applicants.bulkUpdateInterviewStatus)

    app.use("/api/applicants", router);
};
