const jwt = require('jsonwebtoken');
const env = require('../config/env');

const generateAuthTokens = (user) => {
    // Assuming user object has `id` and `role`
    const { id, role } = user;

    const accessToken = jwt.sign(
        { id, role },
        env.jwt.secret,
        { expiresIn: env.jwt.accessExpiration }
    );

    const refreshToken = jwt.sign(
        { id, role },
        env.jwt.secret,
        { expiresIn: env.jwt.refreshExpiration }
    );

    return {
        accessToken,
        refreshToken
    };
};

module.exports = {
    generateAuthTokens
};
