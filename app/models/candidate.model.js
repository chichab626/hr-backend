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
  