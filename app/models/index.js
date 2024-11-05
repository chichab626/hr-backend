const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  dialectOptions: {
    ssl: {
      require: true, // This ensures SSL is used
      rejectUnauthorized: false // This option allows self-signed certificates (use carefully)
    }
  },
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  },
  logging: console.log 
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.tutorials = require("./tutorial.model.js")(sequelize, Sequelize);
db.users = require("./user.model.js")(sequelize, Sequelize);
db.jobs = require("./job.model.js")(sequelize, Sequelize);
db.candidates = require("./candidate.model.js")(sequelize, Sequelize);
db.employees = require("./employee.model.js")(sequelize, Sequelize);
db.jobApplicants = require("./applicant.model.js")(sequelize, Sequelize);
db.checklist = require("./checklist.model.js")(sequelize, Sequelize);

db.jobs.hasMany(db.jobApplicants, { foreignKey: 'jobId', as: 'jobApplicant' });
db.jobApplicants.associate({Candidate:db.candidates, Job:db.jobs})

db.employees.hasMany(db.checklist, { foreignKey: 'employeeId', as: 'checklist' })
db.checklist.belongsTo(db.employees, { foreignKey: 'employeeId', as: 'employee'})

module.exports = db;
