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
        ... (salary && { salary }),
        ... (reportsTo && { reportsTo }),
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.parent?.detail || err.message || "Some error occurred while creating the User."
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


// Update a User by the id or userId in the request
exports.update = (req, res) => {
    const { id } = req.params;
    let condition;
    if (id > 0) {
        condition = { where: { id: id } };
    } else {
        condition = { where: { userId: req.body.userId } };
    }

    Employee.update(req.body, condition)
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
            console.log(err);
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

// Create and Save a new Rating for an Employee
exports.createRating = (req, res) => {
    const { score, reviewerId, comments, employeeId } = req.body;

    // Validate request
    if (!score || !reviewerId || !employeeId) {
        res.status(400).send({
            message: "Rating score, reviewerId, and employeeId cannot be empty!"
        });
        return;
    }

    // Find the employee by ID
    Employee.findByPk(employeeId)
        .then(employee => {
            if (!employee) {
                return res.status(404).send({
                    message: "Employee not found!"
                });
            }

            // Create the rating object
            const newRating = {
                score,
                reviewerId,
                comments,
                createdAt: new Date(),
            };

            // Add the new rating to the employee's ratings array
            employee.ratings = [...employee.ratings, newRating]; // Ensure ratings is an array
            //employee.ratings.push(newRating);

            // Save the updated employee record
            employee.save()
                .then(updatedEmployee => {
                    res.send(updatedEmployee.ratings);
                    
                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while saving the rating."
                    });
                });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while finding the employee."
            });
        });
};

// Retrieve all ratings for a specific employee
exports.findRatingsByEmployeeId = (req, res) => {
    const id = req.params.id;

    // Find the employee by ID
    Employee.findByPk(id)
        .then(employee => {
            if (!employee) {
                return res.status(404).send({
                    message: "Employee not found!"
                });
            }

            // Send back the ratings array
            res.send(employee.ratings || []);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving ratings."
            });
        });
};

// Update a rating by index in the ratings array
exports.updateRating = (req, res) => {
    const { id } = req.params;
    const { ratings } = req.body;

    // Find the employee by ID
    Employee.findByPk(id)
        .then(employee => {
            if (!employee) {
                return res.status(404).send({
                    message: "Employee not found!"
                });
            }

            employee.ratings = ratings;
            // Save the updated employee record
            employee.save()
                .then(updatedEmployee => {
                    res.send(updatedEmployee.ratings);
                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while updating the rating."
                    });
                });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while finding the employee."
            });
        });
};

// Delete a rating by index in the ratings array
exports.deleteRating = (req, res) => {
    const { employeeId, ratingIndex } = req.params;

    // Validate request
    if (ratingIndex === undefined) {
        return res.status(400).send({
            message: "Rating index cannot be empty!"
        });
    }

    // Find the employee by ID
    Employee.findByPk(employeeId)
        .then(employee => {
            if (!employee) {
                return res.status(404).send({
                    message: "Employee not found!"
                });
            }

            // Ensure the rating index exists
            const rating = employee.ratings[ratingIndex];
            if (!rating) {
                return res.status(404).send({
                    message: "Rating not found at this index!"
                });
            }

            // Remove the rating from the array
            employee.ratings.splice(ratingIndex, 1);

            // Save the updated employee record
            employee.save()
                .then(updatedEmployee => {
                    res.send(updatedEmployee);
                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while deleting the rating."
                    });
                });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while finding the employee."
            });
        });
};