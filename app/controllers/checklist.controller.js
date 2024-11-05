const db = require("../models");
const Checklist = db.checklist;
const Employee = db.employees;
const Op = db.Sequelize.Op;

// Create and Save a new checklist
exports.create = (req, res) => {
    // Validate request
    if (!req.body.title) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a checklist
    const checklist = {
        title: req.body.title,
        description: req.body.description,
        published: req.body.published ? req.body.published : false
    };

    // Save checklist in the database
    Checklist.create(checklist)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.parent?.detail || err.message || "Some error occurred while creating the checklist."
            });
        });
};

// Retrieve all checklist from the database.
exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

    Checklist.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving checklist."
            });
        });
};

exports.findAllWithEmployee = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

    Checklist.findAll({
        where: condition,
        include: [{
            model: Employee, as: 'employee'
        }]
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving checklist."
            });
        });
};

// Find a single checklist with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Checklist.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving checklist with id=" + id
            });
        });
};

// Update a checklist by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
console.log(req.params)
    const checklist = Checklist.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send(checklist);
            } else {
                res.send({
                    message: `Cannot update checklist with id=${id}. Maybe checklist was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).send({
                message: "Error updating checklist with id=" + id
            });
        });
};

// Delete a checklist with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Checklist.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "checklist was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete checklist with id=${id}. Maybe checklist was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete checklist with id=" + id
            });
        });
};

// Delete all checklist from the database.
exports.deleteAll = (req, res) => {
    Checklist.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} checklist were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all checklist."
            });
        });
};

// find all published checklist
exports.findAllPublished = (req, res) => {
    Checklist.findAll({ where: { published: true } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving checklist."
            });
        });
};
