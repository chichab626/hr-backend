module.exports = (sequelize, Sequelize) => {
    const Letter = sequelize.define("letter", {

        id: {
            type: Sequelize.INTEGER,       // Define as INTEGER to match PostgreSQL SERIAL
            autoIncrement: true,           // Enable auto-incrementing
            primaryKey: true               // Define as primary key
        },
        candidateId: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'candidates',
                key: 'id'
            }
        },
        employeeId: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'employees',
                key: 'id'
            }
        },
        jobId: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'jobs',
                key: 'id'
            }
        },
        subject: {
            type: Sequelize.STRING,        // Maps to VARCHAR in PostgreSQL
            allowNull: false               // Required field
        },
        message: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        toEmail: {
            type: Sequelize.STRING,
            allowNull: true, 
            validate: {
                isEmail: true
            }
        },
        fromEmail: {
            type: Sequelize.STRING,
            allowNull: true, 
            validate: {
                isEmail: true
            }
        },
        status: {
            type: Sequelize.ENUM('Draft', 'Sent', 'Archived'), 
            defaultValue: 'Draft'
        },
        type: {
            type: Sequelize.ENUM('Rejection', 'Job Offer', 'Onboarding', 'Promotion'), 
            allowNull: true,
        },
        dateSent: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW    // Default value set to current date and time
        }

    }, {
        timestamps: false                // Disable default timestamps (createdAt and updatedAt)
    });

    return Letter;
};
