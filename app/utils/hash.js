var bcrypt = require('bcrypt');

const hashing = (password) => {
    const saltRounds = parseInt(process.env.SALT_ROUNDS);
    var salt = bcrypt.genSaltSync(saltRounds);
    const result = bcrypt.hashSync(password, salt);

    return result;
}

const comparePassword = async (password, hash) => {
    const passwordMatch = await bcrypt.compare(password, hash);

    return passwordMatch;
}

module.exports = { hashing, comparePassword }