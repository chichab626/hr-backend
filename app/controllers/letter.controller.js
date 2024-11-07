const db = require("../models");
const Letter = db.letters;
const Candidate = db.candidates;
const Employee = db.employees;
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;

// Create and Save a new Letter
exports.create = async (req, res) => {
    const { candidateId, employeeId, jobId, subject, message, toEmail, fromEmail, status, type } = req.body;

    // Validate request
    if (!subject) {
        res.status(400).send({
            message: "Letter subject cannot be empty!"
        });
        return;
    }

    try {
        let letter;
        await sequelize.transaction(async (t) => {
            letter = await Letter.create(
                { candidateId, employeeId, jobId, subject, message, toEmail, fromEmail, status, type },
                { transaction: t }
            );
        });

        console.log('Transaction has been committed!');
        res.send(letter);
    } catch (err) {
        res.status(500).send({
            message: err.parent?.detail || err.message || "Transaction failed and has been rolled back"
        });
        console.error('Transaction failed and has been rolled back:', err);
    }
};

// Retrieve all Letters from the database.
exports.findAll = (req, res) => {
    const subject = req.query.subject;
    var condition = subject ? { subject: { [Op.iLike]: `%${subject}%` } } : null;

    Letter.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving letters."
            });
        });
};

// Find a single Letter with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Letter.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving letter with id=" + id
            });
        });
};

// Update a Letter by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Letter.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Letter was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update letter with id=${id}. Maybe letter was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating letter with id=" + id
            });
        });
};

// Delete a Letter with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Letter.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Letter was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete letter with id=${id}. Maybe letter was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete letter with id=" + id
            });
        });
};

// Delete all Letters from the database.
exports.deleteAll = (req, res) => {
    Letter.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} letters were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all letters."
            });
        });
};

// Find all Letters with a specific status
exports.findAllByStatus = (req, res) => {
    const status = req.query.status;

    Letter.findAll({ where: { status: status } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving letters."
            });
        });
};
