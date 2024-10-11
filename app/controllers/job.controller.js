const db = require("../models");
const Job = db.jobs;
const Op = db.Sequelize.Op;

// Create and Save a new job
exports.create = (req, res) => {

    const {
        jobTitle,
        location,
        salary,
        openPositions,
        jobDescription,
        hiringManagerId
    } = req.body;

    // Validate request
    if (!jobTitle || !salary) {
        res.status(400).send({
            message: "Content cannot be empty!"
        });
        return;
    }

    // Create a job
    const job = {
        title: jobTitle,
        description: jobDescription,
        salary: salary,
        location,
        openPositions,
        hiringManagerId
    };

    // Save job in the database
    Job.create(job)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the job."
            });
        });
};

// Retrieve all jobs from the database.
exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

    job.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving jobs."
            });
        });
};

// Find a single job with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    job.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving job with id=" + id
            });
        });
};

// Update a job by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    job.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "job was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update job with id=${id}. Maybe job was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating job with id=" + id
            });
        });
};

// Delete a job with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    job.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "job was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete job with id=${id}. Maybe job was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete job with id=" + id
            });
        });
};

// Delete all jobs from the database.
exports.deleteAll = (req, res) => {
    job.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} jobs were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all jobs."
            });
        });
};

// find all published job
exports.findAllPublished = (req, res) => {
    job.findAll({ where: { published: true } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving jobs."
            });
        });
};
