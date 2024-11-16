const db = require('../models'); // Adjust the path as needed
const JobApplicant = db.jobApplicants;
const Candidate = db.candidates;
const Job = db.jobs;
const Sequelize = db.sequelize
const Op = db.Sequelize.Op

// Create or update multiple job applications
exports.bulkUpsert = async (req, res) => {
    const jobApplications = req.body; // Expecting an array of objects with {candidateId, jobId, interviewStatus}
    try {
        // Iterate through job applications and perform bulk upsert
        const bulkData = await Promise.all(jobApplications.map(async (application) => {
            // Upsert each job application record
            const [jobApplicant, created] = await JobApplicant.upsert({
                candidateId: application.candidateId,
                jobId: application.jobId,
                interviewStatus: application.interviewStatus || 'Not Interviewed',
                appliedAt: new Date()
            }, {
                returning: true,
                conflictFields: ['candidateId', 'jobId']
            });

            return { jobApplicant, created };
        }));

        res.status(200).send({
            message: "Bulk upsert completed successfully.",
            data: bulkData
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: error.message || "Some error occurred while performing bulk upsert."
        });
    }
};

// Create or update multiple job applications and handle related entries
exports.bulkHireAndWithdraw = async (req, res) => {
    const jobApplications = req.body; // Expecting an array of objects with { candidateId, jobId }

    // Start a transaction
    const transaction = await Sequelize.transaction();

    try {
        // Store the results of the "Hired" updates
        const hiredResults = [];

        // Bulk update to 'Hired' for the provided job applications
        await Promise.all(jobApplications.map(async (application) => {
            // Update the job application to 'Hired'
            const [updatedCount, updatedRows] = await JobApplicant.update(
                { interviewStatus: 'Hired', appliedAt : new Date() },
                {
                    where: {
                        candidateId: application.candidateId,
                        jobId: application.jobId,
                    },
                    transaction,
                    returning: true, // Ensure that Sequelize returns the updated rows
                }
            );

            // Store the updated rows
            if (updatedRows && updatedRows.length > 0) {
                hiredResults.push(...updatedRows);
            }

            // Set other job applications with the same candidateId but different jobId to 'Withdrawn'
            await JobApplicant.update(
                { interviewStatus: 'Withdrawn' },
                {
                    where: {
                        candidateId: application.candidateId,
                        jobId: { [Op.ne]: application.jobId }
                    },
                    transaction
                }
            );
        }));

        // Commit the transaction if everything is successful
        await transaction.commit();

        // Return the updated "Hired" rows in the response
        res.status(200).send({
            message: "Bulk hire and withdrawal completed successfully.",
            data: hiredResults // Returning the updated rows from the "Hired" updates
        });

    } catch (error) {
        // Rollback the transaction in case of any errors
        await transaction.rollback();
        console.error(error);
        res.status(500).send({
            message: error.message || "Some error occurred while performing bulk hire and withdrawal."
        });
    }
};

// Retrieve the job application where the candidate was hired
exports.findJobApplicationByCandidate = async (req, res) => {
    const { candidateId } = req.params;

    if (!candidateId) {
        return res.status(400).send({ message: "Candidate ID is required." });
    }

    try {
        // Fetch the job application where the candidate was hired
        const hiredApplication = await JobApplicant.findOne({
            where: {
                candidateId,
                interviewStatus: 'Hired' // Only retrieve if the candidate was hired
            },
            include: [
                { model: Job, as: 'job' },
                { model: Candidate, as: 'candidate' }
            ]
        });

        // Check if the hired job application was found
        if (!hiredApplication) {
            return res.status(404).send({ message: "No hired job application found for this candidate." });
        }

        res.status(200).send(hiredApplication);
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving the hired job application for the candidate."
        });
    }
};

// Retrieve the job applications of candidate
exports.findJobApplications = async (req, res) => {
    let { candidateId, email} = req.query;

    if (!candidateId && !email) {
        return res.status(400).send({ message: "Candidate ID or email required." });
    }

    try {
        // if candidateId is not present use email in the query
        if (!candidateId) {
            const candidate = await Candidate.findOne({ where: { email } });
            if (!candidate) {
                return res.status(404).send({ message: "Candidate not found." });
            }
            candidateId = candidate.id;
        }
        // Fetch the job application where the candidate was hired
        const applications = await JobApplicant.findAll({
            where: {
                candidateId
            },
            // include: [
            //     { model: Job, as: 'job' },
            //     { model: Candidate, as: 'candidate' }
            // ]
        });

        res.status(200).send(applications);
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving the hired job application for the candidate."
        });
    }
};


