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
            type: Sequelize.TEXT,
            allowNull: true // Link to the candidate's resume
        },
        name: { // New field for candidate's name
            type: Sequelize.STRING,
            allowNull: false // Making name required
        },
        email: { // New field for candidate's email
            type: Sequelize.STRING,
            allowNull: true, 
            validate: {
                isEmail: true // Validates that the input is a valid email format
            },
            unique: true
        },
        phone: { // New field for candidate's phone number
            type: Sequelize.STRING,
            allowNull: false // Making phone required
        },
        profileSummary: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        externalEmail: {
            type: Sequelize.STRING,
            allowNull: true, // External email during the application process
            validate: {
                isEmail: true // Validates that the input is a valid email format
            },
            unique: true
        },
        status: {
            type: Sequelize.ENUM('Employee', 'Added', 'Hired'), // Status of the candidate's application
            defaultValue: 'Added',
            allowNull: false
        },
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW // Date when the candidate entry is created
        },
        experiences: {
            type: Sequelize.ARRAY(Sequelize.JSON) // Store an array of experiences with rich text
        },
        location: {
            type: Sequelize.STRING,        // Maps to VARCHAR for location
            allowNull: true               // Required field
        },
    }, {
        timestamps: false // Disable Sequelize's automatic timestamps if not needed
    });

    return Candidate;
};
