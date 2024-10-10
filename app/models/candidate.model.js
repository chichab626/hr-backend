module.exports = (sequelize, Sequelize) => {
  const Candidate = sequelize.define('candidate', {
    userId: {
      type: Sequelize.INTEGER, // Typically the `userId` would reference the User model by its primary key (an integer or UUID)
      allowNull: true,
      references: {
        model: 'users', // Reference to User model (assuming the table name is 'users')
        key: 'id'
      }
    },
    resume: {
      type: Sequelize.STRING,
      allowNull: false // Link to the candidate's resume
    },
    name: { // New field for candidate's name
      type: Sequelize.STRING,
      allowNull: false // Making name required
  },
  email: { // New field for candidate's email
      type: Sequelize.STRING,
      allowNull: false, // Making email required
      validate: {
          isEmail: true // Validates that the input is a valid email format
      }
  },
  phone: { // New field for candidate's phone number
      type: Sequelize.STRING,
      allowNull: false // Making phone required
  },

    externalEmail: {
      type: Sequelize.STRING,
      allowNull: false // External email during the application process
    },
    status: {
      type: Sequelize.ENUM('Applied', 'Shortlisted', 'Interviewed', 'Rejected', 'Hired'), // Status of the candidate's application
      defaultValue: 'Applied' // Default value set to 'Applied'
    },
    jobApplied: {
      type: Sequelize.INTEGER, // Reference to JobPosting model
      references: {
        model: 'jobs', // Reference to Jobs model (assuming the table name is 'jobs')
        key: 'id'
      }
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW // Date when the candidate entry is created
    }
  }, {
    timestamps: false // Disable Sequelize's automatic timestamps if not needed
  });

  return Candidate;
};
