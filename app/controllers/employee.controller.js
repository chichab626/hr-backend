const db = require("../models");
const Employee = db.employees;
const Op = db.Sequelize.Op;

// Create and Save a new User
exports.create = (req, res) => {

    const {
        userId, name, email, jobTitle, location, salary, reportsTo
    } = req.body;

    // Validate request
    if (!name || !jobTitle || !location || !userId || !email) {
        res.status(400).send({
            message: "Employee userId, name, title, location Content cannot be empty!"
        });
        return;
    }

    Employee.create({
        userId, name, email, jobTitle, location, 
        ... (salary && { salary } ),
        ... (reportsTo && { reportsTo } ),
    })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: err.parent?.detail || err.message ||  "Some error occurred while creating the User."
        });
    });
};

// Retrieve all employees from the database.
exports.findAll = (req, res) => {
    const notId = req.query.notId;
    const userId = req.query.userId;
    var condition = notId ? { id: { [Op.ne]: notId } } : null;
    condition = userId ? { userId: { [Op.eq]: userId } } : null;
    condition = 'managers' in req.query ? { jobTitle: { [Op.iLike]: `%Manager%` } } : null;

    Employee.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving employees."
            });
        });
};

// Find a single Employee with an id or userId
exports.findOne = (req, res) => {
    const id = req.params.id;

    Employee.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving User with id=" + id
            });
        });
};

// Update a User by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Employee.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "User was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).send({
                message: "Error updating User with id=" + id
            });
        });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Employee.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "User was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete User with id=${id}. Maybe User was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete User with id=" + id
            });
        });
};

// Delete all employees from the database.
exports.deleteAll = (req, res) => {
    Employee.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} employees were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all employees."
            });
        });
};

// find all published User
exports.findAllPublished = (req, res) => {
    Employee.findAll({ where: { published: true } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving employees."
            });
        });
};
