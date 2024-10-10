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
        type: Sequelize.STRING,        // Maps to VARCHAR in PostgreSQL
        allowNull: false               // Required field
      },

      requirements: {
        type: Sequelize.STRING,        // Maps to VARCHAR in PostgreSQL
        allowNull: false               // Required field
      },
      location: {
        type: Sequelize.STRING,        // Maps to VARCHAR in PostgreSQL
        allowNull: false               // Required field
      },
      salary: {
        type: Sequelize.INTEGER,        // Maps to VARCHAR in PostgreSQL
        allowNull: false               // Required field
      },
      open_positions : {
        type: Sequelize.INTEGER,        // Maps to VARCHAR in PostgreSQL
        allowNull: false               // Required field
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
  