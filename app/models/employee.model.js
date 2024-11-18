module.exports = (sequelize, Sequelize) => {
    const Employee = sequelize.define("employee", {
        userId: {
            type: Sequelize.INTEGER, // Typically the `userId` would reference the User model by its primary key (an integer or UUID)
            allowNull: false,
            references: {
                model: 'users', // Reference to User model (assuming the table name is 'users')
                key: 'id'
            }
        },
        name: {
            type: Sequelize.STRING,        // Maps to VARCHAR for employee name
            allowNull: false               // Required field
        },
        email: {
            type: Sequelize.STRING,        // Maps to VARCHAR for employee email
            allowNull: false,              // Required field
            unique: true                   // Ensure email is unique
        },
        jobTitle: {
            type: Sequelize.STRING,        // Maps to VARCHAR for job title
            allowNull: false               // Required field
        },
        location: {
            type: Sequelize.STRING,        // Maps to VARCHAR for location
            allowNull: false               // Required field
        },
        salary: {
            type: Sequelize.DECIMAL(10, 2), // Maps to DECIMAL for salary, allows for two decimal places
            allowNull: true               // Required field
        },
        reportsTo: {
            type: Sequelize.INTEGER,       // Use INTEGER to reference another employee's ID
            references: {
                model: 'employees',           // This should match the table name in your database
                key: 'id'                    // Reference the id column of the employees table
            },
            allowNull: true                // This field is optional
        },
        ratings: {
            type: Sequelize.ARRAY(Sequelize.JSONB), // Store an array of JSONB objects
            allowNull: true,         // Optional, ratings are not required initially
            defaultValue: []         // Default value as an empty array if no ratings
        },
        createdAt: {
            type: Sequelize.DATE,          // Maps to TIMESTAMP WITH TIME ZONE in PostgreSQL
            defaultValue: Sequelize.NOW    // Default value set to current date and time
        }
    }, {
        timestamps: false                // Disable default timestamps (createdAt and updatedAt)
    });

    return Employee;
};
