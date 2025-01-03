const db = require("../models");
const User = db.users;
const Employee = db.employees;
const Candidate = db.candidates;
const Checklist = db.checklist;
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;

// Create and Save a new User
exports.create = async (req, res) => {

    const {
        email, password, role,
        name, jobTitle, location, salary, reportsTo, externalEmail, candidateId, jobId, phone
    } = req.body;

    // Validate request
    if (!email || !password || !role) {
        res.status(400).send({
            message: "User Content cannot be empty!"
        });
        return;
    }

    let isGuestToEmp = false;
    let guestUser = null
    if (externalEmail) {
        guestUser = await User.findOne({ where: { email: externalEmail } })
        isGuestToEmp = email !== externalEmail && guestUser && role === 'Employee' && guestUser.role === 'Guest'
    }

    try {
        let candidate, employee, user, checklist = {};
        await sequelize.transaction(async (t) => {
            if (isGuestToEmp) {
                // update the guest account instead of creating a new user account
                user = await User.update(
                    { email, password, role },
                    { where: { id: guestUser.id }, transaction: t }
                );
            } else {
                user = await User.create(
                    { email, password, role },
                    { transaction: t }
                );
            }
            

            if (role == 'Employee') {
                if (!name || !jobTitle || !location || !user.id || !email) {
                    throw new Error("Employee userId, name, title, location Content cannot be empty!");
                }
                
                employee = await Employee.create(
                    {
                        userId: user.id, name, email, jobTitle, location,
                        ... (salary && { salary }),
                        ... (reportsTo && { reportsTo }),
                    },
                    { transaction: t }
                );

                if (candidateId && externalEmail) {

                    checklist = await Checklist.create({
                        employeeId: employee.id,
                        jobId: jobId,
                        status: 'Added',
                        hireDate: new Date(),
                    },
                        { transaction: t });
                }

                if (candidateId && externalEmail) {
                    candidate = await Candidate.update(
                        { status: "Employee", userId: user.id, email, externalEmail },
                        { where: { id: candidateId }, transaction: t }
                    );
        
                };

            } else if (role == 'Guest') {
                const data = {
                    userId: user.id,
                    name: name,
                    externalEmail: email,
                    email: email,
                    location: location,
                    phone: phone
                  };

                candidate = await Candidate.upsert(data, { transaction: t });
            }
        });



        console.log('Transaction has been committed!');
        res.send({ user, employee, candidate, checklist });
    } catch (err) {
        res.status(500).send({
            message: err.parent?.detail || err.message || "Transaction failed and has been rolled back"
        });
        console.error('Transaction failed and has been rolled back:', err);
    }
};

// exports.create = (req, res) => {

//     const {
//         email, password, role
//     } = req.body;

//     // Validate request
//     if (!email || !password || !role) {
//         res.status(400).send({
//             message: "User Content cannot be empty!"
//         });
//         return;
//     }

//     User.create({
//         email, password, role
//     })
//     .then(data => {
//         res.send(data);
//     })
//     .catch(err => {
//         res.status(500).send({
//             message:
//                 err.message || "Some error occurred while creating the User."
//         });
//     });
// };

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
    const email = req.query.title;
    var condition = email ? { email: { [Op.iLike]: `%${email}%` } } : null;

    User.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Users."
            });
        });
};

// Find a single User with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    User.findByPk(id)
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

    User.update(req.body, {
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
            res.status(500).send({
                message: "Error updating User with id=" + id
            });
        });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    User.destroy({
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

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
    User.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Users were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all Users."
            });
        });
};

// find all published User
exports.findAllPublished = (req, res) => {
    User.findAll({ where: { published: true } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Users."
            });
        });
};
