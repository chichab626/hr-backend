const db = require("../models");
const Candidate = db.candidates;
const Op = db.Sequelize.Op;

// Create and Save a new Candidate
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name || !req.body.email || !req.body.location || !req.body.phone) {
    res.status(400).send({
      message: "Name, email, city, and phone are required!"
    });
    return;
  }

  // Create a Candidate
  const candidate = {
    name: req.body.name,
    externalEmail: req.body.email,
    location: req.body.location,
    phone: req.body.phone,
    profileSummary: req.body.profileSummary,
    experiences: req.body.experiences
  };

  // Save Candidate in the database
  Candidate.create(candidate)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.parent?.detail || err.message || "Some error occurred while creating the Candidate."
      });
    });
};

// Retrieve all Candidates
exports.findAll = (req, res) => {
  const name = req.query.name;
  const condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  Candidate.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving candidates."
      });
    });
};

// Find a single Candidate with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Candidate.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Candidate with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Candidate with id=" + id
      });
    });
};

// Update a Candidate by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Candidate.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Candidate was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Candidate with id=${id}. Maybe Candidate was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Candidate with id=" + id
      });
    });
};

// Delete a Candidate with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Candidate.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Candidate was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Candidate with id=${id}. Maybe Candidate was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Candidate with id=" + id
      });
    });
};

// Delete all Candidates from the database.
exports.deleteAll = (req, res) => {
  Candidate.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Candidates were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all candidates."
      });
    });
};
