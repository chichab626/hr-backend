module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true               // Ensure uniqueness as in the SQL schema
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('HR', 'Employee', 'Administrator'), // Match with the ENUM in SQL
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,      // TIMESTAMP WITH TIME ZONE in Sequelize is DATE
        defaultValue: Sequelize.NOW
      }
    }, {
      timestamps: false            // Disable default Sequelize timestamps (createdAt/updatedAt)
    });
  
    return User;
  };
  