const db = require('../models'); // Adjust the path as needed
const JobApplicant = db.jobApplicant;
const Candidate = db.candidates;
const Job = db.jobs;
const Sequelize = db.Sequelize 

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
                appliedAt: application.appliedAt || Sequelize.NOW
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
        res.status(500).send({
            message: error.message || "Some error occurred while performing bulk upsert."
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
    try {
        const jobApplications = await JobApplicant.findAll({
            include: [
                { model: Candidate, as: 'candidate' },
                { model: Job, as: 'job' }
            ]
        });
        res.status(200).send(jobApplications);
    } catch (error) {
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
    const { interviewStatus } = req.body;

    try {
        const jobApplication = await JobApplicant.findByPk(id);

        if (!jobApplication) {
            return res.status(404).send({ message: "Job application not found" });
        }

        jobApplication.interviewStatus = interviewStatus || jobApplication.interviewStatus;
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