// Create a job application for a candidate
exports.applyToJob = async (req, res) => {
    const { jobId, email } = req.body;

    if (!jobId || !email) {
        return res.status(400).send({
            message: "Both jobId and email are required.",
        });
    }

    try {
        // Find the candidate by email
        const candidate = await Candidate.findOne({ where: { email: email } });

        if (!candidate) {
            return res.status(404).send({ message: "Candidate not found for the provided email." });
        }

        // Check if the job exists
        const job = await Job.findByPk(jobId);
        if (!job) {
            return res.status(404).send({ message: "Job not found." });
        }

        // Create the job application
        const jobApplication = await JobApplicant.upsert({
            candidateId: candidate.id,
            jobId: job.id,
            interviewStatus: "Not Interviewed", // Default status
            appliedAt: new Date(),
        }, {
            returning: true,
            conflictFields: ['candidateId', 'jobId']
        });

        res.status(201).send(jobApplication[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: error.message || "An error occurred while creating the job application.",
        });
    }
};

// Delete multiple job applications
exports.bulkDelete = async (req, res) => {
    const { ids } = req.body; // Expecting an array of job application IDs to delete
    console.log(req.body)
    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).send({
            message: "Please provide an array of job application IDs."
        });
    }

    try {
        // Use Sequelize's destroy method to delete records based on IDs
        const deletedCount = await JobApplicant.destroy({
            where: {
                id: ids // Assuming 'id' is the primary key for JobApplicant model
            }
        });

        res.status(200).send({
            message: `${deletedCount} job application(s) deleted successfully.`,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: error.message || "Some error occurred while performing bulk delete."
        });
    }
};


// Create a new job application
exports.create = async (req, res) => {
    const { candidateId, jobId, interviewStatus } = req.body;

    try {
        // Check if candidate and job exist
        const candidate = await Candidate.findByPk(candidateId);
        const job = await Job.findByPk(jobId);

        if (!candidate) {
            return res.status(404).send({ message: "Candidate not found" });
        }

        if (!job) {
            return res.status(404).send({ message: "Job not found" });
        }

        // Create a new job application
        const newApplication = await JobApplicant.create({
            candidateId,
            jobId,
            interviewStatus
        });

        res.status(201).send(newApplication);
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while creating the job application."
        });
    }
};

// Retrieve all job applications
exports.findAll = async (req, res) => {
    const jobId = req.query.jobId;
    const condition = jobId ? { jobId: jobId } : {};
    try {
        const jobApplications = await JobApplicant.findAll({
            where: condition,
            include: [
                { model: Candidate, as: 'candidate' },
                { model: Job, as: 'job' }
            ]
        });
        res.status(200).send(jobApplications);
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving job applications."
        });
    }
};


// Retrieve a single job application by ID
exports.findOne = async (req, res) => {
    const { id } = req.params;

    try {
        const jobApplication = await JobApplicant.findByPk(id, {
            include: [
                { model: Candidate, as: 'candidate' },
                { model: Job, as: 'job' }
            ]
        });

        if (!jobApplication) {
            return res.status(404).send({ message: "Job application not found" });
        }

        res.status(200).send(jobApplication);
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving the job application."
        });
    }
};

// Update a job application by ID
exports.update = async (req, res) => {
    const { id } = req.params;
    const { interviewStatus, nextInterview } = req.body;
    console.log(req.body)
    try {
        const jobApplication = await JobApplicant.findByPk(id);

        if (!jobApplication) {
            return res.status(404).send({ message: "Job application not found" });
        }

        // Update fields if they are provided in the request body
        jobApplication.interviewStatus = interviewStatus || jobApplication.interviewStatus;
        // Convert nextInterview to a Date object if provided
        if (nextInterview) {
            jobApplication.nextInterview = new Date(nextInterview);
        }
        await jobApplication.save();

        res.status(200).send(jobApplication);
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while updating the job application."
        });
    }
};

// Delete a job application by ID
exports.delete = async (req, res) => {
    const { id } = req.params;

    try {
        const jobApplication = await JobApplicant.findByPk(id);

        if (!jobApplication) {
            return res.status(404).send({ message: "Job application not found" });
        }

        await jobApplication.destroy();
        res.status(200).send({ message: "Job application deleted successfully!" });
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while deleting the job application."
        });
    }
};

exports.bulkUpdateInterviewStatus = async (req, res) => {
    try {
        // Update all job applications that have an interviewStatus of "Hired"
        const [updatedCount] = await JobApplicant.update(
            { interviewStatus: 'Not Interviewed' }, // New status
            {
                where: {
                    interviewStatus: { [Op.in]: ['Hired', 'Withdrawn'] } // Only update if currently hired
                }
            }
        );

        const [candidateCount] = await Candidate.update(
            { status: 'Added', userId : null }, // New status
            {
                where: {
                    status: {
                        [Op.or]: ['Hired', 'Employee'] // Update if status is 'Hired' or 'Employee'
                    }
                }
            }
        );

        res.status(200).send({
            message: "Bulk update completed successfully.",
            updatedCount, // Return the count of updated applications
            candidateCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: error.message || "Some error occurred while performing bulk update."
        });
    }
};

