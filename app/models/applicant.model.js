module.exports = (sequelize, Sequelize) => {
    const JobApplicant = sequelize.define("jobApplicant", {
        candidateId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'candidates', // Reference to Candidate model
                key: 'id'
            },
            allowNull: false
        },
        jobId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'jobs', // Reference to Job model
                key: 'id'
            },
            allowNull: false
        },
        interviewStatus: {
            type: Sequelize.STRING,
            allowNull: true, // Optional field to track the interview status for this specific application
            defaultValue: 'Not Interviewed',
            validate: {
                isIn: [['Not Interviewed', 'Interviewed', 'Rejected', 'Hired', 'Withdrawn', 'Job Offer']],
            },
        },
        nextInterview: {
            type: Sequelize.DATE,
            allowNull: true
        },
        appliedAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    }, {
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['candidateId', 'jobId']
            }
        ]
    });

    // Define associations
    JobApplicant.associate = (models) => {
        JobApplicant.belongsTo(models.Candidate, { foreignKey: 'candidateId', as: 'candidate' });
        JobApplicant.belongsTo(models.Job, { foreignKey: 'jobId', as: 'job' });
    };

    return JobApplicant;
};
