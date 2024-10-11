module.exports = (sequelize, Sequelize) => {
    const Job = sequelize.define("job", {
        id: {
            type: Sequelize.INTEGER,       // Define as INTEGER to match PostgreSQL SERIAL
            autoIncrement: true,           // Enable auto-incrementing
            primaryKey: true               // Define as primary key
        },
        title: {
            type: Sequelize.STRING,        // Maps to VARCHAR in PostgreSQL
            allowNull: false               // Required field
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        salary: {
            type: Sequelize.DECIMAL(10, 2), // Maps to DECIMAL for salary, allows for two decimal places
            allowNull: false               // Required field
        },
        location: {
            type: Sequelize.STRING,        // Maps to VARCHAR in PostgreSQL
            allowNull: false               // Required field
        },
        openPositions: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        },
        hiringManagerId: {
            type: Sequelize.INTEGER, // Treference the Employee model by its primary key 
            allowNull: false,
            references: {
                model: 'employees', // Reference to Employee model 
                key: 'id'
            }
        },
        createdAt: {
            type: Sequelize.DATE,          // Maps to TIMESTAMP WITH TIME ZONE in PostgreSQL
            defaultValue: Sequelize.NOW    // Default value set to current date and time
        }
    }, {
        timestamps: false                // Disable default timestamps (createdAt and updatedAt)
    });

    return Job;
};
