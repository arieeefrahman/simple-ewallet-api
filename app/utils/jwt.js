var jwt = require('jsonwebtoken');

// Signing a token with 5 minutes of expiration
var accessClaims = (userId, userRoles) => {
    var secretKey = process.env.JWT_ACCESS_SECRET_KEY;
    var expiredTime = process.env.JWT_ACCESS_EXPIRE_TIME;
    let token = jwt.sign(
        { user_id: userId, roles: userRoles }, 
        secretKey, 
        { expiresIn: expiredTime }
    );

    return token;
}

var refreshClaims = (userId) => {
    var secretKey = process.env.JWT_REFRESH_SECRET_KEY;
    var expiredTime = process.env.JWT_REFRESH_EXPIRE_TIME;
    let token = jwt.sign(
        { user_id: userId}, 
        secretKey, 
        { expiresIn: expiredTime }
    );

    return token;
}

module.exports = { accessClaims, refreshClaims }