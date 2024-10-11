module.exports = (sequelize, Sequelize) => {
    const Checklist = sequelize.define("checklist", {
        employeeId: {
            type: Sequelize.INTEGER, // Treference the Employee model by its primary key 
            allowNull: false,
            references: {
                model: 'employees', // Reference to Employee model 
                key: 'id'
            }
        },
        status: {
            type: Sequelize.ENUM('Complete', 'Added', 'In-Progress'), // Match with the ENUM in SQL
            allowNull: false
          },
        resume: {
            type: Sequelize.STRING
        },
        identification: {
            type: Sequelize.STRING
        },
        taxInformation: {
            type: Sequelize.STRING
        },
        interviewDate: {
            type: Sequelize.DATE
        },
        hireDate: {
            type: Sequelize.DATE
        },
        trainingDate: {
            type: Sequelize.DATE
        }
    });

    return Checklist;
};
