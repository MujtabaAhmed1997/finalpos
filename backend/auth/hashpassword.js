const bcrypt = require('bcrypt');
const { compare } = require('bcrypt'); // Assuming you're using bcrypt for hashing


async function hashPassword(password) {
    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(10); // 10 rounds of salting

        // Hash the password using the salt
        const hashedPassword = await bcrypt.hash(password, salt);

        return hashedPassword;
    } catch (error) {
        // Handle error
        console.error('Error hashing password:', error);
        throw error;
    }
}

async function compareHashedPassword(password, hashedPassword) {
    try {
       
        // Compare the hashed passwords
        const match = await bcrypt.compare(password, hashedPassword);
        return match;
    } catch (error) {
        // Handle errors
        console.error('Error comparing passwords:', error);
        return false;
    }
}

module.exports = {hashPassword,compareHashedPassword};
